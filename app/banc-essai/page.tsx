import type { CaseSet, EvalRun, Metrics } from "@/lib/evaluation";
import { loadResults } from "@/lib/results";
import { Planche } from "../ui/Planche";

export const metadata = { title: "Banc d'essai · Copilote" };

const ROWS: [string, (m: Metrics) => string][] = [
  ["Cas réussis, tous critères", (m) => `${m.passed}/${m.total}`],
  ["Intention juste", (m) => `${m.intent}/${m.total}`],
  ["Bon statut", (m) => `${m.status}/${m.total}`],
  ["Cas sensibles transmis à l'équipe", (m) => `${m.sensitiveHandedOff}/${m.sensitive}`],
  ["Réponses aux chiffres tous sourcés", (m) => `${m.groundedReplies}/${m.replies}`],
  ["Réponses sans promesse interdite", (m) => `${m.promiseFreeReplies}/${m.replies}`],
  ["Questions simples prêtes du premier coup", (m) => `${m.readyObtained}/${m.readyExpected}`],
  ["Temps médian par message", (m) => `${(m.medianMs / 1000).toFixed(1).replace(".", ",")} s`],
];

function readySensitive(run: EvalRun) {
  return run.cases.filter((c) => c.expected.status.length === 1 && c.expected.status[0] === "a_transmettre" && c.result.status === "pret").length;
}

function Comparison({ runs, set, title }: { runs: EvalRun[]; set: CaseSet; title: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[460px] border-collapse text-[13.5px]">
        <caption className="pb-2 text-left text-[13px] font-semibold">{title}</caption>
        <thead>
          <tr className="border-b border-ink-900 text-left">
            <th scope="col" className="py-2 pr-4 font-medium text-ink-500" />
            {runs.map((run) => (
              <th key={run.provider} scope="col" className="py-2 pr-4 text-[12.5px] font-medium">
                {run.provider === "regles" ? "Règles sans IA" : run.label.split(" via ")[0]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([label, value]) => (
            <tr key={label} className="border-b border-ink-100">
              <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-600">
                {label}
              </th>
              {runs.map((run) => (
                <td key={run.provider} className="tabular py-2 pr-4 font-code text-[13px]">
                  {value(run.metrics[set])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BancEssai() {
  const runs = loadResults();
  const main = runs[0];
  if (!main) return <p className="p-8">Aucun résultat : lancez npm run eval.</p>;
  const rules = runs.find((r) => r.provider === "regles");
  const control = main.metrics.controle;

  return (
    <main className="mx-auto w-full max-w-[1120px] px-4 py-6 md:px-8 md:py-10">
      <header className="max-w-[70ch]">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Banc d&apos;essai</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          60 messages inventés, chacun avec la réponse attendue. Les 20 messages de contrôle ont été écrits après coup et
          n&apos;ont jamais servi à régler le copilote : ils mesurent ce qu&apos;il fait face à des formulations qu&apos;il n&apos;a jamais
          vues. Tout se relance gratuitement, sans modèle ni clé, avec <code className="font-code text-[13px]">npm run eval</code>.
        </p>
      </header>

      <p className="mt-6 max-w-[74ch] rounded-lg border border-ink-200 bg-sheet px-5 py-4 text-[15.5px] leading-relaxed">
        Sur les 20 messages jamais vus, <span className="font-semibold">{main.label.split(" via ")[0]} en réussit{" "}
        <span className="tabular">{control.passed}</span></span>
        {rules && <>, la version sans IA <span className="tabular">{rules.metrics.controle.passed}</span></>}. Sur les{" "}
        <span className="tabular">{control.sensitive + main.metrics.base.sensitive}</span> cas sensibles (argent, dégât, absence,
        données), <span className="font-semibold">{readySensitive(main) === 0 ? "aucun" : readySensitive(main)} n&apos;est sorti prêt à signer</span>
        {rules && <>, contre <span className="tabular">{readySensitive(rules)}</span> sans IA</>}. Coût : 0 CHF, le modèle tourne en
        local et aucun message ne sort de la machine.
      </p>

      <div className="mt-8 space-y-5">
        <Planche
          title="Jeu de contrôle"
          note="Cliquez une case pour lire le message et l'épreuve. Barrée : ratée. Point noir : cas sensible, qui doit revenir à l'équipe."
          cases={main.cases.filter((c) => c.set === "controle")}
          columns="grid-cols-5 sm:grid-cols-10"
        />
        <Planche
          title="Jeu de base"
          note="Écrit à partir des six motifs du formulaire de contact et des thèmes des avis publics."
          cases={main.cases.filter((c) => c.set === "base")}
          columns="grid-cols-5 sm:grid-cols-10 xl:grid-cols-20"
        />
      </div>

      <section className="mt-10 grid gap-8 rounded-lg border border-ink-150 bg-sheet px-5 py-6 lg:grid-cols-2">
        <Comparison runs={runs} set="controle" title="Jeu de contrôle, 20 messages" />
        <Comparison runs={runs} set="base" title="Jeu de base, 40 messages" />
        <p className="text-[13px] leading-relaxed text-ink-500 lg:col-span-2">
          Les règles sans IA ont été écrites en même temps que le jeu de base : leur score y est optimiste. Le détail de chaque
          échec et l&apos;histoire des corrections sont dans le dépôt, fichiers <code className="font-code">eval/RAPPORT.md</code> et{" "}
          <code className="font-code">eval/JOURNAL.md</code>.
        </p>
      </section>
    </main>
  );
}
