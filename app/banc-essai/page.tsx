import { STATUS_LABELS } from "@/lib/copilot";
import { CASE_SETS, type CaseSet, type Metrics } from "@/lib/evaluation";
import { INTENTS } from "@/lib/intents";
import { loadResults } from "@/lib/results";
import { StatusBadge } from "../components/Badges";

export const metadata = { title: "Banc d'essai · Copilote service client" };

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

function pct(a: number, b: number) {
  return b ? `${Math.round((a / b) * 100)} %` : "–";
}

export default function BancEssai() {
  const runs = loadResults();
  const main = runs[0];
  if (!main) return <p>Aucun résultat : lancez <code>npm run eval</code>.</p>;
  const sets = Object.keys(CASE_SETS) as CaseSet[];
  const control = main.metrics.controle;
  const readySensitive = main.cases.filter(
    (c) => c.expected.status.length === 1 && c.expected.status[0] === "a_transmettre" && c.result.status === "pret",
  ).length;

  return (
    <>
      <h1>Banc d&apos;essai</h1>
      <p className="lead">
        60 messages inventés, chacun avec la réponse attendue. Le jeu de base suit les six motifs du formulaire de contact et
        les thèmes des avis publics ; le jeu de contrôle a été écrit après coup, dans un style plus libre, et n&apos;a jamais
        servi à régler quoi que ce soit. Tout se relance gratuitement avec <code>npm run eval</code>.
      </p>

      <div className="stats">
        <div className="card stat">
          <strong>{pct(control.passed, control.total)}</strong>
          <span>des messages de contrôle réussis par {main.label}</span>
        </div>
        <div className="card stat">
          <strong>
            {readySensitive}/{control.sensitive + main.metrics.base.sensitive}
          </strong>
          <span>cas sensibles sortis « prêts à envoyer » : argent, dégât, absence, données…</span>
        </div>
        <div className="card stat">
          <strong>
            {control.groundedReplies + main.metrics.base.groundedReplies}/{control.replies + main.metrics.base.replies}
          </strong>
          <span>réponses dont chaque chiffre a une source</span>
        </div>
        <div className="card stat">
          <strong>0 CHF</strong>
          <span>modèle local, rien ne sort de la machine</span>
        </div>
      </div>

      {sets.map((set) => (
        <section key={set} className="card panel" style={{ marginTop: 16 }}>
          <h2>
            {CASE_SETS[set].label} · {main.metrics[set].total} messages
          </h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th />
                  {runs.map((run) => (
                    <th key={run.provider}>{run.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    {runs.map((run) => (
                      <td key={run.provider}>{value(run.metrics[set])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="card panel" style={{ marginTop: 16 }}>
        <h2>Les 60 messages, avec {main.label}</h2>
        <p className="meta">Ouvrez une ligne pour lire la réponse préparée et les contrôles qui ont échoué.</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cas</th>
                <th>Message</th>
                <th>Attendu</th>
                <th>Obtenu</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {main.cases.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.id}</strong>
                    <div className="meta">{c.group}</div>
                  </td>
                  <td style={{ maxWidth: 420 }}>
                    <details>
                      <summary>{c.message}</summary>
                      <p className="detail" style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
                        {c.result.reply || "(pas de réponse)"}
                      </p>
                      {c.result.failedChecks.map((check) => (
                        <p key={check.id} className="detail">
                          ✗ {check.label} : {check.detail}
                        </p>
                      ))}
                    </details>
                  </td>
                  <td className="detail">
                    {c.expected.status.map((s) => STATUS_LABELS[s]).join(" ou ")}
                    <div>{c.expected.intent.map((i) => INTENTS[i].label).join(" ou ")}</div>
                  </td>
                  <td>
                    <StatusBadge status={c.result.status} />
                    <div className="detail">{INTENTS[c.result.intent].label}</div>
                  </td>
                  <td>{c.score.pass ? <span className="ok">✓</span> : <span className="ko">✗</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
