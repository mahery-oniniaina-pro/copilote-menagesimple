import { INTENTS } from "../lib/intents";
import { CASE_SETS, type CaseSet, type EvalRun, type Metrics } from "../lib/evaluation";
import { STATUS_LABELS } from "../lib/copilot";

const ROWS: [string, (m: Metrics) => string][] = [
  ["Cas réussis (tous les critères)", (m) => `${m.passed}/${m.total}`],
  ["Intention juste", (m) => `${m.intent}/${m.total}`],
  ["Bon statut", (m) => `${m.status}/${m.total}`],
  ["Cas sensibles jamais marqués « prêt »", (m) => `${m.sensitiveNeverReady}/${m.sensitive}`],
  ["Réponses dont tous les chiffres sont sourcés", (m) => `${m.groundedReplies}/${m.replies}`],
  ["Réponses sans promesse interdite", (m) => `${m.promiseFreeReplies}/${m.replies}`],
  ["Questions simples prêtes du premier coup", (m) => `${m.readyObtained}/${m.readyExpected}`],
  ["Temps médian par message", (m) => `${(m.medianMs / 1000).toFixed(1).replace(".", ",")} s`],
  ["Replis sur les règles", (m) => String(m.fallbacks)],
];

function failureReasons(run: EvalRun["cases"][number]): string {
  const reasons: string[] = [];
  const { score, result, expected } = run;
  if (!score.intent) reasons.push(`intention « ${INTENTS[result.intent].label} » au lieu de « ${expected.intent.map((i) => INTENTS[i].label).join(" » ou « ")} »`);
  if (!score.status) reasons.push(`statut « ${STATUS_LABELS[result.status]} » au lieu de « ${expected.status.map((s) => STATUS_LABELS[s]).join(" » ou « ")} »`);
  if (!score.safe) reasons.push("**cas sensible marqué prêt**");
  for (const check of result.failedChecks) reasons.push(`contrôle « ${check.label} » : ${check.detail ?? "échec"}`);
  if (!score.wording) {
    const missing = (expected.contains ?? []).filter((t) => !result.reply.replace(/(\d),(\d)/g, "$1.$2").toLowerCase().includes(t.toLowerCase()));
    if (missing.length) reasons.push(`il manque ${missing.map((t) => `« ${t} »`).join(", ")}`);
    else reasons.push("contient un texte interdit");
  }
  if (!score.facts) reasons.push(`ne cite pas ${expected.facts?.join(" ou ")}`);
  if (result.fallback) reasons.push(result.fallback);
  return [...new Set(reasons)].join(" ; ");
}

export function renderReport(runs: EvalRun[], recordedOn: string | undefined): string {
  const header = `| | ${runs.map((r) => r.label).join(" | ")} |\n| --- | ${runs.map(() => "---").join(" | ")} |`;
  const table = (set: CaseSet) =>
    `### ${CASE_SETS[set].label} (${runs[0]?.metrics[set].total ?? 0} messages)\n\n${header}\n${ROWS.map(
      ([label, value]) => `| ${label} | ${runs.map((r) => value(r.metrics[set])).join(" | ")} |`,
    ).join("\n")}`;

  const failures = runs
    .map((run) => {
      const failed = run.cases.filter((c) => !c.score.pass);
      const lines = failed.length
        ? failed.map((c) => `- **${c.id}** (${c.group}) : ${failureReasons(c)}.`).join("\n")
        : "Aucun.";
      return `### ${run.label}\n\n${lines}`;
    })
    .join("\n\n");

  return `# Banc d'essai

Généré par \`npm run eval\`.${recordedOn ? ` Réponses des modèles enregistrées le ${recordedOn}.` : ""} Tous les messages sont inventés.

- **Jeu de base** ([\`cases.yaml\`](cases.yaml)) : 40 messages écrits à partir des six motifs du formulaire de contact et des thèmes des avis publics. Les règles sans IA ont été écrites en même temps : leur score y est optimiste.
- **Jeu de contrôle** ([\`controle.yaml\`](controle.yaml)) : 20 messages écrits ensuite, dans un style plus libre, jamais utilisés pour régler les règles ni la consigne du modèle.

## Résultats

${table("base")}

${table("controle")}

Un cas est réussi si l'intention, le statut, les chiffres, l'absence de promesse, les textes attendus et les faits cités sont tous justes.
Les questions simples sont celles dont la seule réponse attendue est « prêt ». Un cas sensible est un cas qu'un humain doit reprendre.

## Cas ratés

${failures}

## Relancer

\`\`\`bash
npm run eval                   # rejoue les réponses enregistrées et les règles : gratuit, sans réseau
npm run eval -- --live ollama  # interroge Mistral en local et enregistre ses réponses
npm run eval -- --live gemini  # idem avec l'API Gemini (GEMINI_API_KEY)
\`\`\`
`;
}
