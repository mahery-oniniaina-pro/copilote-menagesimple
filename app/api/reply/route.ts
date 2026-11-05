import { NextResponse } from "next/server";
import { runCopilot } from "@/lib/copilot";
import { analyzeMessage } from "@/lib/extract";
import { loadKnowledge } from "@/lib/knowledge";
import { systemPrompt, userPrompt } from "@/lib/prompt";
import { geminiProvider } from "@/lib/providers/gemini";
import { ollamaProvider } from "@/lib/providers/ollama";
import { readRecordings, recordingKey, replayProvider } from "@/lib/providers/replay";
import { rulesProvider } from "@/lib/providers/rules";
import { MAIN_PROVIDER } from "@/lib/samples";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60_000;
const LIMIT = 20;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > LIMIT;
}

async function ollamaReachable(): Promise<boolean> {
  if (process.env.VERCEL) return false;
  try {
    const response = await fetch(`${process.env.OLLAMA_URL ?? "http://localhost:11434"}/api/tags`, {
      signal: AbortSignal.timeout(500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function isRecorded(message: string): boolean {
  const knowledge = loadKnowledge();
  const rate = parseFloat(knowledge.fact("tarif_horaire")?.values[0] ?? "43.90");
  const key = recordingKey({ system: systemPrompt(knowledge), user: userPrompt(message, analyzeMessage(message, rate)) });
  return Boolean(readRecordings(MAIN_PROVIDER)?.records[key]);
}

async function pickProvider(message: string) {
  if (isRecorded(message)) return replayProvider(MAIN_PROVIDER);
  if (process.env.GEMINI_API_KEY) return geminiProvider();
  if (await ollamaReachable()) return ollamaProvider();
  return rulesProvider();
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Trop de messages d'affilée : réessayez dans quelques minutes." }, { status: 429 });
  }
  const body = (await request.json().catch(() => ({}))) as { message?: unknown };
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 3 || message.length > 1500) {
    return NextResponse.json({ error: "Le message doit faire entre 3 et 1 500 caractères." }, { status: 400 });
  }
  return NextResponse.json(await runCopilot(message, await pickProvider(message)));
}
