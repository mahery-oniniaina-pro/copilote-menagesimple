import { describe, expect, it } from "vitest";
import { buildKnowledge, loadKnowledge } from "@/lib/knowledge";

describe("fiche de faits", () => {
  const knowledge = loadKnowledge();

  it("se charge et relie chaque fait contradictoire à sa contradiction", () => {
    for (const fact of knowledge.facts.filter((f) => f.status === "contradictory")) {
      expect(knowledge.contradiction(fact.contradiction!)).toBeDefined();
    }
  });

  it("ne cite que des pages du site de MénageSimple", () => {
    for (const fact of knowledge.facts) {
      expect(new URL(fact.source).hostname).toBe("menagesimple.com");
    }
  });

  it("couvre les cinq contradictions relevées", () => {
    expect(knowledge.contradictions.map((c) => c.id)).toEqual(["C1", "C2", "C3", "C4", "C5"]);
    for (const c of knowledge.contradictions) {
      expect(c.decision).toBeNull();
    }
  });

  it("refuse un fait en double", () => {
    const fact = { ...knowledge.facts[0] };
    expect(() => buildKnowledge([fact, fact], knowledge.contradictions)).toThrow(/double/);
  });

  it("refuse un fait contradictoire sans contradiction", () => {
    const fact = { ...knowledge.facts[0], status: "contradictory" };
    expect(() => buildKnowledge([fact], knowledge.contradictions)).toThrow(/contradictoire/);
  });
});
