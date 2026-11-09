"use client";

import { useEffect, useRef, useState } from "react";
import type { CopilotResult } from "@/lib/copilot";

const STAGES = ["Lecture sans IA…", "Rédaction de l'épreuve…", "Contrôle des chiffres et des promesses…"];

export function Composer({ onResult, onCancel }: { onResult: (result: CopilotResult) => void; onCancel: () => void }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string>();
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => field.current?.focus(), []);

  useEffect(() => {
    if (!pending) return;
    setStage(0);
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 1400);
    return () => clearInterval(timer);
  }, [pending]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (message.trim().length < 3) {
      setError("Écrivez au moins quelques mots, comme le ferait un client.");
      return;
    }
    setPending(true);
    setError(undefined);
    try {
      const response = await fetch("/api/reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Le copilote n'a pas répondu. Réessayez.");
      onResult(data as CopilotResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Le copilote n'a pas répondu. Réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="animate-sheet m-2 rounded-lg border-[1.5px] border-ink-900 bg-sheet p-3">
      <label htmlFor="nouveau-pli" className="text-[13px] font-semibold">
        Nouveau pli
      </label>
      <p className="mt-0.5 text-[12px] leading-snug text-ink-500">
        Écrivez comme un client. En ligne, un message nouveau est traité par les règles sans IA ; l&apos;IA tourne en local.
      </p>
      <textarea
        id="nouveau-pli"
        ref={field}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError(undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submit(e);
        }}
        maxLength={1500}
        rows={4}
        placeholder="Bonjour, la femme de ménage n'est pas venue ce matin…"
        className="mt-2 w-full resize-y rounded-md border border-ink-200 bg-ground/60 px-3 py-2 text-[14px] leading-relaxed outline-none placeholder:text-ink-500 focus:border-pencil"
      />
      {error && <p className="mt-1.5 text-[12.5px] text-errata">{error}</p>}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-ink-900 px-3 py-1.5 text-[13px] font-medium text-sheet transition-colors hover:bg-ink-700 disabled:cursor-progress disabled:bg-ink-600"
        >
          {pending ? STAGES[stage] : "Préparer la réponse"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md px-2.5 py-1.5 text-[13px] text-ink-600 hover:bg-ink-50">
          Annuler
        </button>
        <kbd className="ml-auto hidden font-code text-[10.5px] text-ink-500 sm:inline">⌘ Entrée</kbd>
      </div>
    </form>
  );
}
