"use client";

import { useEffect, useRef } from "react";
import { DECISION_UI, STATUS_UI, TONE_BADGE } from "./status";
import type { Entry } from "./Workspace";

export function Registry({
  entries,
  selectedId,
  onSelect,
}: {
  entries: Entry[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  if (!entries.length) {
    return <p className="px-5 py-8 text-[14px] text-ink-500">Aucun pli avec ce statut.</p>;
  }

  return (
    <>
      <ol className="divide-y divide-ink-100 px-2 py-2">
        {entries.map((entry) => {
          const selected = entry.id === selectedId;
          const status = entry.decision ? DECISION_UI[entry.decision] : { short: STATUS_UI[entry.result.status].short, tone: STATUS_UI[entry.result.status].tone };
          return (
            <li key={entry.id} className="py-0.5">
              <button
                ref={selected ? selectedRef : undefined}
                type="button"
                onClick={() => onSelect(entry.id)}
                aria-current={selected ? "true" : undefined}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition-[background-color,border-color] duration-150 ${
                  selected ? "border-ink-900 bg-sheet" : "border-transparent hover:bg-sheet/70"
                } ${entry.decision ? "opacity-75" : ""}`}
              >
                <div className="flex items-center gap-2 font-code text-[11px] text-ink-500">
                  <span className="tabular text-ink-700">{entry.code}</span>
                  {entry.result.priority === "urgente" && (
                    <span className="stamp rounded-sm bg-ink-900 px-1 py-px text-[9.5px] text-sheet">Urgent</span>
                  )}
                  {entry.result.priority === "haute" && (
                    <span className="stamp rounded-sm border border-ink-400 px-1 text-[9.5px] text-ink-600">Prioritaire</span>
                  )}
                  <span className="tabular ml-auto">{entry.time}</span>
                </div>
                <p className={`mt-1 line-clamp-1 text-[14px] ${selected ? "font-semibold" : "font-medium"} text-ink-900`}>
                  {entry.result.summary || entry.result.intentLabel}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-500">{entry.message}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-sm border px-1.5 py-px text-[11.5px] font-medium ${TONE_BADGE[status.tone]}`}>{status.short}</span>
                  <span className="truncate text-[11.5px] text-ink-400">{entry.group}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
      <p className="hidden border-t border-ink-100 px-5 py-3 font-code text-[10.5px] text-ink-400 md:block">
        J K pour naviguer · S signer · T transmettre · N nouveau message
      </p>
    </>
  );
}
