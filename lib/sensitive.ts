import type { Intent } from "./intents";

const RULES: { intent: Intent; pattern: RegExp }[] = [
  {
    intent: "absence_intervenante",
    pattern:
      /n'?est (toujours )?pas (venue?|là|arrivée?|passée?)|(pas|jamais) (venue?|passée?)|personne (n'est|ne s'est) (venu|présenté)|toujours pas (là|arrivée?)|lapin|annul\w* (au )?(dernier moment|dernière minute)|(dernier moment|dernière minute)|sans (nous |me )?prévenir|didn'?t (show|come)|no[- ]show|ist nicht gekommen/i,
  },
  {
    intent: "degat",
    pattern: /cass(é|ée|és|ées|e|er)(?![a-zàâäéèêëîïôöùûüç])|abîm\w*|endommag\w*|ray(é|ée|és|ées)(?![a-zàâäéèêëîïôöùûüç])|brisé\w*|dégât\w*|tach(é|ée|és|ées)(?![a-zàâäéèêëîïôöùûüç])|ne (marche|fonctionne) plus|broken|damaged|kaputt|beschädigt/i,
  },
  {
    intent: "menace_juridique",
    pattern: /avocat|plainte|tribunal|mise en demeure|poursuites?|procès|lawyer|legal action|anwalt|klage/i,
  },
  {
    intent: "litige_frais",
    pattern: /rembours\w*|abusi\w*|arnaque|escroqu\w*|injuste|contest\w*|factur\w*.{0,60}(alors que|pourtant|malgré)|refund|unfair|zurückerstatt\w*/i,
  },
  {
    intent: "donnees_personnelles",
    pattern: /(supprim|efface)\w* .{0,40}(données|compte|informations)|mes données|droit à l'oubli|nlpd|rgpd|gdpr|delete my (data|account)|daten löschen/i,
  },
];

export function detectSensitive(message: string): Intent[] {
  return RULES.filter((r) => r.pattern.test(message)).map((r) => r.intent);
}
