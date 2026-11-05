import { monthlyCost, type Frequency, VISITS_PER_YEAR } from "./budget";
import type { Intent } from "./intents";
import { detectSensitive } from "./sensitive";

export type Language = "fr" | "en" | "de" | "it";

export const CANTONS = {
  VD: { name: "Vaud", served: true },
  GE: { name: "Genève", served: true },
  VS: { name: "Valais", served: true },
  FR: { name: "Fribourg", served: true },
  NE: { name: "Neuchâtel", served: true },
  JU: { name: "Jura", served: false },
  BE: { name: "Berne", served: false },
  ZH: { name: "Zurich", served: false },
  BS: { name: "Bâle-Ville", served: false },
  TI: { name: "Tessin", served: false },
} as const;

export type Canton = keyof typeof CANTONS;

const CITIES: Record<string, Canton> = {
  "la chaux-de-fonds": "NE",
  "le locle": "NE",
  "yverdon-les-bains": "VD",
  "villars-sur-glane": "FR",
  lausanne: "VD",
  renens: "VD",
  prilly: "VD",
  pully: "VD",
  ecublens: "VD",
  morges: "VD",
  nyon: "VD",
  gland: "VD",
  vevey: "VD",
  montreux: "VD",
  aigle: "VD",
  yverdon: "VD",
  geneve: "GE",
  geneva: "GE",
  genf: "GE",
  carouge: "GE",
  meyrin: "GE",
  vernier: "GE",
  lancy: "GE",
  sion: "VS",
  sitten: "VS",
  martigny: "VS",
  sierre: "VS",
  monthey: "VS",
  fribourg: "FR",
  freiburg: "FR",
  bulle: "FR",
  marly: "FR",
  neuchatel: "NE",
  boudry: "NE",
  peseux: "NE",
  delemont: "JU",
  porrentruy: "JU",
  bienne: "BE",
  biel: "BE",
  berne: "BE",
  bern: "BE",
  zurich: "ZH",
  bale: "BS",
  basel: "BS",
  lugano: "TI",
};

const NUMBER_WORDS: Record<string, number> = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6 };

const FREQUENCY_PATTERNS: [Frequency, RegExp][] = [
  ["deux_semaines", /toutes? les (deux|2) semaines|tous les (quinze|15) jours|(chaque|une) (semaine sur deux|quinzaine)|every (two|2|other) weeks?|bi-?weekly|fortnight|alle (zwei|2) wochen|zweiwöchentlich/i],
  ["quatre_semaines", /toutes? les (quatre|4) semaines|une fois par mois|(1|un) ?(x|fois) par mois|chaque mois|tous les mois|every (four|4) weeks|once a month|monthly|every month|einmal (im|pro) monat|monatlich|alle (vier|4) wochen/i],
  ["chaque_semaine", /chaque semaine|toutes les semaines|une fois par semaine|(1|un) ?(x|fois) par semaine|hebdo(madaire)?|every week|once a week|weekly|jede woche|wöchentlich|einmal pro woche/i],
];

const WEEKDAYS = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b(\s+(matin|après-midi|apres-midi|soir|morning|afternoon|evening|vormittag|nachmittag|\d{1,2}\s?h(\d{2})?))?/i;

const INJECTION = /(ignore[rz]?|oublie[rz]?|disregard|forget|ignorier\w*)\s+(tes|vos|les|toutes?|all|your|previous|the|deine|alle)\s+(\w+\s+){0,2}(instructions?|règles|consignes|rules|anweisungen|regeln)|system ?prompt|prompt (système|systeme)|tu es (maintenant|désormais)|you are now|du bist jetzt|mode développeur|developer mode/i;

const STOPWORDS: Record<Language, string[]> = {
  fr: ["le", "la", "les", "des", "est", "et", "je", "vous", "pour", "mon", "ma", "une", "pas", "que", "qui", "avec", "sur", "bonjour", "merci", "ménage", "combien", "nous"],
  en: ["the", "and", "is", "you", "for", "my", "how", "much", "do", "does", "what", "hello", "hi", "cleaning", "please", "we", "our", "per", "month"],
  de: ["der", "die", "das", "und", "ist", "sie", "ich", "wie", "viel", "kostet", "auch", "guten", "tag", "bitte", "wir", "nicht", "putzen", "pro", "stunde"],
  it: ["il", "lo", "gli", "che", "di", "per", "quanto", "costa", "buongiorno", "grazie", "pulizia", "sono", "della"],
};

export function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function detectLanguage(text: string): Language {
  const words = stripAccents(text.toLowerCase()).match(/[a-zäöüß]+/g) ?? [];
  let best: Language = "fr";
  let bestScore = 0;
  for (const [language, list] of Object.entries(STOPWORDS) as [Language, string[]][]) {
    const set = new Set(list.map((w) => stripAccents(w)));
    const score = words.filter((w) => set.has(w)).length;
    if (score > bestScore) {
      best = language;
      bestScore = score;
    }
  }
  return best;
}

export function extractHours(text: string): number | undefined {
  const lower = text.toLowerCase();
  const durations = lower.matchAll(/(?<!(?:à|a|vers|dès|des|avant|après|apres|at|um|ab)\s)\b(\d{1,2}(?:[.,]5)?)\s*(?:h|heures?|hours?|hrs?|stunden?)(?:\s*(\d{2})\b|\b)/g);
  for (const match of durations) {
    const hours = parseFloat(match[1].replace(",", ".")) + (match[2] ? parseInt(match[2], 10) / 60 : 0);
    if (hours >= 1 && hours <= 10) return hours;
  }
  const words = lower.match(/\b(une?|deux|trois|quatre|cinq|six) heures?( et demie)?/);
  if (words) return NUMBER_WORDS[words[1]] + (words[2] ? 0.5 : 0);
  return undefined;
}

export function extractFrequency(text: string): Frequency | undefined {
  return FREQUENCY_PATTERNS.find(([, pattern]) => pattern.test(text))?.[0];
}

export function extractPostalCode(text: string): string | undefined {
  const explicit = text.match(/\b(?:code postal|npa|cp|plz)\s*:?\s*(\d{4})\b/i);
  if (explicit) return explicit[1];
  return text.match(/\b([1-3]\d{3})\s+(?=[A-ZÉÈ][a-zéèêàç-]+)/)?.[1];
}

export function extractPlace(text: string): { city: string; canton: Canton } | undefined {
  const plain = stripAccents(text.toLowerCase());
  const names = Object.keys(CITIES).sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (new RegExp(`(^|[^a-z])${name}([^a-z]|$)`).test(plain)) {
      return { city: name, canton: CITIES[name] };
    }
  }
  return undefined;
}

export function extractSlot(text: string): string | undefined {
  return text.match(WEEKDAYS)?.[0].toLowerCase();
}

export function asksPrice(text: string): boolean {
  return /combien|prix|co[uû]t|tarif|budget|cher\b|chf|francs?|how much|price|cost|kostet|preis|quanto costa/i.test(text);
}

export function looksLikeInjection(text: string): boolean {
  return INJECTION.test(text);
}

export type Budget = { hours: number; frequency: Frequency; visitsPerYear: number; monthly: number };

function budgetFor(hours: number, frequency: Frequency, rate?: number): Budget {
  return { hours, frequency, visitsPerYear: VISITS_PER_YEAR[frequency], monthly: monthlyCost(hours, frequency, rate) };
}

export function extractRooms(text: string): number | undefined {
  const match = text.match(/(\d)\s*(½|[.,]5| 1\/2| et demi)?\s*-?\s*(?:pièces|pieces|p\.|zimmer|rooms?|room\b)/i);
  if (!match) return undefined;
  return parseInt(match[1], 10) + (match[2] ? 0.5 : 0);
}

export type MessageContext = {
  language: Language;
  hours?: number;
  frequency?: Frequency;
  budget?: Budget;
  budgetExample?: Budget;
  rooms?: number;
  postalCode?: string;
  place?: { city: string; canton: Canton; cantonName: string; served: boolean };
  slot?: string;
  asksPrice: boolean;
  cancellation: boolean;
  situations: Intent[];
  injection: boolean;
  numbers: number[];
};

export function readNumbers(text: string): number[] {
  return [...text.matchAll(/\d+(?:[.,]\d+)?/g)].map((m) => parseFloat(m[0].replace(",", ".")));
}

export function analyzeMessage(message: string, rate?: number): MessageContext {
  const hours = extractHours(message);
  const frequency = extractFrequency(message);
  const place = extractPlace(message);
  return {
    language: detectLanguage(message),
    hours,
    frequency,
    budget: hours && frequency ? budgetFor(hours, frequency, rate) : undefined,
    budgetExample:
      asksPrice(message) && !(hours && frequency)
        ? budgetFor(hours ?? 2.5, frequency ?? "deux_semaines", rate)
        : undefined,
    rooms: extractRooms(message),
    postalCode: extractPostalCode(message),
    place: place && {
      ...place,
      cantonName: CANTONS[place.canton].name,
      served: CANTONS[place.canton].served,
    },
    slot: extractSlot(message),
    asksPrice: asksPrice(message),
    cancellation: /annul|sauter|skip|cancel|absag|stornier/i.test(message),
    situations: detectSensitive(message),
    injection: looksLikeInjection(message),
    numbers: readNumbers(message),
  };
}
