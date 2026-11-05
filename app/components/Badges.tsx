import { STATUS_LABELS, type Status } from "@/lib/status";
import type { Priority } from "@/lib/intents";

const SHORT: Record<Status, string> = {
  pret: "Prêt",
  a_revoir: "À revoir",
  a_transmettre: "À transmettre",
  a_classer: "À classer",
};

export function StatusBadge({ status, long = false }: { status: Status; long?: boolean }) {
  return <span className={`badge ${status}`}>{long ? STATUS_LABELS[status] : SHORT[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "normale") return null;
  return <span className={`badge ${priority}`}>{priority === "urgente" ? "Urgent" : "Prioritaire"}</span>;
}
