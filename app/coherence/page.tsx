import { loadKnowledge } from "@/lib/knowledge";

export const metadata = { title: "Errata du site · Copilote" };

function pageLabel(url: string) {
  const path = new URL(url).pathname.replace(/\/$/, "");
  return path ? `menagesimple.com${path}` : "menagesimple.com";
}

export default function Coherence() {
  const { facts, contradictions } = loadKnowledge();
  const verified = facts.filter((f) => f.status === "verified").length;

  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 py-6 md:px-8 md:py-10">
      <header className="max-w-[70ch]">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Errata du site</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          Avant de brancher une IA sur des clients, il faut des faits fiables. La fiche compte {facts.length} faits tirés du site
          public de MénageSimple, chacun avec sa phrase exacte ; {verified} sont vérifiés. Ces {contradictions.length} points se
          contredisent d&apos;une page à l&apos;autre : tant que l&apos;équipe n&apos;a pas tranché, le copilote répond par une
          réponse d&apos;attente et glisse l&apos;erratum dans le pli. Chaque lundi, un script vérifie que toutes les citations
          figurent encore sur le site.
        </p>
      </header>

      <ol className="mt-8 space-y-6">
        {contradictions.map((c) => (
          <li key={c.id} id={c.id} className="scroll-mt-6 overflow-hidden rounded-lg border border-ink-150 bg-sheet">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-errata/25 bg-errata-soft px-5 py-3">
              <span className="stamp rounded-sm border-[1.5px] border-errata px-1.5 py-0.5 text-[11px] font-semibold text-errata">
                Errata {c.id}
              </span>
              <h2 className="text-[16px] font-semibold text-ink-900">{c.title}</h2>
              <span className="stamp ml-auto text-[10.5px] text-errata">{c.decision ?? "Décision de l'équipe attendue"}</span>
            </div>

            <div className={`grid gap-px bg-ink-100 ${c.sources.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
              {c.sources.map((source) => (
                <figure key={source.quote} className="bg-sheet px-5 py-4">
                  <blockquote className="font-proof text-[15px] leading-[1.6] text-ink-900">« {source.quote} »</blockquote>
                  <figcaption className="mt-3 text-[12.5px] text-ink-500">
                    {source.page} ·{" "}
                    <a href={source.url} target="_blank" rel="noreferrer" className="font-code text-[11px] text-pencil hover:underline">
                      {pageLabel(source.url)}
                    </a>
                  </figcaption>
                </figure>
              ))}
            </div>

            <dl className="grid gap-x-8 gap-y-3 border-t border-ink-100 px-5 py-4 text-[14px] leading-relaxed md:grid-cols-2">
              <div>
                <dt className="text-[12.5px] font-medium text-ink-500">Pourquoi c&apos;est gênant</dt>
                <dd className="mt-1">{c.impact}</dd>
              </div>
              <div>
                <dt className="text-[12.5px] font-medium text-ink-500">Correction proposée</dt>
                <dd className="mt-1">{c.proposal}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </main>
  );
}
