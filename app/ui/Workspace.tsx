"use client";

import { ArrowLeft, PenLine, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CopilotResult } from "@/lib/copilot";
import type { Sample } from "@/lib/samples";
import type { Status } from "@/lib/status";
import { Composer } from "./Composer";
import { Margin } from "./Margin";
import { annotateEntry } from "./notes";
import { Pli } from "./Pli";
import { Registry } from "./Registry";
import { STATUS_UI, type Decision } from "./status";

export type Entry = Sample & { decision?: Decision; draft: string };

type Filter = "tous" | Status;

const FILTERS: Filter[] = ["tous", "a_transmettre", "a_revoir", "pret", "a_classer"];
const PRIORITY = { urgente: 0, haute: 1, normale: 2 } as const;
const ORDER = { a_transmettre: 0, a_revoir: 1, pret: 2, a_classer: 3 } as const;

function sortEntries(samples: Sample[]): Entry[] {
  return [...samples]
    .sort(
      (a, b) =>
        PRIORITY[a.result.priority] - PRIORITY[b.result.priority] || ORDER[a.result.status] - ORDER[b.result.status],
    )
    .map((s) => ({ ...s, draft: s.result.reply }));
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function Workspace({ samples }: { samples: Sample[] }) {
  const [entries, setEntries] = useState<Entry[]>(() => sortEntries(samples));
  const [filter, setFilter] = useState<Filter>("tous");
  const [selectedId, setSelectedId] = useState(
    () => (entries.find((e) => e.result.status === "pret" && annotateEntry(e).notes.length > 0) ?? entries[0])?.id,
  );
  const [activeNote, setActiveNote] = useState<number>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [toast, setToast] = useState<string>();

  useEffect(() => {
    try {
      setWelcome(localStorage.getItem("copilote:accueil") !== "vu");
    } catch {
      setWelcome(true);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(undefined), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const visible = useMemo(
    () => entries.filter((e) => filter === "tous" || e.result.status === filter),
    [entries, filter],
  );
  const selected = visible.find((e) => e.id === selectedId) ?? visible[0];
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { tous: entries.length, a_transmettre: 0, a_revoir: 0, pret: 0, a_classer: 0 };
    for (const e of entries) c[e.result.status] += 1;
    return c;
  }, [entries]);

  const update = useCallback((id: string, patch: Partial<Entry>) => {
    setEntries((current) => current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const sign = useCallback(
    async (entry: Entry) => {
      try {
        await navigator.clipboard.writeText(entry.draft);
      } catch {}
      update(entry.id, { decision: "signe" });
      setToast("Réponse signée et copiée. Collez-la dans votre outil d'envoi.");
    },
    [update],
  );

  const handOff = useCallback(
    (entry: Entry) => {
      update(entry.id, { decision: "transmis" });
      setToast("Pli transmis à l'équipe, avec le résumé et le brouillon.");
    },
    [update],
  );

  const select = useCallback((id: string) => {
    setSelectedId(id);
    setActiveNote(undefined);
    setMobileOpen(true);
    if (window.matchMedia("(max-width: 767px)").matches) window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]") || event.metaKey || event.ctrlKey || event.altKey) return;
      const index = visible.findIndex((e) => e.id === selected?.id);
      if (event.key === "j" || event.key === "ArrowDown") {
        const next = visible[Math.min(index + 1, visible.length - 1)];
        if (next) setSelectedId(next.id);
        event.preventDefault();
      } else if (event.key === "k" || event.key === "ArrowUp") {
        const prev = visible[Math.max(index - 1, 0)];
        if (prev) setSelectedId(prev.id);
        event.preventDefault();
      } else if (event.key === "s" && selected && selected.result.status !== "a_classer") {
        void sign(selected);
      } else if (event.key === "t" && selected) {
        handOff(selected);
      } else if (event.key === "n") {
        setComposing(true);
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, selected, sign, handOff]);

  function addResult(result: CopilotResult) {
    const count = entries.filter((e) => e.id.startsWith("V")).length + 1;
    const entry: Entry = {
      id: `V${count}`,
      code: `RR·V${count}`,
      time: nowTime(),
      group: "Votre message",
      message: result.message,
      result,
      draft: result.reply,
    };
    setEntries((current) => [entry, ...current]);
    setFilter("tous");
    setSelectedId(entry.id);
    setMobileOpen(true);
    setComposing(false);
  }

  function closeWelcome() {
    setWelcome(false);
    try {
      localStorage.setItem("copilote:accueil", "vu");
    } catch {}
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col md:h-dvh">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2.5 border-b border-ink-150 bg-ground px-4 py-3 md:px-6">
        <div className={`min-w-0 flex-1 md:flex-none ${mobileOpen ? "hidden md:block" : ""}`}>
          <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Registre des plis</h1>
          <p className="truncate text-[12px] text-ink-500">Service client MénageSimple · prototype non affilié, messages inventés</p>
        </div>
        <div
          role="toolbar"
          aria-label="Filtrer par statut"
          className={`-mx-4 flex-nowrap gap-1.5 overflow-x-auto px-4 md:mx-0 md:ml-4 md:flex md:flex-wrap md:overflow-visible md:px-0 ${
            mobileOpen ? "hidden" : "order-last flex w-[calc(100%+2rem)] md:order-none md:w-auto"
          }`}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12.5px] transition-colors ${
                filter === f
                  ? "border-ink-900 bg-ink-900 text-sheet"
                  : "border-ink-200 bg-sheet/70 text-ink-600 hover:border-ink-300 hover:text-ink-900"
              }`}
            >
              {f === "tous" ? "Tous" : STATUS_UI[f].short}
              <span className={`tabular font-code text-[11px] ${filter === f ? "text-ink-200" : "text-ink-500"}`}>{counts[f]}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setComposing(true)}
          aria-label="Essayer un message"
          className={`ml-auto items-center gap-2 rounded-md border-[1.5px] border-ink-900 bg-sheet px-2.5 py-1.5 text-[13px] font-medium transition-colors hover:bg-ink-50 sm:px-3 ${
            mobileOpen ? "hidden md:flex" : "flex"
          }`}
        >
          <PenLine aria-hidden className="size-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">Essayer un message</span>
          <kbd className="hidden font-code text-[10.5px] text-ink-500 lg:inline">N</kbd>
        </button>
      </header>

      {welcome && (
        <div className={`items-start gap-4 border-b border-ink-150 bg-ink-50 px-4 py-3 text-[13.5px] md:flex md:px-6 ${mobileOpen ? "hidden" : "flex"}`}>
          <p className="max-w-[92ch] text-ink-700">
            <span className="font-semibold text-ink-900">Ce que vous regardez :</span> la boîte d&apos;une équipe de service
            client. Pour chaque message, le copilote a lu, rédigé une épreuve et vérifié chaque chiffre contre le site de
            MénageSimple. Ouvrez un pli, lisez l&apos;épreuve annotée au crayon bleu, puis signez ou transmettez : rien ne
            part sans vous.
          </p>
          <button
            type="button"
            onClick={closeWelcome}
            aria-label="Fermer la présentation"
            className="ml-auto rounded p-1 text-ink-600 hover:bg-ink-100"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(290px,350px)_minmax(0,1fr)] xl:grid-cols-[minmax(300px,350px)_minmax(0,1fr)_minmax(290px,340px)]">
        <section
          aria-label="Plis reçus"
          className={`min-h-0 border-ink-150 md:block md:overflow-y-auto md:border-r ${mobileOpen ? "hidden" : "block"}`}
        >
          {composing && <Composer onResult={addResult} onCancel={() => setComposing(false)} />}
          <Registry entries={visible} selectedId={selected?.id} onSelect={select} />
        </section>

        <section
          aria-label="Pli ouvert"
          className={`min-h-0 bg-ground md:block md:overflow-y-auto ${mobileOpen ? "block" : "hidden"}`}
        >
          {selected ? (
            <div key={selected.id} className="animate-sheet mx-auto max-w-[760px] px-4 pt-4 pb-10 md:px-8 md:pt-6">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="mb-3 flex items-center gap-1.5 text-[13px] text-ink-600 md:hidden"
              >
                <ArrowLeft aria-hidden className="size-4" /> Tous les plis
              </button>
              <Pli
                entry={selected}
                activeNote={activeNote}
                onNote={setActiveNote}
                onDraftChange={(draft) => update(selected.id, { draft })}
                onSign={() => void sign(selected)}
                onHandOff={() => handOff(selected)}
                onUndo={() => update(selected.id, { decision: undefined })}
              />
              <div className="mt-8 xl:hidden">
                <Margin entry={selected} activeNote={activeNote} onNote={setActiveNote} />
              </div>
            </div>
          ) : (
            <p className="p-8 text-ink-500">Aucun pli dans ce filtre.</p>
          )}
        </section>

        <aside aria-label="Marge de vérification" className="hidden min-h-0 overflow-y-auto border-l border-ink-150 bg-ground xl:block">
          {selected && <Margin key={selected.id} entry={selected} activeNote={activeNote} onNote={setActiveNote} />}
        </aside>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center md:bottom-6">
        {toast && (
          <p className="animate-sheet rounded-full bg-ink-900 px-4 py-2 text-[13px] text-sheet shadow-[0_8px_24px_-8px_rgb(20_22_19/0.45)]">
            {toast}
          </p>
        )}
      </div>
    </div>
  );
}
