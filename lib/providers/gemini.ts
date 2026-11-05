import type { Provider } from "./types";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export function geminiProvider(options: { apiKey?: string; model?: string } = {}): Provider {
  const apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
  const model = options.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante");

  return {
    id: `gemini-${model}`,
    label: `${model} via l'API Gemini`,
    async generate({ system, user }) {
      const started = Date.now();
      const response = await fetch(`${ENDPOINT}/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { temperature: 0, responseMimeType: "application/json" },
        }),
      });
      if (!response.ok) throw new Error(`Gemini a répondu ${response.status}`);
      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
      return { output: JSON.parse(text), durationMs: Date.now() - started };
    },
  };
}
