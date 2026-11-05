import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { EvalRun } from "./evaluation";

export function loadResults(): EvalRun[] {
  const dir = path.join(/* turbopackIgnore: true */ process.cwd(), "eval/results");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")) as EvalRun)
    .sort((a, b) => (a.provider === "regles" ? 1 : b.provider === "regles" ? -1 : a.provider.localeCompare(b.provider)));
}
