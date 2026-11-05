import type { Provider } from "./types";

export function ollamaProvider(options: { url?: string; model?: string } = {}): Provider {
  const url = options.url ?? process.env.OLLAMA_URL ?? "http://localhost:11434";
  const model = options.model ?? process.env.OLLAMA_MODEL ?? "mistral";

  return {
    id: `ollama-${model.replace(/[^a-z0-9.]+/gi, "-")}`,
    label: `${model === "mistral" ? "Mistral 7B" : model} via Ollama, en local`,
    async generate({ system, user, schema }) {
      const started = Date.now();
      const response = await fetch(`${url}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model,
          stream: false,
          format: schema,
          options: { temperature: 0, seed: 42, num_ctx: 8192 },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!response.ok) throw new Error(`Ollama a répondu ${response.status}`);
      const data = (await response.json()) as { message?: { content?: string } };
      return { output: JSON.parse(data.message?.content ?? ""), durationMs: Date.now() - started };
    },
  };
}
