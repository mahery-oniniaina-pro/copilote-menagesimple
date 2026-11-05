import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { loadCases, runEvaluation, type EvalRun } from "../lib/evaluation";
import { geminiProvider } from "../lib/providers/gemini";
import { ollamaProvider } from "../lib/providers/ollama";
import { readRecordings, recordingProvider, replayProvider } from "../lib/providers/replay";
import { rulesProvider } from "../lib/providers/rules";
import { renderReport } from "./report";

const args = process.argv.slice(2);
const live = args.includes("--live") ? args[args.indexOf("--live") + 1] : undefined;

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function frenchDate(isoDay: string | undefined): string | undefined {
  if (!isoDay) return undefined;
  const [year, month, day] = isoDay.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function liveProvider(name: string) {
  if (name === "ollama") return ollamaProvider();
  if (name === "gemini") return geminiProvider();
  throw new Error(`Fournisseur inconnu : ${name} (ollama ou gemini)`);
}

async function main() {
  const cases = loadCases();

  if (live) {
    const recorder = recordingProvider(liveProvider(live));
    console.log(`${recorder.label} : ${cases.length} messages`);
    await runEvaluation(recorder, cases, (r, i) => {
      recorder.save();
      console.log(`${String(i + 1).padStart(2)}/${cases.length} ${r.id.padEnd(3)} ${r.score.pass ? "ok   " : "raté "} ${r.result.status} (${(r.result.durationMs / 1000).toFixed(1)} s)`);
    });
    recorder.save();
  }

  const runs: EvalRun[] = [];
  const recordedDates: string[] = [];
  for (const file of readdirSync("recordings").filter((f) => f.endsWith(".json")).sort()) {
    const id = file.replace(/\.json$/, "");
    const recordings = readRecordings(id)!;
    const run = await runEvaluation(replayProvider(id), cases);
    runs.push({ ...run, label: recordings.label });
    recordedDates.push(...Object.values(recordings.records).map((r) => r.recordedAt.slice(0, 10)));
  }
  runs.push(await runEvaluation(rulesProvider(), cases));

  const stale = runs.filter((r) => r.metrics.base.fallbacks + r.metrics.controle.fallbacks > 0);
  if (stale.length) {
    for (const run of stale) {
      const missing = run.metrics.base.fallbacks + run.metrics.controle.fallbacks;
      console.error(`${run.label} : ${missing} messages sans réponse enregistrée pour la consigne actuelle. Relancez avec --live.`);
    }
    process.exitCode = 1;
    return;
  }

  mkdirSync("eval/results", { recursive: true });
  for (const run of runs) writeFileSync(`eval/results/${run.provider}.json`, `${JSON.stringify(run, null, 2)}\n`);
  const recordedOn = frenchDate(recordedDates.sort().at(-1));
  writeFileSync("eval/RAPPORT.md", renderReport(runs, recordedOn));

  for (const run of runs) {
    for (const [set, m] of Object.entries(run.metrics)) {
      console.log(`${run.label} [${set}] : ${m.passed}/${m.total} réussis, intention ${m.intent}/${m.total}, sensibles transmis ${m.sensitiveHandedOff}/${m.sensitive}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
