import type { Language } from "./extract";

const GREETINGS: Record<Language, string> = {
  fr: "Bonjour,",
  en: "Hello,",
  de: "Guten Tag",
  it: "Buongiorno,",
};

const SIGN_OFFS: Record<Language, string> = {
  fr: "Bien cordialement,\nL'équipe MénageSimple",
  en: "Kind regards,\nThe MénageSimple team",
  de: "Freundliche Grüsse\nIhr MénageSimple-Team",
  it: "Cordiali saluti,\nIl team MénageSimple",
};

const GREETING = /^(bonjour|bonsoir|madame|monsieur|cher|chère|hello|hi\b|dear|good (morning|afternoon|evening)|guten (tag|morgen|abend)|hallo|sehr geehrte|liebe|buongiorno|buonasera|gentile)/i;

export function frame(reply: string, language: Language): string {
  let text = reply.trim();
  if (!text) return text;
  text = text.replace(/\n*(l'équipe ménagesimple|the ménagesimple team|ihr ménagesimple-team|il team ménagesimple)\.?\s*$/i, "").trim();
  text = text.replace(/\n*(bien cordialement|cordialement|meilleures salutations|kind regards|best regards|freundliche grüsse|mit freundlichen grüssen|cordiali saluti),?\s*$/i, "").trim();
  if (!GREETING.test(text)) text = `${GREETINGS[language]}\n\n${text}`;
  return `${text}\n\n${SIGN_OFFS[language]}`;
}
