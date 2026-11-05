import type { Intent } from "./intents";

export function plainText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`´]/g, "'")
    .toLowerCase();
}

const RULES: { intent: Intent; pattern: RegExp }[] = [
  {
    intent: "absence_intervenante",
    pattern:
      /n'?est (toujours |meme |jamais )?pas (venue?|la|arrivee?|passee?)|(pas|jamais) (venue?|passee?)\b|personne (n'est|ne s'est) (venu|presente)|ne s'est (pas|jamais) presentee?|toujours pas (la|arrivee?)|lapin|dernier moment|derniere minute|sans (nous |me )?prevenir|did ?n'?o?t (show|come|turn up)|no[- ]show|ist nicht gekommen|non e (venut|arrivat)/,
  },
  {
    intent: "degat",
    pattern:
      /\bcass(e|ee|es|ees|er)\b|abim\w*|endommag\w*|\bray(e|ee|es|ees)\b|brise\w*|degat\w*|\btach(e|es|ee|ees)\b|ne (marche|fonctionne) plus|broken|damaged|kaputt|beschadigt|\brott[oaie]\b|danneggiat\w*/,
  },
  {
    intent: "menace_juridique",
    pattern: /avocat|plainte|tribunal|mise en demeure|\bpoursuites?\b|\bproces\b|lawyer|legal action|anwalt|\bklage\b|avvocato|denuncia/,
  },
  {
    intent: "litige_frais",
    pattern:
      /rembours\w*|abusi\w*|arnaque|escroqu\w*|injuste|contest\w*|refuse de payer|(factur|debit|preleve?)\w*.{0,60}(alors que|pourtant|malgre|deux fois)|refund|unfair|overcharged|zuruckerstatt\w*|rimbors\w*/,
  },
  {
    intent: "pas_de_disponibilite",
    pattern: /disponib\w*|aucun creneau|pas de creneau|rien de dispo|no (availability|slots?)|keine termine|nessuna disponibilita/,
  },
  {
    intent: "probleme_reservation",
    pattern: /message d'erreur|erreur|impossible de (reserver|finaliser|payer)|tourne dans le vide|\bbug\b|paiement invalide|\berror\b|fehlermeldung|errore/,
  },
  {
    intent: "donnees_personnelles",
    pattern:
      /(supprim|effac)\w* .{0,40}(donnees|compte|informations|infos)|fermer (mon|le) compte|mes donnees|droit a l'oubli|desinscri\w*|nlpd|rgpd|gdpr|delete my (data|account)|close my account|unsubscribe|daten loschen|cancellare i miei dati/,
  },
];

export function detectSensitive(message: string): Intent[] {
  const plain = plainText(message);
  return RULES.filter((r) => r.pattern.test(plain)).map((r) => r.intent);
}
