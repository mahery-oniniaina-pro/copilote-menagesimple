import { loadKnowledge } from "../lib/knowledge";
import { htmlToText, normalize } from "../lib/text";

const USER_AGENT = "copilote-menagesimple/0.1 (verification de la fiche de faits)";

type Check = { label: string; url: string; quote: string };

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, { headers: { "user-agent": USER_AGENT } });
  if (!response.ok) throw new Error(`${url} : HTTP ${response.status}`);
  return normalize(htmlToText(await response.text()));
}

async function main() {
  const { facts, contradictions } = loadKnowledge();
  const checks: Check[] = [
    ...facts.map((f) => ({ label: f.id, url: f.source, quote: f.quote })),
    ...contradictions.flatMap((c) => c.sources.map((s) => ({ label: `${c.id} (${s.page})`, url: s.url, quote: s.quote }))),
  ];

  const pages = new Map<string, string>();
  for (const url of new Set(checks.map((c) => c.url))) {
    pages.set(url, await fetchPage(url));
  }

  const missing = checks.filter((c) => !pages.get(c.url)!.includes(normalize(c.quote)));
  console.log(`${checks.length - missing.length}/${checks.length} citations retrouvées sur ${pages.size} pages.`);
  for (const m of missing) {
    console.log(`- ${m.label} : citation introuvable sur ${m.url}\n  « ${m.quote} »`);
  }
  if (missing.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
