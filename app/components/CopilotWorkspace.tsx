"use client";

import { useMemo, useState } from "react";
import type { CopilotResult } from "@/lib/copilot";
import type { Sample } from "@/lib/samples";
import { PriorityBadge, StatusBadge } from "./Badges";

const PRIORITY_ORDER = { urgente: 0, haute: 1, normale: 2 } as const;
const STATUS_ORDER = { a_transmettre: 0, a_revoir: 1, pret: 2, a_classer: 3 } as const;

type Entry = { id: string; group: string; message: string; result: CopilotResult };

export function CopilotWorkspace({ samples }: { samples: Sample[] }) {
  const sorted = useMemo(
    () =>
      [...samples].sort(
        (a, b) =>
          PRIORITY_ORDER[a.result.priority] - PRIORITY_ORDER[b.result.priority] ||
          STATUS_ORDER[a.result.status] - STATUS_ORDER[b.result.status],
      ),
    [samples],
  );
  const [entries, setEntries] = useState<Entry[]>(sorted);
  const [selectedId, setSelectedId] = useState(sorted[0]?.id);
  const selected = entries.find((e) => e.id === selectedId) ?? entries[0];

  return (
    <div className="workspace">
      <aside className="card inbox" aria-label="Boîte de réception">
        <div className="inbox-title">Boîte de réception triée</div>
        {entries.map((entry) => (
          <button
            key={entry.id}
            className="inbox-item"
            aria-pressed={entry.id === selected?.id}
            onClick={() => setSelectedId(entry.id)}
          >
            <div className="row">
              <StatusBadge status={entry.result.status} />
              <PriorityBadge priority={entry.result.priority} />
              <span className="meta">{entry.group}</span>
            </div>
            <p>{entry.message}</p>
          </button>
        ))}
      </aside>

      <section>
        {selected && <Draft key={selected.id} entry={selected} />}
        <Composer
          onResult={(result) => {
            const id = `vous-${Date.now()}`;
            setEntries((current) => [{ id, group: "Votre message", message: result.message, result }, ...current]);
            setSelectedId(id);
          }}
        />
      </section>

      <aside className="side">{selected && <Evidence result={selected.result} />}</aside>
    </div>
  );
}

function Draft({ entry }: { entry: Entry }) {
  const { result } = entry;
  const [reply, setReply] = useState(result.reply);
  const [copied, setCopied] = useState(false);

  return (
    <article className="card panel">
      <div className="row" style={{ marginBottom: 14 }}>
        <StatusBadge status={result.status} long />
        <PriorityBadge priority={result.priority} />
        <span className="badge neutral">{result.intentLabel}</span>
      </div>

      <div className="label">Message du client · motif « {result.reason} »</div>
      <div className="customer-message">{entry.message}</div>

      {result.summary && (
        <p className="summary">
          <strong>Pour l&apos;équipe :</strong> {result.summary}
          {result.status === "a_transmettre" && result.handoffReason ? ` ${result.handoffReason}` : ""}
        </p>
      )}

      <div className="label" style={{ marginTop: 18 }}>
        {result.status === "a_classer" ? "Aucune réponse à envoyer" : "Brouillon de réponse, modifiable"}
      </div>
      {result.status !== "a_classer" && (
        <>
          <textarea
            className="reply"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            aria-label="Brouillon de réponse"
          />
          <div className="actions">
            <button
              className="secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(reply);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copié" : "Copier la réponse"}
            </button>
            {reply !== result.reply && (
              <button className="secondary" onClick={() => setReply(result.reply)}>
                Revenir au brouillon
              </button>
            )}
          </div>
        </>
      )}

      <p className="meta" style={{ marginTop: 14, marginBottom: 0 }}>
        Préparé par {result.provider.label}
        {result.durationMs ? ` en ${(result.durationMs / 1000).toFixed(1).replace(".", ",")} s` : ""}.
      </p>
    </article>
  );
}

function Evidence({ result }: { result: CopilotResult }) {
  return (
    <>
      <div className="card panel">
        <h3>Contrôles sans IA</h3>
        <ul className="checks">
          {result.checks.map((check) => (
            <li key={check.id}>
              <span className={check.ok ? "ok" : "ko"} aria-label={check.ok ? "réussi" : "échoué"}>
                {check.ok ? "✓" : "✗"}
              </span>
              <span>
                {check.label}
                {check.detail && <div className="detail">{check.detail}</div>}
              </span>
            </li>
          ))}
        </ul>
        {result.flags.length > 0 && (
          <>
            <h3 style={{ marginTop: 14 }}>Signalements</h3>
            <ul className="flags">
              {result.flags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="card panel">
        <h3>Faits cités</h3>
        {result.facts.length === 0 && <p className="meta">Aucun fait cité.</p>}
        {result.facts.map((fact) => (
          <div key={fact.id} className={`fact ${fact.status === "contradictory" ? "contradiction" : ""}`}>
            <div>{fact.statement}</div>
            <blockquote>« {fact.quote} »</blockquote>
            <a className="meta" href={fact.source} target="_blank" rel="noreferrer">
              {new URL(fact.source).pathname === "/" ? "menagesimple.com" : new URL(fact.source).pathname}
            </a>
            {fact.status === "contradictory" && <span className="badge a_revoir" style={{ marginLeft: 8 }}>Non tranché</span>}
          </div>
        ))}
        {result.contradictions.map((c) => (
          <div key={c.id} className="fact contradiction">
            <strong>
              {c.id} · {c.title}
            </strong>
            <div className="detail">{c.proposal}</div>
            <a className="meta" href="/coherence">
              Voir les citations
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

function Composer({ onResult }: { onResult: (result: CopilotResult) => void }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setPending(true);
    setError(undefined);
    try {
      const response = await fetch("/api/reply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Erreur");
      onResult(data as CopilotResult);
      setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="card panel composer" onSubmit={submit}>
      <h3>Essayer un autre message</h3>
      <p className="meta">
        Écrivez comme un client. Sans modèle d&apos;IA configuré sur ce serveur, la réponse est préparée par les règles, sans IA :
        c&apos;est le point de comparaison du banc d&apos;essai.
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={1500}
        placeholder="Bonjour, ma femme de ménage n'est pas venue ce matin…"
        aria-label="Message du client"
      />
      <div className="actions">
        <button className="primary" type="submit" disabled={pending || !message.trim()}>
          {pending ? "Préparation…" : "Préparer la réponse"}
        </button>
      </div>
      {error && <p className="detail" style={{ color: "var(--urgent)" }}>{error}</p>}
    </form>
  );
}
