import { runCopilot, type CopilotResult } from "./copilot";
import { loadCases } from "./evaluation";
import { readRecordings, replayProvider } from "./providers/replay";
import { rulesProvider } from "./providers/rules";

export const MAIN_PROVIDER = "ollama-mistral";

export const SAMPLE_IDS = ["C1", "C3", "H5", "C6", "D1", "H15", "A5", "B4", "A1", "H1", "A8", "H13", "E5", "E4", "E6"];

export type Sample = { id: string; code: string; time: string; group: string; message: string; result: CopilotResult };

export function mainProvider() {
  return readRecordings(MAIN_PROVIDER) ? replayProvider(MAIN_PROVIDER) : rulesProvider();
}

export async function loadSamples(): Promise<Sample[]> {
  const cases = loadCases();
  const provider = mainProvider();
  const samples: Sample[] = [];
  for (const [index, id] of SAMPLE_IDS.entries()) {
    const c = cases.find((x) => x.id === id);
    if (!c) continue;
    const minutes = 7 * 60 + 41 + index * 23;
    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    samples.push({ id, code: `RR·${id}`, time, group: c.group, message: c.message, result: await runCopilot(c.message, provider) });
  }
  return samples;
}
