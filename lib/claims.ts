export type ClaimKind = "montant" | "pourcentage" | "durée" | "jours" | "téléphone";

export type Claim = { kind: ClaimKind; raw: string; value: string; index: number };

const NUMBER = String.raw`(\d{1,3}(?:['’ ]\d{3})+|\d+)(?:[.,](\d{1,2}))?`;
const HOUR_WORDS: Record<string, number> = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6 };

const PATTERNS: [ClaimKind, RegExp][] = [
  ["montant", new RegExp(String.raw`(?:CHF|Fr\.|frs?\b|francs?)\s*${NUMBER}`, "gi")],
  ["montant", new RegExp(String.raw`${NUMBER}\s*(?:CHF|francs?|frs?\b|fr\.|\.-)`, "gi")],
  ["montant", new RegExp(String.raw`(?<![\d.,'’])${NUMBER}(?=\s*(?:par mois|/\s?mois|de l'heure|par heure|/\s?h\b|per month|per hour|pro (monat|stunde)))`, "gi")],
  ["montant", /(?<![\d.,'’])(\d+)[.,](\d{2})(?![\d%])/g],
  ["pourcentage", new RegExp(String.raw`${NUMBER}\s*(?:%|pour ?cents?|percent|prozent)`, "gi")],
  ["durée", /(\d+)(?:[.,](\d+))?\s*(?:h|heures?|hours?|hrs?|stunden?)(?:\s*(\d{2})\b|\b)/gi],
  ["jours", /(\d+)\s*(?:jours?|days?|tage?n?)\b/gi],
];

const PHONE = /(?:\+41|0041)\s?(?:\(0\))?\s?\d{2}(?:[\s.\-]?\d){7}|(?<!\d)0\d{2}(?:[\s.\-]?\d){7}(?!\d)/g;

export function toNumber(value: string): number {
  return parseFloat(value.replace(/['’ ]/g, "").replace(",", "."));
}

export function phoneDigits(raw: string): string {
  return raw.replace(/\(0\)/, "").replace(/\D/g, "").replace(/^(0041|41)/, "0");
}

function round(value: number): string {
  return String(Math.round(value * 100) / 100);
}

export function extractClaims(text: string): Claim[] {
  const claims: Claim[] = [];
  const taken: [number, number][] = [];
  const overlaps = (start: number, end: number) => taken.some(([s, e]) => start < e && end > s);

  for (const match of text.matchAll(PHONE)) {
    claims.push({ kind: "téléphone", raw: match[0].trim(), value: phoneDigits(match[0]), index: match.index });
    taken.push([match.index, match.index + match[0].length]);
  }
  for (const [kind, pattern] of PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const start = match.index;
      const end = start + match[0].length;
      if (overlaps(start, end)) continue;
      let value: number;
      if (kind === "durée") {
        value = parseFloat(`${match[1]}.${match[2] ?? "0"}`) + (match[3] ? parseInt(match[3], 10) / 60 : 0);
      } else {
        value = toNumber(match[2] ? `${match[1]}.${match[2]}` : match[1]);
      }
      claims.push({ kind, raw: match[0].trim(), value: round(value), index: start });
      taken.push([start, end]);
    }
  }
  for (const match of text.matchAll(/\b(une?|deux|trois|quatre|cinq|six) heures?( et demie)?/gi)) {
    if (overlaps(match.index, match.index + match[0].length)) continue;
    const value = HOUR_WORDS[match[1].toLowerCase()] + (match[2] ? 0.5 : 0);
    claims.push({ kind: "durée", raw: match[0], value: round(value), index: match.index });
  }
  return claims.sort((a, b) => a.index - b.index);
}

export function sameNumber(a: string, b: string): boolean {
  if (/^0\d{9}$/.test(a) || /^0\d{9}$/.test(b)) return a === b;
  return Math.abs(toNumber(a) - toNumber(b)) < 0.005;
}
