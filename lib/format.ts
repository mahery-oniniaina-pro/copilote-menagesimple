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

const HOLDING: Record<Language, string> = {
  fr: "Merci pour votre question. Nous la vérifions avec l'équipe et revenons vers vous rapidement.",
  en: "Thank you for your question. We are checking it with the team and will get back to you shortly.",
  de: "Vielen Dank für Ihre Frage. Wir klären sie mit dem Team und melden uns rasch bei Ihnen.",
  it: "Grazie per la sua domanda. La verifichiamo con il team e le rispondiamo al più presto.",
};

export function holdingReply(language: Language): string {
  return frame(HOLDING[language], language);
}

export function frame(reply: string, language: Language): string {
  let text = reply.trim();
  if (!text) return text;
  text = text.replace(/\n*(l'équipe ménagesimple|the ménagesimple team|ihr ménagesimple-team|il team ménagesimple)\.?\s*$/i, "").trim();
  text = text.replace(/\n*(bien cordialement|cordialement|meilleures salutations|kind regards|best regards|freundliche grüsse|mit freundlichen grüssen|cordiali saluti),?\s*$/i, "").trim();
  if (!GREETING.test(text)) text = `${GREETINGS[language]}\n\n${text}`;
  return `${text}\n\n${SIGN_OFFS[language]}`;
}
