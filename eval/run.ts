import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { loadCases, runEvaluation, type EvalRun } from "../lib/evaluation";
import { geminiProvider } from "../lib/providers/gemini";
import { ollamaProvider } from "../lib/providers/ollama";
import { readRecordings, recordingProvider, replayProvider } from "../lib/providers/replay";
import { rulesProvider } from "../lib/providers/rules";
import { renderReport } from "./report";

const args = process.argv.slice(2);
const live = args.includes("--live") ? args[args.indexOf("--live") + 1] : undefined;

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

  mkdirSync("eval/results", { recursive: true });
  for (const run of runs) writeFileSync(`eval/results/${run.provider}.json`, `${JSON.stringify(run, null, 2)}\n`);
  const lastRecording = recordedDates.sort().at(-1);
  const recordedOn = lastRecording && new Date(lastRecording).toLocaleDateString("fr-CH", { day: "numeric", month: "long", year: "numeric" });
  writeFileSync("eval/RAPPORT.md", renderReport(runs, recordedOn));

  for (const run of runs) {
    for (const [set, m] of Object.entries(run.metrics)) {
      console.log(`${run.label} [${set}] : ${m.passed}/${m.total} réussis, intention ${m.intent}/${m.total}, sensibles jamais prêts ${m.sensitiveNeverReady}/${m.sensitive}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
