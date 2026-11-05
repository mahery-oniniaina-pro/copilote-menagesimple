import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { runCopilot, type CopilotResult, type Status } from "./copilot";
import { INTENT_IDS, type Intent } from "./intents";
import { loadKnowledge } from "./knowledge";
import { PROMPT_VERSION } from "./prompt";
import type { Provider } from "./providers/types";

const STATUSES = ["pret", "a_revoir", "a_transmettre", "a_classer"] as const;

export const CASE_SETS = {
  base: { file: "eval/cases.yaml", label: "Jeu de base" },
  controle: { file: "eval/controle.yaml", label: "Jeu de contrôle" },
} as const;

export type CaseSet = keyof typeof CASE_SETS;

const caseSchema = z.object({
  id: z.string(),
  group: z.string(),
  message: z.string().min(5),
  expected: z.object({
    intent: z.array(z.enum(INTENT_IDS as [Intent, ...Intent[]])).min(1),
    status: z.array(z.enum(STATUSES)).min(1),
    facts: z.array(z.string()).optional(),
    contains: z.array(z.string()).optional(),
    not_contains: z.array(z.string()).optional(),
  }),
});

export type EvalCase = z.infer<typeof caseSchema> & { set: CaseSet };

export function loadCases(): EvalCase[] {
  return (Object.keys(CASE_SETS) as CaseSet[]).flatMap((set) => {
    const raw = parse(readFileSync(path.join(/* turbopackIgnore: true */ process.cwd(), CASE_SETS[set].file), "utf8"));
    return z.array(caseSchema).parse(raw).map((c) => ({ ...c, set }));
  });
}

export type CaseScore = {
  intent: boolean;
  status: boolean;
  safe: boolean;
  grounded: boolean;
  noPromise: boolean;
  wording: boolean;
  facts: boolean;
  pass: boolean;
};

export type CaseSummary = {
  intent: Intent;
  status: Status;
  priority: string;
  summary: string;
  reply: string;
  facts: string[];
  failedChecks: { id: string; label: string; detail?: string }[];
  flags: string[];
  durationMs: number;
  fallback?: string;
};

export type CaseResult = {
  id: string;
  set: CaseSet;
  group: string;
  message: string;
  expected: EvalCase["expected"];
  result: CaseSummary;
  score: CaseScore;
};

export type Metrics = {
  total: number;
  passed: number;
  intent: number;
  status: number;
  sensitive: number;
  sensitiveHandedOff: number;
  replies: number;
  groundedReplies: number;
  promiseFreeReplies: number;
  readyExpected: number;
  readyObtained: number;
  medianMs: number;
  fallbacks: number;
};

export type EvalRun = {
  provider: string;
  label: string;
  promptVersion: string;
  metrics: Record<CaseSet, Metrics>;
  cases: CaseResult[];
};

function comparable(text: string): string {
  return text.replace(/(\d),(\d)/g, "$1.$2").toLowerCase();
}

export function isSensitive(c: EvalCase): boolean {
  return c.expected.status.length === 1 && c.expected.status[0] === "a_transmettre";
}

export function scoreCase(c: EvalCase, result: CopilotResult): CaseScore {
  const check = (id: string) => result.checks.find((x) => x.id === id)?.ok ?? true;
  const reply = comparable(result.reply);
  const cited = result.facts.map((f) => f.id);
  const score = {
    intent: c.expected.intent.includes(result.intent),
    status: c.expected.status.includes(result.status),
    safe: !isSensitive(c) || result.status === "a_transmettre",
    grounded: check("chiffres"),
    noPromise: check("promesses"),
    wording:
      (c.expected.contains ?? []).every((t) => reply.includes(comparable(t))) &&
      !(c.expected.not_contains ?? []).some((t) => reply.includes(comparable(t))),
    facts: result.status !== "pret" || !c.expected.facts || c.expected.facts.some((id) => cited.includes(id)),
  };
  return { ...score, pass: Object.values(score).every(Boolean) };
}

function summarize(result: CopilotResult): CaseSummary {
  return {
    intent: result.intent,
    status: result.status,
    priority: result.priority,
    summary: result.summary,
    reply: result.reply,
    facts: result.facts.map((f) => f.id),
    failedChecks: result.checks.filter((c) => !c.ok).map(({ id, label, detail }) => ({ id, label, detail })),
    flags: result.flags,
    durationMs: result.durationMs,
    fallback: result.fallback,
  };
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

export function computeMetrics(cases: CaseResult[]): Metrics {
  const sensitive = cases.filter((c) => c.expected.status.length === 1 && c.expected.status[0] === "a_transmettre");
  const replies = cases.filter((c) => c.result.reply);
  return {
    total: cases.length,
    passed: cases.filter((c) => c.score.pass).length,
    intent: cases.filter((c) => c.score.intent).length,
    status: cases.filter((c) => c.score.status).length,
    sensitive: sensitive.length,
    sensitiveHandedOff: sensitive.filter((c) => c.result.status === "a_transmettre").length,
    replies: replies.length,
    groundedReplies: replies.filter((c) => c.score.grounded).length,
    promiseFreeReplies: replies.filter((c) => c.score.noPromise).length,
    readyExpected: cases.filter((c) => c.expected.status.length === 1 && c.expected.status[0] === "pret").length,
    readyObtained: cases.filter((c) => c.expected.status.length === 1 && c.expected.status[0] === "pret" && c.result.status === "pret").length,
    medianMs: median(cases.map((c) => c.result.durationMs)),
    fallbacks: cases.filter((c) => c.result.fallback).length,
  };
}

export async function runEvaluation(
  provider: Provider,
  cases = loadCases(),
  onCase?: (result: CaseResult, index: number) => void,
): Promise<EvalRun> {
  const knowledge = loadKnowledge();
  const results: CaseResult[] = [];
  for (const [index, c] of cases.entries()) {
    const result = await runCopilot(c.message, provider, knowledge);
    const caseResult = {
      id: c.id,
      set: c.set,
      group: c.group,
      message: c.message,
      expected: c.expected,
      result: summarize(result),
      score: scoreCase(c, result),
    };
    results.push(caseResult);
    onCase?.(caseResult, index);
  }
  return {
    provider: provider.id,
    label: provider.label,
    promptVersion: PROMPT_VERSION,
    metrics: {
      base: computeMetrics(results.filter((r) => r.set === "base")),
      controle: computeMetrics(results.filter((r) => r.set === "controle")),
    },
    cases: results,
  };
}
