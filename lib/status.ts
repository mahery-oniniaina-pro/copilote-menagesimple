export type Status = "pret" | "a_revoir" | "a_transmettre" | "a_classer";

export const STATUS_LABELS: Record<Status, string> = {
  pret: "Prêt à envoyer après relecture",
  a_revoir: "À revoir",
  a_transmettre: "À transmettre à l'équipe",
  a_classer: "À classer, sans réponse",
};
