"use client";

import { Check, Copy, Hand, PencilLine, RotateCcw, Signature } from "lucide-react";
import { useMemo, useState } from "react";
import type { CopilotResult } from "@/lib/copilot";
import { annotateEntry } from "./notes";
import { DECISION_UI, STATUS_UI, TONE_BADGE } from "./status";
import type { Entry } from "./Workspace";

const LANGUAGES: Record<string, string> = { fr: "français", en: "anglais", de: "allemand", it: "italien" };

function providerShort(result: CopilotResult) {
  if (result.fallback || result.provider.id === "regles") return "règles sans IA";
  const name = result.provider.label.split(" via ")[0];
  return result.provider.label.includes("enregistr") ? `${name}, réponse enregistrée` : name;
}

function seconds(ms: number) {
  return `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
}

function barcode(code: string) {
  let seed = [...code].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 30; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const w = 1 + (seed % 3);
    if (i % 2 === 0) bars.push({ x, w });
    x += w + (i % 2 === 0 ? 0 : 1);
  }
  return { bars, width: x };
}

function TrackingLabel({ code }: { code: string }) {
  const { bars, width } = useMemo(() => barcode(code), [code]);
  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-[3px] border-[1.5px] border-ink-900 bg-sheet">
      <span className="flex items-center bg-ink-900 px-2 font-code text-[11px] tracking-[0.08em] text-sheet">RR</span>
      <span className="flex flex-col justify-center px-2.5 py-1">
        <svg aria-hidden width={width} height="16" viewBox={`0 0 ${width} 16`} className="block">
          {bars.map((bar) => (
            <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="16" fill="currentColor" />
          ))}
        </svg>
        <span className="tabular mt-0.5 font-code text-[10.5px] leading-none tracking-[0.06em]">
          {code.replace("RR·", "")}
        </span>
      </span>
    </div>
  );
}

function Dot({ human }: { human?: boolean }) {
  return <span aria-hidden className={`block size-2.5 shrink-0 rounded-full border-[1.5px] border-ink-900 ${human ? "bg-signal" : "bg-ink-900"}`} />;
}

function Tracking({ entry }: { entry: Entry }) {
  const { result } = entry;
  const passed = result.checks.filter((c) => c.ok).length;
  const final = entry.decision
    ? { label: DECISION_UI[entry.decision].short, detail: entry.decision === "signe" ? "par vous" : "à l'équipe", state: "done" as const }
    : result.status === "a_classer"
      ? { label: "Classé", detail: "sans réponse", state: "done" as const }
      : { label: result.status === "pret" ? "Signature" : STATUS_UI[result.status].short, detail: "en attente de vous", state: "human" as const };

  const steps = [
    { label: "Reçu", detail: entry.time, grow: 1, state: "done" as const },
    { label: "Lu sans IA", detail: LANGUAGES[result.language] ?? result.language, grow: 1, state: "done" as const },
    {
      label: "Rédigé",
      detail: result.durationMs ? `${providerShort(result).split(",")[0]}, ${seconds(result.durationMs)}` : providerShort(result),
      grow: 1 + Math.min(result.durationMs / 2500, 5),
      state: "done" as const,
    },
    { label: "Contrôlé", detail: `${passed} contrôles sur ${result.checks.length}`, grow: 1, state: "done" as const },
    { ...final, grow: 1 },
  ];

  return (
    <>
    <ol aria-label="Suivi du pli" className="hidden items-start sm:flex">
      {steps.map((step, index) => (
        <li
          key={step.label}
          className={`flex flex-col ${index === steps.length - 1 ? "shrink-0 items-end text-right" : "min-w-[92px]"}`}
          style={index === steps.length - 1 ? undefined : { flexGrow: step.grow, flexBasis: 0 }}
        >
          <div className="flex w-full items-center">
            {index === steps.length - 1 && <span aria-hidden className="h-[1.5px] flex-1 bg-ink-900" />}
            <Dot human={step.state === "human"} />
            {index < steps.length - 1 && <span aria-hidden className="h-[1.5px] flex-1 bg-ink-900" />}
          </div>
          <span className={`mt-1.5 text-[12.5px] font-medium whitespace-nowrap ${index === steps.length - 1 ? "" : "pr-2"}`}>{step.label}</span>
          <span className={`text-[11.5px] leading-snug text-ink-500 ${index === steps.length - 1 ? "whitespace-nowrap" : "pr-2"}`}>{step.detail}</span>
        </li>
      ))}
    </ol>
    <ol aria-label="Suivi du pli" className="sm:hidden">
      {steps.map((step, index) => (
        <li key={step.label} className="grid grid-cols-[10px_1fr] gap-x-3">
          <div className="flex flex-col items-center">
            <span className="mt-[5px]">
              <Dot human={step.state === "human"} />
            </span>
            {index < steps.length - 1 && <span aria-hidden className="w-[1.5px] flex-1 bg-ink-900" />}
          </div>
          <p className="pb-2.5 text-[13px] leading-snug">
            <span className="font-medium">{step.label}</span>
            <span className="ml-2 text-ink-500">{step.detail}</span>
          </p>
        </li>
      ))}
    </ol>
    </>
  );
}

function Proof({
  entry,
  editing,
  activeNote,
  onNote,
  onChange,
}: {
  entry: Entry;
  editing: boolean;
  activeNote?: number;
  onNote: (note?: number) => void;
  onChange: (draft: string) => void;
}) {
  const { segments } = useMemo(() => annotateEntry(entry), [entry]);

  if (editing) {
    return (
      <textarea
        value={entry.draft}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Modifier le brouillon"
        rows={Math.max(8, entry.draft.split("\n").length + 3)}
        className="w-full resize-y rounded-md border border-pencil/50 bg-pencil-soft/40 p-4 font-proof text-[16.5px] leading-[1.7] outline-none focus:border-pencil"
      />
    );
  }

  return (
    <div className="font-proof text-[16.5px] leading-[1.8] whitespace-pre-wrap text-ink-900">
      {segments.map((segment, index) =>
        segment.note ? (
          <button
            key={index}
            type="button"
            onMouseEnter={() => onNote(segment.note)}
            onMouseLeave={() => onNote(undefined)}
            onFocus={() => onNote(segment.note)}
            onBlur={() => onNote(undefined)}
            onClick={() =>
              [...document.querySelectorAll<HTMLElement>(`[data-note="${segment.note}"]`)]
                .find((note) => note.offsetParent)
                ?.scrollIntoView({ block: "nearest", behavior: "smooth" })
            }
            aria-label={`${segment.text}, source ${segment.note}`}
            className={`pencil-mark cursor-help rounded-[2px] transition-colors ${activeNote === segment.note ? "bg-pencil-soft" : ""}`}
          >
            {segment.text}
            <sup className="ml-0.5 font-code text-[10px] font-medium text-pencil">{segment.note}</sup>
          </button>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </div>
  );
}

export function Pli({
  entry,
  activeNote,
  onNote,
  onDraftChange,
  onSign,
  onHandOff,
  onUndo,
}: {
  entry: Entry;
  activeNote?: number;
  onNote: (note?: number) => void;
  onDraftChange: (draft: string) => void;
  onSign: () => void;
  onHandOff: () => void;
  onUndo: () => void;
}) {
  const { result } = entry;
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const status = STATUS_UI[result.status];
  const handOffFirst = result.status === "a_transmettre";

  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const signButton = (
    <button
      type="button"
      onClick={onSign}
      className={`flex items-center gap-2 rounded-md px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
        handOffFirst
          ? "border-[1.5px] border-ink-900 bg-sheet text-ink-900 hover:bg-ink-50"
          : "bg-ink-900 text-sheet hover:bg-ink-700"
      }`}
    >
      <Signature aria-hidden className="size-4" strokeWidth={1.8} />
      Signer et copier
      <kbd className="hidden font-code text-[10.5px] opacity-60 lg:inline">S</kbd>
    </button>
  );
  const handOffButton = (
    <button
      type="button"
      onClick={onHandOff}
      className={`flex items-center gap-2 rounded-md border-[1.5px] border-ink-900 px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
        handOffFirst ? "bg-signal text-ink-900 hover:brightness-95" : "bg-sheet text-ink-900 hover:bg-signal-soft"
      }`}
    >
      <Hand aria-hidden className="size-4" strokeWidth={1.8} />
      Transmettre à l&apos;équipe
      <kbd className="hidden font-code text-[10.5px] opacity-60 lg:inline">T</kbd>
    </button>
  );

  return (
    <article>
      <header className="mb-5">
        <TrackingLabel code={entry.code} />
        <h2 className="mt-3 text-[22px] leading-tight font-semibold tracking-[-0.015em] text-balance">
          {result.summary || result.intentLabel}
        </h2>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-sm border px-1.5 py-px text-[12px] font-medium ${TONE_BADGE[status.tone]}`}>{status.long}</span>
          <span className="rounded-sm border border-ink-200 bg-sheet/70 px-1.5 py-px text-[12px] text-ink-600">{result.intentLabel}</span>
          {result.priority !== "normale" && (
            <span className="stamp rounded-sm bg-ink-900 px-1.5 py-0.5 text-[10px] text-sheet">
              {result.priority === "urgente" ? "Urgent" : "Prioritaire"}
            </span>
          )}
          <span className="text-[12.5px] text-ink-500">motif « {result.reason} »</span>
        </div>
      </header>

      <div className="mb-6 rounded-lg border border-ink-200 px-4 pt-3.5 pb-3 sm:pb-4">
        <Tracking entry={entry} />
      </div>

      <section aria-label="Message du client" className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <h3 className="text-[12.5px] font-medium text-ink-500">Message reçu</h3>
          <span className="stamp -rotate-2 rounded-full border border-ink-500 px-2 py-px text-[9.5px] text-ink-600">
            Reçu le {entry.id.startsWith("V") ? new Date().toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "05.11.26"}
          </span>
        </div>
        <p className="text-[15.5px] leading-relaxed text-ink-900">{entry.message}</p>
        {result.status === "a_transmettre" && result.handoffReason && (
          <p className="mt-3 text-[13.5px] text-ink-600">
            <span className="font-medium text-ink-900">Pourquoi un humain : </span>
            {result.handoffReason}
          </p>
        )}
      </section>

      {result.status === "a_classer" ? (
        <section className="rounded-lg border border-dashed border-ink-300 px-5 py-6 text-[14px] text-ink-600">
          <p>
            Aucune réponse à envoyer : le copilote a classé ce message comme démarchage. S&apos;il s&apos;est trompé, transmettez-le
            à l&apos;équipe.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">{handOffButton}</div>
        </section>
      ) : (
        <section aria-label="Épreuve de la réponse" className="perforated relative rounded-b-lg border border-ink-150 bg-sheet shadow-[0_1px_0_rgb(20_22_19/0.04),0_12px_32px_-18px_rgb(20_22_19/0.25)]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-ink-100 px-5 pt-5 pb-3">
            <h3 className="text-[13px] font-semibold">Épreuve de la réponse</h3>
            <span className="text-[12px] text-ink-500">{providerShort(result)} · à relire</span>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-[12.5px] text-pencil hover:bg-pencil-soft"
            >
              {editing ? <Check aria-hidden className="size-3.5" /> : <PencilLine aria-hidden className="size-3.5" />}
              {editing ? "Terminer" : "Modifier"}
            </button>
          </div>

          <div className="relative px-5 py-5 md:px-7 md:py-6">
            <Proof entry={entry} editing={editing} activeNote={activeNote} onNote={onNote} onChange={onDraftChange} />
            {entry.decision && (
              <div
                aria-hidden
                className={`animate-stamp pointer-events-none absolute top-4 right-5 rounded-md border-2 px-3 py-1.5 text-center ${
                  entry.decision === "signe" ? "border-ok bg-sheet/80 text-ok" : "border-ink-900 bg-signal/90 text-ink-900"
                }`}
              >
                <span className="stamp block text-[12px] font-semibold">{entry.decision === "signe" ? "Signé" : "Transmis"}</span>
                <span className="stamp block text-[9.5px]">{entry.decision === "signe" ? "bon à envoyer" : "à l'équipe"}</span>
              </div>
            )}
          </div>

          <div className="z-10 flex flex-wrap items-center gap-2 rounded-b-lg border-t border-ink-100 bg-sheet px-5 py-3.5 md:sticky md:bottom-0">
            {entry.decision ? (
              <>
                <p className="text-[13px] text-ink-600">
                  {entry.decision === "signe" ? "Signé par vous. La réponse est dans votre presse-papiers." : "Transmis à l'équipe avec le résumé et le brouillon."}
                </p>
                <button type="button" onClick={onUndo} className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-[12.5px] text-ink-600 hover:bg-ink-50">
                  <RotateCcw aria-hidden className="size-3.5" /> Annuler
                </button>
              </>
            ) : (
              <>
                {handOffFirst ? (
                  <>
                    {handOffButton}
                    {signButton}
                  </>
                ) : (
                  <>
                    {signButton}
                    {handOffButton}
                  </>
                )}
                <button type="button" onClick={copy} className="ml-auto flex items-center gap-1.5 rounded px-2 py-1 text-[12.5px] text-ink-600 hover:bg-ink-50">
                  {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
                  {copied ? "Copié" : "Copier"}
                </button>
              </>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
