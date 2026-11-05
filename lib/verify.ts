import { extractClaims, sameNumber, type ClaimKind } from "./claims";
import { detectLanguage, type MessageContext } from "./extract";
import { INTENTS, type Priority, type Route } from "./intents";
import type { Contradiction, Fact, Knowledge } from "./knowledge";
import type { ModelOutput } from "./prompt";
import { findForbiddenPromises } from "./promises";
import { detectSensitive, plainText } from "./sensitive";
import { normalize } from "./text";

export type Check = { id: string; label: string; ok: boolean; detail?: string };

export type Verification = {
  holding: boolean;
  route: Route;
  priority: Priority;
  facts: Fact[];
  contradictions: Contradiction[];
  checks: Check[];
  flags: string[];
};

const PRIORITY_RANK: Record<Priority, number> = { normale: 0, haute: 1, urgente: 2 };

function openTopics(intent: keyof typeof INTENTS, message: string, context: MessageContext): string[] {
  const plain = plainText(message);
  const topics: string[] = [];
  const regularEquipment = /aspirateur|serpill|balai|produits (de nettoyage|menagers)|vacuum|\bmop\b|cleaning (products|supplies)|staubsauger|putzmittel|aspirapolvere/;
  if (regularEquipment.test(plain) || (intent === "materiel_produits" && !/vitre|repass|window|fenster/.test(plain))) topics.push("C1");
  const asksDuration = intent === "duree_conseillee" || /combien d'heures|how (many|long)|wie (viele|lange)|quante ore/.test(plain);
  if (asksDuration && context.rooms && context.rooms >= 3 && context.rooms <= 4.5) topics.push("C3");
  if (/quand .{0,40}(debit|preleve|paye)|avant ou apres le menage|when .{0,30}(charged|debited|pay)|wann .{0,30}(belastet|abgebucht)/.test(plain)) {
    topics.push("C4");
  }
  return topics;
}

const RELATED_CONTRADICTIONS: Partial<Record<keyof typeof INTENTS, string[]>> = {
  litige_frais: ["C5"],
  annuler_sauter: ["C5"],
};

function allowedNumbers(cited: Fact[], context: MessageContext, kind: ClaimKind): string[] {
  const values = cited.filter((f) => f.status === "verified").flatMap((f) => f.values);
  for (const budget of [context.budget, context.budgetExample]) {
    if (!budget) continue;
    values.push(String(budget.hours), String(budget.visitsPerYear), String(budget.monthly), "43.90", "12");
  }
  if (kind === "montant" || kind === "pourcentage") return values;
  return [...values, ...context.numbers.map(String)];
}

export function verify(
  message: string,
  context: MessageContext,
  output: ModelOutput,
  knowledge: Knowledge,
  unknownFactIds: string[] = [],
): Verification {
  const policy = INTENTS[output.intention];
  const cited = [...new Set(output.faits_utilises)].map((id) => knowledge.fact(id)).filter((f): f is Fact => !!f);
  const verified = cited.filter((f) => f.status === "verified");
  const open = cited.filter((f) => f.status === "contradictory");
  const sensitive = detectSensitive(message);
  const reply = output.reponse.trim();
  const flags: string[] = [];

  const topics = openTopics(output.intention, message, context);
  let route: Route = policy.route;
  if (output.a_transmettre && route === "reponse") route = "humain";
  if (sensitive.length && route !== "humain") route = "humain";
  if (open.length || topics.length) route = "humain";

  let priority: Priority = policy.priority;
  for (const intent of sensitive) {
    if (PRIORITY_RANK[INTENTS[intent].priority] > PRIORITY_RANK[priority]) priority = INTENTS[intent].priority;
  }

  const contradictionIds = new Set([
    ...open.map((f) => f.contradiction!),
    ...topics,
    ...(RELATED_CONTRADICTIONS[output.intention] ?? []),
  ]);
  const contradictions = [...contradictionIds].map((id) => knowledge.contradiction(id)!).filter(Boolean);

  for (const id of new Set([...open.map((f) => f.contradiction!), ...topics])) {
    flags.push(`Point non tranché sur le site (${id}) : la réponse attend une décision de l'équipe.`);
  }
  for (const intent of sensitive.filter((i) => i !== output.intention)) {
    flags.push(`Les règles détectent aussi : ${INTENTS[intent].label.toLowerCase()}.`);
  }
  if (context.injection) flags.push("Le message contient des instructions adressées à l'assistant : elles ont été ignorées.");
  for (const id of RELATED_CONTRADICTIONS[output.intention] ?? []) {
    flags.push(`À savoir : ${knowledge.contradiction(id)?.title} (${id}).`);
  }

  const checks: Check[] = [];

  checks.push({
    id: "sources",
    label: "Sources connues",
    ok: unknownFactIds.length === 0,
    detail: unknownFactIds.length ? `Identifiants inconnus : ${unknownFactIds.join(", ")}` : undefined,
  });

  const citedByModel = [...verified];
  const unsupported = [];
  for (const claim of extractClaims(reply)) {
    if (allowedNumbers(cited, context, claim.kind).some((v) => sameNumber(claim.value, v))) continue;
    const source = knowledge.facts.find((f) => f.status === "verified" && f.values.some((v) => sameNumber(claim.value, v)));
    if (source) {
      if (!cited.includes(source)) {
        cited.push(source);
        verified.push(source);
        flags.push(`Source ajoutée par le contrôle : ${source.id} (« ${claim.raw} »).`);
      }
      continue;
    }
    unsupported.push(claim);
  }
  checks.push({
    id: "chiffres",
    label: "Chiffres vérifiés",
    ok: unsupported.length === 0,
    detail: unsupported.length ? unsupported.map((claim) => `« ${claim.raw} » : aucune source`).join(" ; ") : undefined,
  });

  const promises = findForbiddenPromises(
    reply,
    citedByModel.flatMap((f) => [f.statement, f.quote]),
  );
  checks.push({
    id: "promesses",
    label: "Aucune promesse",
    ok: promises.length === 0,
    detail: promises.length ? promises.map((p) => `${p.label} (« ${p.text} »)`).join(" ; ") : undefined,
  });

  if (route === "reponse") {
    checks.push({
      id: "source_citee",
      label: "Au moins un fait cité",
      ok: verified.length > 0,
      detail: verified.length ? undefined : "La réponse ne s'appuie sur aucun fait vérifié",
    });
  }

  if (output.intention === "annuler_sauter" && route === "reponse") {
    const complete = /(?<![\d.,'’])48(?!\d)/.test(reply) && /(?<![\d.,'’])90\s?%/.test(reply);
    checks.push({
      id: "regle_annulation",
      label: "Règle d'annulation complète",
      ok: complete,
      detail: complete ? undefined : "La réponse doit rappeler les 48 heures et les 90 %",
    });
  }

  if (context.budget && output.intention === "prix_budget") {
    const expected = context.budget.monthly;
    const found = extractClaims(reply).some((c) => c.kind === "montant" && sameNumber(c.value, String(expected)));
    checks.push({
      id: "calcul",
      label: "Budget juste",
      ok: found,
      detail: found ? undefined : `Le montant attendu est CHF ${expected} par mois`,
    });
  }

  if (route !== "classer") {
    const words = reply.split(/\s+/).length;
    const tooLong = reply.length > 1200;
    checks.push({
      id: "longueur",
      label: "Longueur",
      ok: reply.length > 0 && !tooLong,
      detail: reply.length === 0 ? "Réponse vide" : tooLong ? `${words} mots, c'est trop long` : undefined,
    });
    if (reply.length > 0 && message.trim().split(/\s+/).length >= 5) {
      const replyLanguage = detectLanguage(reply);
      checks.push({
        id: "langue",
        label: "Langue du client",
        ok: replyLanguage === context.language,
        detail: replyLanguage === context.language ? undefined : `Message en ${context.language}, réponse en ${replyLanguage}`,
      });
    }
  }

  return { holding: open.length > 0 || topics.length > 0, route, priority, facts: cited, contradictions, checks, flags };
}
