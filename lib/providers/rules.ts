import { FREQUENCY_LABELS, formatHours, monthlyCost } from "../budget";
import type { MessageContext } from "../extract";
import { INTENTS, type Intent } from "../intents";
import type { ModelOutput } from "../prompt";
import type { Provider } from "./types";

const KEYWORDS: [Intent, RegExp][] = [
  ["hors_sujet", /\bseo\b|référencement|backlinks?|partenariat commercial|notre agence|doubler vos|nos services marketing|newsletter/i],
  ["menace_juridique", /avocat|plainte|tribunal|mise en demeure|procès/i],
  ["donnees_personnelles", /(supprim|efface)\w* .{0,40}(données|compte)|mes données|rgpd|nlpd/i],
  ["absence_intervenante", /pas (encore |toujours )?(venue?|là|arrivée?)|n'est (toujours )?pas (venue?|là|arrivée?)|absente|dernier moment|dernière minute|sans prévenir|annul\w* .{0,30}(de votre côté|vous annulez)/i],
  ["degat", /cass[ée]|abîm|endommag|tach[ée]|ne (marche|fonctionne) plus|dégât/i],
  ["litige_frais", /rembours|abusi|contest|factur\w*.{0,60}(alors que|pourtant)|offerte?.{0,40}factur/i],
  ["insatisfaction_qualite", /bâcl|mal fait|pas (été )?fait|poussière|sale\b|déçue?|retard|pas satisfai/i],
  ["probleme_reservation", /erreur|impossible de (réserver|finaliser|payer)|bug|ne fonctionne pas|invalide|tourne dans le vide|plante/i],
  ["pas_de_disponibilite", /disponibilit|aucun créneau|pas de créneau|rien de dispo/i],
  ["candidature_intervenante", /cherche (du )?travail|postuler|candidature|emploi|je suis (femme|homme) de ménage/i],
  ["annuler_sauter", /annul|saut(e|er)\b|skip|cancel|absent(e)? (la semaine|ce jour)|en vacances/i],
  ["modifier_reservation", /passer de|changer (la fréquence|l'horaire|d'horaire|de jour)|modifier|remplaçante?|en congé|qui va venir/i],
  ["paiement_facturation", /carte|débit|paiement|facture|payer|prélèv/i],
  ["duree_conseillee", /combien d'heures|minimum|durée|suffi\w*|heures (faut|prévoir)|prévoir combien/i],
  ["materiel_produits", /aspirateur|produits?|matériel|serpillière|balai/i],
  ["autres_prestations", /fin de bail|état des lieux|régie|vitres?|repassage|ménage à fond|déménag/i],
  ["statut_employeur", /employeur|avs|assuran|accident|déclar|salaire|assurée?s?/i],
  ["zones_desservies", /venez|intervenez|zones?|canton|région|code postal|putzen sie auch|do you cover|in your area/i],
  ["prix_budget", /combien|prix|coût|tarif|cher\b|how much|cost|price|kostet|preis|par mois/i],
  ["fonctionnement_general", /même (femme de ménage|intervenante|personne)|compte|application|appli|avis|horaires/i],
];

export function classify(message: string): Intent {
  return KEYWORDS.find(([, pattern]) => pattern.test(message))?.[0] ?? "fonctionnement_general";
}

type Draft = { text: string; facts: string[] };

function budgetDraft(context: MessageContext): Draft {
  if (context.budget) {
    const { hours, frequency, visitsPerYear, monthly } = context.budget;
    return {
      text: `Pour ${formatHours(hours)} ${FREQUENCY_LABELS[frequency]}, le ménage régulier revient en moyenne à CHF ${monthly} par mois, TVA comprise (${formatHours(hours)} × CHF 43.90 × ${visitsPerYear} passages par an ÷ 12).`,
      facts: ["tarif_horaire", "formule_budget"],
    };
  }
  return {
    text: `Le ménage régulier coûte CHF 43.90 de l'heure, TVA comprise. Par exemple, 2 h 30 toutes les deux semaines, la formule la plus courante, revient en moyenne à CHF ${context.budgetExample?.monthly ?? monthlyCost(2.5, "deux_semaines")} par mois. Indiquez-nous la durée et la fréquence souhaitées pour un calcul précis.`,
    facts: ["tarif_horaire", "formule_budget", "duree_mediane", "frequence_courante"],
  };
}

function draftFor(intent: Intent, message: string, context: MessageContext): Draft {
  switch (intent) {
    case "prix_budget":
      return budgetDraft(context);
    case "duree_conseillee":
      return {
        text: "La durée minimale d'un passage est de 2 heures. Pour un studio ou un 2,5 pièces entretenu régulièrement, 2 heures conviennent ; pour une maison ou un grand appartement, comptez 4 heures et plus.",
        facts: ["duree_minimale", "duree_petit_logement", "duree_grand_logement"],
      };
    case "materiel_produits":
      return { text: "Merci pour votre question. Nous vérifions ce point avec l'équipe et revenons vers vous.", facts: ["materiel_produits"] };
    case "zones_desservies": {
      const place = context.place;
      if (place && !place.served) {
        return {
          text: `Nous intervenons dans les cantons de Vaud, Valais, Genève, Fribourg et Neuchâtel. Le canton de ${place.cantonName} n'en fait pas partie.`,
          facts: ["zones"],
        };
      }
      return {
        text: "Nous intervenons dans les cantons de Vaud, Valais, Genève, Fribourg et Neuchâtel. Indiquez votre code postal dans le formulaire de réservation pour voir les créneaux disponibles.",
        facts: ["zones"],
      };
    }
    case "statut_employeur":
      return {
        text: "Avec MénageSimple, vous êtes l'employeur de votre employé de ménage. Par un mandat de gestion, nous facilitons la déclaration AVS, le paiement du salaire, des impôts et des cotisations sociales, ainsi que l'assurance-accident LAA, négociée avec Allianz. Tous nos services sont couverts par une assurance responsabilité civile AXA, jusqu'à CHF 10 millions.",
        facts: ["mandat_gestion", "laa_allianz", "assurance_rc"],
      };
    case "autres_prestations":
      if (/vitre/i.test(message)) return { text: "Oui, nous nettoyons les vitres, et notre équipe apporte le matériel.", facts: ["vitres_materiel"] };
      if (/repass/i.test(message)) return { text: "Pour le repassage, prévoyez votre fer et votre planche à repasser.", facts: ["repassage_materiel"] };
      if (/à fond/i.test(message)) {
        return {
          text: "Le ménage à fond se fait sur devis, selon la surface du logement en m² et les options choisies ; ce n'est pas le tarif horaire du ménage régulier.",
          facts: ["menage_a_fond"],
        };
      }
      return {
        text: "Oui, nous faisons le nettoyage de fin de bail, produits et matériel inclus, et le prix s'affiche avant confirmation. Si la régie refuse le travail, nous garantissons gratuitement un deuxième passage, sur justificatifs, à condition que le logement ait été entretenu dans les 30 jours précédents et entièrement vidé.",
        facts: ["fin_de_bail_prix", "garantie_fin_de_bail"],
      };
    case "fonctionnement_general":
      if (/compte/i.test(message)) return { text: "Votre compte MénageSimple est créé automatiquement après votre première réservation.", facts: ["compte_automatique"] };
      if (/appli/i.test(message)) return { text: "Vous pouvez gérer votre réservation sur votre téléphone avec notre application, ou depuis votre ordinateur.", facts: ["application"] };
      return {
        text: "Nous privilégions le même intervenant lorsque c'est possible, et nous organisons un remplacement si besoin.",
        facts: ["meme_intervenante"],
      };
    case "annuler_sauter":
      return {
        text: "Pour annuler un passage, cliquez sur le bouton « Sauter un ménage » depuis votre compte. L'annulation est gratuite jusqu'à 48 heures avant le ménage ; passé ce délai, le service est facturé à 90 %.",
        facts: ["sauter_menage", "annulation_gratuite", "annulation_48h"],
      };
    case "modifier_reservation":
      return {
        text: "Nous transmettons votre demande de modification à l'équipe, qui revient vers vous. Une modification se fait avec 48 heures de préavis.",
        facts: ["modifier_recurrent"],
      };
    case "paiement_facturation":
      if (/carte/i.test(message) && /chang|modifi|ajout|nouvelle/i.test(message)) {
        return { text: "Vous pouvez ajouter ou modifier votre carte de crédit dans la section « Détails de paiement » de votre compte.", facts: ["carte_modifier"] };
      }
      return { text: "Nous vérifions ce point avec l'équipe et revenons vers vous.", facts: ["paiement_moment"] };
    case "absence_intervenante":
      return {
        text: "Nous sommes désolés que votre ménage ne se soit pas passé comme prévu. Nous transmettons votre message à l'équipe, qui vous recontacte au plus vite.",
        facts: [],
      };
    case "degat":
      return {
        text: "Nous sommes désolés pour ce désagrément. Pouvez-vous nous envoyer des photos et une description de ce qui a été abîmé ? Nous transmettons votre message à l'équipe, qui revient vers vous.",
        facts: ["photos_client"],
      };
    case "insatisfaction_qualite":
      return {
        text: "Nous sommes désolés que le ménage ne vous ait pas satisfait. Indiquez-nous les points à reprendre : nous transmettons votre message à l'équipe, qui organise la suite avec vous.",
        facts: ["repasse_insatisfaction"],
      };
    case "litige_frais":
      return { text: "Nous avons bien reçu votre message et le transmettons à l'équipe, qui examinera votre facture et reviendra vers vous.", facts: [] };
    case "probleme_reservation":
      return {
        text: "Merci de nous avoir prévenus. Pouvez-vous nous indiquer à quelle étape le problème apparaît, le message d'erreur exact et l'appareil utilisé ? Nous transmettons votre message à l'équipe.",
        facts: [],
      };
    case "pas_de_disponibilite":
      return { text: "Merci de votre intérêt. Nous transmettons votre demande à l'équipe planning, qui vous recontacte.", facts: [] };
    case "candidature_intervenante":
      return {
        text: "Merci pour votre intérêt ! Pour travailler avec MénageSimple, il faut être basé(e) en Suisse avec un permis B, C ou G et un casier judiciaire vierge. Vous pouvez postuler sur https://menagesimple.com/postuler/.",
        facts: ["recrutement_conditions"],
      };
    case "donnees_personnelles":
      return { text: "Nous avons bien reçu votre demande concernant vos données personnelles et la transmettons à la personne responsable.", facts: [] };
    case "menace_juridique":
      return { text: "Nous avons bien reçu votre message et le transmettons à la direction, qui reviendra vers vous.", facts: [] };
    case "hors_sujet":
      return { text: "", facts: [] };
  }
}

export function rulesOutput(message: string, context: MessageContext): ModelOutput {
  const intent = classify(message);
  const draft = draftFor(intent, message, context);
  return {
    intention: intent,
    langue: "fr",
    resume: INTENTS[intent].label,
    a_transmettre: INTENTS[intent].route === "humain",
    raison_transmission: "",
    faits_utilises: draft.facts,
    reponse: draft.text,
  };
}

export function rulesProvider(): Provider {
  return {
    id: "regles",
    label: "Règles et modèles de réponse, sans IA",
    async generate({ message, context }) {
      return { output: rulesOutput(message, context), durationMs: 0 };
    },
  };
}
