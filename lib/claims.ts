export type ClaimKind = "montant" | "pourcentage" | "durée" | "jours" | "téléphone";

export type Claim = { kind: ClaimKind; raw: string; value: string };

const PATTERNS: [ClaimKind, RegExp][] = [
  ["montant", /(?:CHF|Fr\.|francs?)\s*(\d+(?:[.,]\d{1,2})?)/gi],
  ["montant", /(\d+(?:[.,]\d{1,2})?)\s*(?:CHF|francs?|fr\.)(?![a-z])/gi],
  ["pourcentage", /(\d+(?:[.,]\d+)?)\s*(?:%|pour ?cents?|percent|prozent)/gi],
  ["durée", /(\d+(?:[.,]\d+)?)\s*(?:h|heures?|hours?|hrs?|stunden?)(?:\s*(\d{2})\b|\b)/gi],
  ["jours", /(\d+)\s*(?:jours?|days?|tage?n?)\b/gi],
];

const PHONE = /(?:\+41|0041|0)\s?(?:\d[\s.]?){8}\d/g;

export function toNumber(value: string): number {
  return parseFloat(value.replace(",", "."));
}

export function phoneDigits(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^(0041|41)/, "0");
}

export function extractClaims(text: string): Claim[] {
  const claims: Claim[] = [];
  const seen = new Set<string>();
  for (const [kind, pattern] of PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      let value = toNumber(match[1]);
      if (kind === "durée" && match[2]) value += parseInt(match[2], 10) / 60;
      const key = `${kind}:${match.index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      claims.push({ kind, raw: match[0].trim(), value: String(Math.round(value * 100) / 100) });
    }
  }
  for (const match of text.matchAll(PHONE)) {
    claims.push({ kind: "téléphone", raw: match[0].trim(), value: phoneDigits(match[0]) });
  }
  return claims;
}

export function sameNumber(a: string, b: string): boolean {
  if (/^0\d{9}$/.test(a) || /^0\d{9}$/.test(b)) return a === b;
  return Math.abs(toNumber(a) - toNumber(b)) < 0.005;
}
