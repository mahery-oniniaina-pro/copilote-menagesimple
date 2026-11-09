"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import type { CaseResult } from "@/lib/evaluation";
import { INTENTS } from "@/lib/intents";
import { STATUS_UI, TONE_BADGE } from "./status";

function isSensitive(c: CaseResult) {
  return c.expected.status.length === 1 && c.expected.status[0] === "a_transmettre";
}

export function Planche({ title, note, cases, columns }: { title: string; note: string; cases: CaseResult[]; columns: string }) {
  const [openId, setOpenId] = useState<string>();
  const open = cases.find((c) => c.id === openId);
  const passed = cases.filter((c) => c.score.pass).length;

  return (
    <section className="rounded-lg border border-ink-150 bg-sheet">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-ink-100 px-5 py-3.5">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        <span className="tabular font-code text-[12px] text-ink-500">
          {passed} réussis sur {cases.length}
        </span>
        <p className="w-full text-[12.5px] text-ink-500">{note}</p>
      </header>

      <ol className={`grid border-l border-ink-100 ${columns}`}>
        {cases.map((c) => {
          const active = c.id === openId;
          return (
            <li key={c.id} className="border-r border-b border-ink-100 bg-sheet">
              <button
                type="button"
                onClick={() => setOpenId(active ? undefined : c.id)}
                aria-expanded={active}
                aria-label={`${c.id}, ${c.score.pass ? "réussi" : "raté"}${isSensitive(c) ? ", cas sensible" : ""}`}
                className={`flex h-[58px] w-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "bg-ink-900 text-sheet" : c.score.pass ? "hover:bg-ink-50" : "bg-errata-soft/60 hover:bg-errata-soft"
                }`}
              >
                <span className={`tabular font-code text-[11.5px] ${!c.score.pass && !active ? "text-errata line-through decoration-1" : ""}`}>
                  {c.id}
                </span>
                {c.score.pass ? (
                  <Check aria-hidden className={`size-3.5 ${active ? "text-sheet" : "text-ok"}`} strokeWidth={2.5} />
                ) : (
                  <X aria-hidden className={`size-3.5 ${active ? "text-sheet" : "text-errata"}`} strokeWidth={2.5} />
                )}
                {isSensitive(c) && <span aria-hidden className={`size-1 rounded-full ${active ? "bg-signal" : "bg-ink-900"}`} />}
              </button>
            </li>
          );
        })}
      </ol>

      {open && (
        <div className="animate-sheet grid gap-5 border-t border-ink-100 px-5 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <p className="font-code text-[11.5px] text-ink-500">
              {open.id} · {open.group}
            </p>
            <p className="mt-1.5 text-[15px] leading-relaxed">{open.message}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px]">
              <dt className="text-ink-500">Attendu</dt>
              <dd>
                {open.expected.status.map((s) => STATUS_UI[s].long).join(" ou ")}
                <span className="block text-ink-500">{open.expected.intent.map((i) => INTENTS[i].label).join(" ou ")}</span>
              </dd>
              <dt className="text-ink-500">Obtenu</dt>
              <dd>
                <span className={`rounded-sm border px-1.5 py-px text-[12px] font-medium ${TONE_BADGE[STATUS_UI[open.result.status].tone]}`}>
                  {STATUS_UI[open.result.status].long}
                </span>
                <span className="block text-ink-500">{INTENTS[open.result.intent].label}</span>
              </dd>
            </dl>
            {open.result.failedChecks.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-[13px]">
                {open.result.failedChecks.map((check) => (
                  <li key={check.id} className="flex gap-2 text-errata">
                    <X aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.5} />
                    <span>
                      {check.label}
                      {check.detail && <span className="block text-ink-600">{check.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="perforated relative rounded-b-md border border-ink-150 bg-ground/50 px-4 pt-5 pb-4">
            <p className="mb-2 font-code text-[11px] text-ink-500">Épreuve préparée</p>
            <p className="font-proof text-[15px] leading-[1.7] whitespace-pre-wrap">{open.result.reply || "Pas de réponse : message classé."}</p>
          </div>
        </div>
      )}
    </section>
  );
}
