import { loadKnowledge } from "@/lib/knowledge";

export const metadata = { title: "Cohérence du site · Copilote service client" };

export default function Coherence() {
  const { facts, contradictions } = loadKnowledge();
  const verified = facts.filter((f) => f.status === "verified").length;

  return (
    <>
      <h1>Cohérence du site</h1>
      <p className="lead">
        Avant de brancher une IA sur des clients, il faut des faits fiables. La fiche de faits compte {facts.length} entrées tirées
        du site public, chacune avec sa phrase exacte ; {verified} sont vérifiées. Les {contradictions.length} points ci-dessous se
        contredisent d&apos;une page à l&apos;autre : tant que l&apos;équipe n&apos;a pas tranché, le copilote transmet la question au
        lieu d&apos;y répondre. Chaque lundi, <code>npm run check-site</code> vérifie que toutes les citations figurent encore sur le site.
      </p>

      {contradictions.map((c) => (
        <section key={c.id} className="card panel" style={{ marginTop: 16 }}>
          <div className="row" style={{ marginBottom: 8 }}>
            <span className="badge a_revoir">{c.id}</span>
            <h2 style={{ margin: 0 }}>{c.title}</h2>
          </div>
          <div className="grid-2">
            {c.sources.map((source) => (
              <div key={source.quote} className="fact contradiction">
                <div className="meta">{source.page}</div>
                <blockquote>« {source.quote} »</blockquote>
                <a className="meta" href={source.url} target="_blank" rel="noreferrer">
                  {source.url.replace("https://", "")}
                </a>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12 }}>
            <strong>Pourquoi c&apos;est gênant :</strong> {c.impact}
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Proposition :</strong> {c.proposal}{" "}
            <span className="badge neutral">{c.decision ?? "Décision de l'équipe attendue"}</span>
          </p>
        </section>
      ))}
    </>
  );
}
