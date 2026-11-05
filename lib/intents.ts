export const CONTACT_REASONS = {
  avant_reservation: "J'ai une question avant de réserver",
  reservation_existante: "J'ai besoin d'aide pour une réservation existante",
  reservation_impossible: "Je ne parviens pas à réserver",
  pas_de_disponibilite: "Pas de disponibilité dans ma ville ou à l'horaire souhaité",
  autre: "Autre demande",
} as const;

export type ContactReason = keyof typeof CONTACT_REASONS;
export type Route = "reponse" | "humain" | "classer";
export type Priority = "urgente" | "haute" | "normale";

type IntentPolicy = {
  label: string;
  description: string;
  reason: ContactReason;
  route: Route;
  priority: Priority;
};

export const INTENTS = {
  prix_budget: {
    label: "Prix et budget",
    description: "tarif horaire, coût par mois, détail du prix, TVA",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  duree_conseillee: {
    label: "Durée d'un passage",
    description: "combien d'heures prévoir, durée minimale",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  materiel_produits: {
    label: "Matériel et produits",
    description: "qui fournit l'aspirateur, la serpillière, les produits pour le ménage régulier",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  zones_desservies: {
    label: "Zones desservies",
    description: "villes, cantons, codes postaux couverts",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  statut_employeur: {
    label: "Employeur, AVS et assurances",
    description: "qui est l'employeur, déclarations AVS, salaire, assurance accident, responsabilité civile",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  autres_prestations: {
    label: "Autres prestations",
    description: "fin de bail, ménage à fond, vitres, repassage, déchets",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  fonctionnement_general: {
    label: "Fonctionnement du service",
    description: "toujours la même personne qui vient, compte, application, avis après le ménage, horaires du service client",
    reason: "avant_reservation",
    route: "reponse",
    priority: "normale",
  },
  annuler_sauter: {
    label: "Annuler ou sauter un ménage",
    description: "annuler un passage, sauter un ménage, délai de 48 heures, frais de 90 %",
    reason: "reservation_existante",
    route: "reponse",
    priority: "normale",
  },
  modifier_reservation: {
    label: "Modifier une réservation",
    description: "changer la fréquence, l'horaire, la durée, demander une remplaçante pour une date précise",
    reason: "reservation_existante",
    route: "humain",
    priority: "normale",
  },
  paiement_facturation: {
    label: "Paiement et facturation",
    description: "moment du débit, carte de crédit, facture, décompte",
    reason: "reservation_existante",
    route: "reponse",
    priority: "normale",
  },
  absence_intervenante: {
    label: "Intervenante absente ou ménage annulé par MénageSimple",
    description: "intervenante pas venue, en retard de plus d'une heure, annulation de dernière minute de notre côté",
    reason: "reservation_existante",
    route: "humain",
    priority: "urgente",
  },
  degat: {
    label: "Dégât ou casse",
    description: "objet cassé, meuble abîmé, taches sur un sol ou un tissu, appareil qui ne marche plus après le passage",
    reason: "reservation_existante",
    route: "humain",
    priority: "urgente",
  },
  insatisfaction_qualite: {
    label: "Ménage pas satisfaisant",
    description: "travail bâclé, zones oubliées, retard de l'intervenante, comportement",
    reason: "reservation_existante",
    route: "humain",
    priority: "haute",
  },
  litige_frais: {
    label: "Contestation de frais",
    description: "frais contestés, demande de remboursement, promesse non tenue, facture jugée injuste",
    reason: "reservation_existante",
    route: "humain",
    priority: "haute",
  },
  probleme_reservation: {
    label: "Réservation impossible",
    description: "erreur sur le site ou l'application, paiement refusé au moment de réserver",
    reason: "reservation_impossible",
    route: "humain",
    priority: "haute",
  },
  pas_de_disponibilite: {
    label: "Pas de disponibilité",
    description: "aucun créneau dans la ville ou à l'horaire voulu",
    reason: "pas_de_disponibilite",
    route: "humain",
    priority: "normale",
  },
  candidature_intervenante: {
    label: "Candidature d'intervenante",
    description: "une personne qui cherche du travail comme femme ou homme de ménage",
    reason: "autre",
    route: "reponse",
    priority: "normale",
  },
  donnees_personnelles: {
    label: "Données personnelles",
    description: "suppression du compte ou des données, accès aux données",
    reason: "autre",
    route: "humain",
    priority: "haute",
  },
  menace_juridique: {
    label: "Menace juridique",
    description: "avocat, plainte, mise en demeure",
    reason: "autre",
    route: "humain",
    priority: "urgente",
  },
  hors_sujet: {
    label: "Hors sujet",
    description: "démarchage commercial, spam, message sans rapport",
    reason: "autre",
    route: "classer",
    priority: "normale",
  },
} as const satisfies Record<string, IntentPolicy>;

export type Intent = keyof typeof INTENTS;
export const INTENT_IDS = Object.keys(INTENTS) as Intent[];

export function isIntent(value: unknown): value is Intent {
  return typeof value === "string" && value in INTENTS;
}
