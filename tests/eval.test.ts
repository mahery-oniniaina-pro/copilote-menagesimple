import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadCases, runEvaluation, type EvalRun } from "@/lib/evaluation";
import { loadKnowledge } from "@/lib/knowledge";
import { replayProvider } from "@/lib/providers/replay";
import { rulesProvider } from "@/lib/providers/rules";
import type { Provider } from "@/lib/providers/types";

const cases = loadCases();

function saved(providerId: string): EvalRun {
  return JSON.parse(readFileSync(`eval/results/${providerId}.json`, "utf8")) as EvalRun;
}

function outcome(run: EvalRun) {
  return run.cases.map((c) => ({ id: c.id, intent: c.result.intent, status: c.result.status, pass: c.score.pass }));
}

async function expectSameAsReport(provider: Provider) {
  const run = await runEvaluation(provider, cases);
  const report = saved(provider.id);
  expect(run.metrics).toEqual(report.metrics);
  expect(outcome(run)).toEqual(outcome(report));
  return run;
}

describe("banc d'essai", () => {
  it("a des identifiants uniques et ne cite que des faits connus", () => {
    const ids = cases.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const knowledge = loadKnowledge();
    for (const c of cases) {
      for (const id of c.expected.facts ?? []) expect(knowledge.fact(id), `${c.id} : ${id}`).toBeDefined();
    }
  });

  it("rejoue les règles sans IA comme dans le rapport", async () => {
    await expectSameAsReport(rulesProvider());
  });

  const recorded = existsSync("recordings") ? readdirSync("recordings").filter((f) => f.endsWith(".json")) : [];
  it.each(recorded)("rejoue %s comme dans le rapport, sans message manquant", async (file) => {
    const run = await expectSameAsReport(replayProvider(file.replace(/\.json$/, "")));
    expect(run.metrics.base.fallbacks + run.metrics.controle.fallbacks).toBe(0);
  });
});
