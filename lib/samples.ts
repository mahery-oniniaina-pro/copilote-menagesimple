import { runCopilot, type CopilotResult } from "./copilot";
import { loadCases } from "./evaluation";
import { readRecordings, replayProvider } from "./providers/replay";
import { rulesProvider } from "./providers/rules";

export const MAIN_PROVIDER = "ollama-mistral";

export const SAMPLE_IDS = ["C1", "C3", "E3", "C6", "A5", "B4", "D1", "A1", "B2", "E5", "A8", "H5", "H15", "E4", "E6"];

export type Sample = { id: string; group: string; message: string; result: CopilotResult };

export function mainProvider() {
  return readRecordings(MAIN_PROVIDER) ? replayProvider(MAIN_PROVIDER) : rulesProvider();
}

export async function loadSamples(): Promise<Sample[]> {
  const cases = loadCases();
  const provider = mainProvider();
  const samples: Sample[] = [];
  for (const id of SAMPLE_IDS) {
    const c = cases.find((x) => x.id === id);
    if (!c) continue;
    samples.push({ id, group: c.group, message: c.message, result: await runCopilot(c.message, provider) });
  }
  return samples;
}
