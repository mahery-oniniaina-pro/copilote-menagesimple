import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PROMPT_VERSION } from "../prompt";
import type { Provider } from "./types";

export type Recording = { message: string; output: unknown; durationMs: number; recordedAt: string };

export type RecordingFile = {
  provider: string;
  label: string;
  promptVersion: string;
  records: Record<string, Recording>;
};

export function recordingKey(message: string): string {
  return createHash("sha256").update(`${PROMPT_VERSION}\n${message.trim()}`).digest("hex").slice(0, 16);
}

export function recordingPath(providerId: string): string {
  return path.join(process.cwd(), "recordings", `${providerId}.json`);
}

export function readRecordings(providerId: string): RecordingFile | undefined {
  const file = recordingPath(providerId);
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf8")) as RecordingFile;
}

export function replayProvider(providerId: string): Provider {
  const recordings = readRecordings(providerId);
  if (!recordings) throw new Error(`Aucun enregistrement pour ${providerId}`);
  return {
    id: providerId,
    label: `${recordings.label} (réponse enregistrée)`,
    async generate({ message }) {
      const record = recordings.records[recordingKey(message)];
      if (!record) throw new Error("Message absent des enregistrements");
      return { output: record.output, durationMs: record.durationMs };
    },
  };
}

export function recordingProvider(inner: Provider): Provider & { save: () => void } {
  const file: RecordingFile = readRecordings(inner.id) ?? {
    provider: inner.id,
    label: inner.label,
    promptVersion: PROMPT_VERSION,
    records: {},
  };
  if (file.promptVersion !== PROMPT_VERSION) {
    file.promptVersion = PROMPT_VERSION;
    file.records = {};
  }
  return {
    ...inner,
    async generate(request) {
      const response = await inner.generate(request);
      file.records[recordingKey(request.message)] = {
        message: request.message.trim(),
        output: response.output,
        durationMs: response.durationMs,
        recordedAt: new Date().toISOString(),
      };
      return response;
    },
    save() {
      mkdirSync(path.dirname(recordingPath(inner.id)), { recursive: true });
      writeFileSync(recordingPath(inner.id), `${JSON.stringify(file, null, 2)}\n`);
    },
  };
}
