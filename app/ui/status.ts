import type { Status } from "@/lib/status";

export type Decision = "signe" | "transmis";

export const STATUS_UI: Record<Status, { short: string; long: string; tone: string }> = {
  a_transmettre: { short: "À transmettre", long: "À transmettre à l'équipe", tone: "signal" },
  a_revoir: { short: "À revoir", long: "À revoir avant envoi", tone: "errata" },
  pret: { short: "Prêt à signer", long: "Prêt à relire et signer", tone: "ok" },
  a_classer: { short: "À classer", long: "À classer sans réponse", tone: "ink" },
};

export const DECISION_UI: Record<Decision, { short: string; tone: string }> = {
  signe: { short: "Signé", tone: "ok" },
  transmis: { short: "Transmis", tone: "signal" },
};

export const TONE_BADGE: Record<string, string> = {
  signal: "bg-signal text-ink-900 border-ink-900",
  errata: "bg-errata-soft text-errata border-errata/40",
  ok: "bg-ok-soft text-ok border-ok/30",
  ink: "bg-ink-50 text-ink-600 border-ink-200",
};
