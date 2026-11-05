import { analyzeMessage, type Language, type MessageContext } from "./extract";
import { frame } from "./format";
import { CONTACT_REASONS, INTENTS, type Intent, type Priority } from "./intents";
import { loadKnowledge, type Contradiction, type Fact, type Knowledge } from "./knowledge";
import { modelJsonSchema, modelOutputSchema, systemPrompt, userPrompt, type ModelOutput } from "./prompt";
import { rulesOutput } from "./providers/rules";
import type { Provider } from "./providers/types";
import { verify, type Check } from "./verify";

export type Status = "pret" | "a_revoir" | "a_transmettre" | "a_classer";

export const STATUS_LABELS: Record<Status, string> = {
  pret: "Prêt à envoyer après relecture",
  a_revoir: "À revoir",
  a_transmettre: "À transmettre à l'équipe",
  a_classer: "À classer, sans réponse",
};

export type CopilotResult = {
  message: string;
  provider: { id: string; label: string };
  intent: Intent;
  intentLabel: string;
  reason: string;
  status: Status;
  priority: Priority;
  summary: string;
  handoffReason: string;
  reply: string;
  language: Language;
  facts: Fact[];
  contradictions: Contradiction[];
  checks: Check[];
  flags: string[];
  context: MessageContext;
  durationMs: number;
  fallback?: string;
};

function splitFactIds(raw: unknown, knowledge: Knowledge): { output: unknown; unknown: string[] } {
  if (!raw || typeof raw !== "object" || !Array.isArray((raw as { faits_utilises?: unknown }).faits_utilises)) {
    return { output: raw, unknown: [] };
  }
  const ids = (raw as { faits_utilises: unknown[] }).faits_utilises.map(String);
  return {
    output: { ...raw, faits_utilises: ids.filter((id) => knowledge.fact(id)) },
    unknown: ids.filter((id) => !knowledge.fact(id)),
  };
}

export async function runCopilot(message: string, provider: Provider, knowledge = loadKnowledge()): Promise<CopilotResult> {
  const rate = parseFloat(knowledge.fact("tarif_horaire")?.values[0] ?? "43.90");
  const context = analyzeMessage(message, rate);
  const schema = modelOutputSchema(knowledge);

  let output: ModelOutput;
  let unknownFactIds: string[] = [];
  let durationMs = 0;
  let fallback: string | undefined;

  try {
    const response = await provider.generate({
      system: systemPrompt(knowledge),
      user: userPrompt(message, context),
      message,
      context,
      schema: modelJsonSchema(knowledge),
    });
    durationMs = response.durationMs;
    const split = splitFactIds(response.output, knowledge);
    unknownFactIds = split.unknown;
    output = schema.parse(split.output);
  } catch (error) {
    fallback = `${provider.label} indisponible (${error instanceof Error ? error.message : "erreur"}) : réponse préparée par les règles, sans IA.`;
    output = rulesOutput(message, context);
  }

  output = { ...output, reponse: frame(output.reponse, output.langue) };
  const verification = verify(message, context, output, knowledge, unknownFactIds);
  const status: Status =
    verification.route === "classer"
      ? "a_classer"
      : verification.route === "humain"
        ? "a_transmettre"
        : verification.checks.every((c) => c.ok)
          ? "pret"
          : "a_revoir";

  return {
    message,
    provider: { id: provider.id, label: provider.label },
    intent: output.intention,
    intentLabel: INTENTS[output.intention].label,
    reason: CONTACT_REASONS[INTENTS[output.intention].reason],
    status,
    priority: verification.priority,
    summary: output.resume,
    handoffReason: output.raison_transmission,
    reply: output.reponse.trim(),
    language: context.language,
    facts: verification.facts,
    contradictions: verification.contradictions,
    checks: verification.checks,
    flags: fallback ? [fallback, ...verification.flags] : verification.flags,
    context,
    durationMs,
    fallback,
  };
}
