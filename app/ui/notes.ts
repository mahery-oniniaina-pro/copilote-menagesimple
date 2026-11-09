import { annotate } from "@/lib/annotate";
import type { Entry } from "./Workspace";

export function annotateEntry(entry: Entry) {
  const { result } = entry;
  const budget = result.context.budget ?? result.context.budgetExample;
  const computed = budget ? [String(budget.monthly), String(budget.hours), String(budget.visitsPerYear), "43.90"] : [];
  return annotate(entry.draft, result.facts, computed);
}
