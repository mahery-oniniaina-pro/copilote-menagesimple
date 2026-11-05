import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const factSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  topic: z.string(),
  statement: z.string().min(10),
  values: z.array(z.string()),
  source: z.url(),
  quote: z.string().min(5),
  status: z.enum(["verified", "contradictory"]),
  contradiction: z.string().optional(),
});

const contradictionSchema = z.object({
  id: z.string().regex(/^C\d+$/),
  title: z.string(),
  sources: z
    .array(z.object({ page: z.string(), url: z.url(), quote: z.string().min(5) }))
    .min(2),
  impact: z.string(),
  proposal: z.string(),
  decision: z.string().nullable(),
});

export type Fact = z.infer<typeof factSchema>;
export type Contradiction = z.infer<typeof contradictionSchema>;

export type Knowledge = {
  facts: Fact[];
  contradictions: Contradiction[];
  fact: (id: string) => Fact | undefined;
  contradiction: (id: string) => Contradiction | undefined;
};

function readYaml(file: string): unknown {
  return parse(readFileSync(path.join(process.cwd(), file), "utf8"));
}

export function buildKnowledge(rawFacts: unknown, rawContradictions: unknown): Knowledge {
  const facts = z.array(factSchema).parse(rawFacts);
  const contradictions = z.array(contradictionSchema).parse(rawContradictions);

  const factIndex = new Map<string, Fact>();
  for (const fact of facts) {
    if (factIndex.has(fact.id)) throw new Error(`Fait en double : ${fact.id}`);
    factIndex.set(fact.id, fact);
  }
  const contradictionIndex = new Map(contradictions.map((c) => [c.id, c]));

  for (const fact of facts) {
    if (fact.status === "contradictory" && !fact.contradiction) {
      throw new Error(`Le fait ${fact.id} est contradictoire mais ne dit pas quelle contradiction il reprend`);
    }
    if (fact.contradiction && !contradictionIndex.has(fact.contradiction)) {
      throw new Error(`Le fait ${fact.id} renvoie à une contradiction inconnue : ${fact.contradiction}`);
    }
  }

  return {
    facts,
    contradictions,
    fact: (id) => factIndex.get(id),
    contradiction: (id) => contradictionIndex.get(id),
  };
}

let cached: Knowledge | undefined;

export function loadKnowledge(): Knowledge {
  cached ??= buildKnowledge(readYaml("data/facts.yaml"), readYaml("data/contradictions.yaml"));
  return cached;
}
