import { extractClaims, sameNumber } from "./claims";
import type { Fact } from "./knowledge";

export type Segment = { text: string; note?: number };
export type Note = { number: number; fact: Fact };

export function annotate(text: string, facts: Fact[], computed: string[] = []): { segments: Segment[]; notes: Note[] } {
  const notes: Note[] = [];
  const noteFor = (fact: Fact) => {
    const existing = notes.find((n) => n.fact.id === fact.id);
    if (existing) return existing.number;
    notes.push({ number: notes.length + 1, fact });
    return notes.length;
  };
  const formula = facts.find((f) => f.id === "formule_budget");

  const marks: { start: number; end: number; note: number }[] = [];
  for (const claim of extractClaims(text)) {
    const fact =
      facts.find((f) => f.status === "verified" && f.values.some((v) => sameNumber(claim.value, v))) ??
      (formula && computed.some((v) => sameNumber(claim.value, v)) ? formula : undefined);
    if (!fact) continue;
    marks.push({ start: claim.index, end: claim.index + claim.raw.length, note: noteFor(fact) });
  }
  for (const match of text.matchAll(/«\s?([^»]{3,40}?)\s?»/g)) {
    const phrase = match[1].toLowerCase();
    const fact = facts.find((f) => f.status === "verified" && `${f.statement} ${f.quote}`.toLowerCase().includes(phrase));
    if (fact && !marks.some((m) => m.start < match.index + match[0].length && m.end > match.index)) {
      marks.push({ start: match.index, end: match.index + match[0].length, note: noteFor(fact) });
    }
  }
  marks.sort((a, b) => a.start - b.start);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const mark of marks) {
    if (mark.start < cursor) continue;
    if (mark.start > cursor) segments.push({ text: text.slice(cursor, mark.start) });
    segments.push({ text: text.slice(mark.start, mark.end), note: mark.note });
    cursor = mark.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return { segments, notes };
}
