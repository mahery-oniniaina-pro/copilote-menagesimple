"use client";

import { Check, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { FREQUENCY_LABELS, formatHours } from "@/lib/budget";
import { INTENTS } from "@/lib/intents";
import { annotateEntry } from "./notes";
import type { Entry } from "./Workspace";

const LANGUAGES: Record<string, string> = { fr: "Français", en: "Anglais", de: "Allemand", it: "Italien" };

function sourceLabel(url: string) {
  const path = new URL(url).pathname.replace(/\/$/, "");
  return path ? `menagesimple.com${path}` : "menagesimple.com";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-ink-100 px-5 py-5 last:border-b-0">
      <h3 className="mb-3 text-[13px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

export function Margin({ entry, activeNote, onNote }: { entry: Entry; activeNote?: number; onNote: (note?: number) => void }) {
  const { result } = entry;
  const { notes } = useMemo(() => annotateEntry(entry), [entry]);
  const numbered = new Set(notes.map((n) => n.fact.id));
  const otherFacts = result.facts.filter((f) => !numbered.has(f.id) && f.status === "verified");
  const context = result.context;
  const budget = context.budget ?? context.budgetExample;

  const read: [string, string][] = [["Langue", LANGUAGES[context.language] ?? context.language]];
  if (budget) {
    read.push([
      context.budget ? "Budget calculé" : "Exemple de budget",
      `${formatHours(budget.hours)} ${FREQUENCY_LABELS[budget.frequency]} = CHF ${budget.monthly} par mois`,
    ]);
  }
  if (context.place) read.push(["Lieu", `${context.place.cantonName}, ${context.place.served ? "desservi" : "non desservi"}`]);
  if (context.situations.length) read.push(["Situation", context.situations.map((s) => INTENTS[s].label.toLowerCase()).join(", ")]);
  if (context.injection) read.push(["Instructions cachées", "détectées et ignorées"]);

  return (
    <div>
      <Section title="Contrôles faits sans IA">
        <ul className="space-y-2.5">
          {result.checks.map((check) => (
            <li key={check.id} className="flex gap-2.5 text-[13.5px] leading-snug">
              <span
                className={`mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full ${
                  check.ok ? "bg-ok-soft text-ok" : "bg-errata-soft text-errata"
                }`}
              >
                {check.ok ? <Check aria-label="réussi" className="size-3" strokeWidth={2.5} /> : <X aria-label="échoué" className="size-3" strokeWidth={2.5} />}
              </span>
              <span>
                {check.label}
                {check.detail && <span className="mt-0.5 block text-[12.5px] text-ink-500">{check.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {(notes.length > 0 || otherFacts.length > 0) && (
        <Section title="Sources en marge">
          <ol className="space-y-2.5">
            {notes.map(({ number, fact }) => (
              <li
                key={fact.id}
                id={`note-${number}`}
                onMouseEnter={() => onNote(number)}
                onMouseLeave={() => onNote(undefined)}
                className={`-mx-2 grid scroll-mt-4 grid-cols-[18px_1fr] gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                  activeNote === number ? "bg-pencil-soft" : ""
                }`}
              >
                <span className="font-code text-[11px] font-medium text-pencil">{number}</span>
                <div>
                  <p>{fact.statement}</p>
                  <blockquote className="mt-1.5 font-proof text-[13.5px] text-ink-600 italic">« {fact.quote} »</blockquote>
                  <a href={fact.source} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-code text-[10.5px] text-pencil hover:underline">
                    {sourceLabel(fact.source)} <ExternalLink aria-hidden className="size-3" />
                  </a>
                </div>
              </li>
            ))}
            {otherFacts.map((fact) => (
              <li key={fact.id} className="grid grid-cols-[18px_1fr] gap-2 text-[13px] leading-snug">
                <span aria-hidden className="mt-1.5 size-1.5 rounded-full bg-ink-300" />
                <div>
                  <p>{fact.statement}</p>
                  <a href={fact.source} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-code text-[10.5px] text-pencil hover:underline">
                    {sourceLabel(fact.source)} <ExternalLink aria-hidden className="size-3" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {result.contradictions.length > 0 && (
        <Section title="Errata glissés dans le pli">
          <div className="space-y-3">
            {result.contradictions.map((c) => (
              <div key={c.id} className="rounded-md bg-errata-soft px-3.5 py-3 text-[13px] leading-snug">
                <p className="font-medium text-errata">
                  <span className="stamp mr-1.5 text-[10.5px]">Errata {c.id}</span>
                  {c.title}
                </p>
                <p className="mt-1.5 text-ink-700">{c.proposal}</p>
                <Link href={`/coherence#${c.id}`} className="mt-1.5 inline-block text-[12.5px] text-errata underline">
                  Voir les citations du site
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Lu par le code, sans IA">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
          {read.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-ink-500">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {result.flags.length > 0 && (
        <Section title="Signalements">
          <ul className="space-y-2 text-[13px] leading-snug text-ink-700">
            {result.flags.map((flag) => (
              <li key={flag} className="flex gap-2">
                <span aria-hidden className="mt-[7px] size-1 shrink-0 rounded-full bg-ink-400" />
                {flag}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
