import { describe, expect, it } from "vitest";
import { formatHours, monthlyCost } from "@/lib/budget";
import { loadKnowledge } from "@/lib/knowledge";

// Tableau publié dans l'article du 26 octobre 2026 (« Combien ça coûte par mois ? »).
const PUBLISHED = [
  { hours: 2, chaque_semaine: 380, deux_semaines: 190, quatre_semaines: 95 },
  { hours: 2.5, chaque_semaine: 476, deux_semaines: 238, quatre_semaines: 119 },
  { hours: 3, chaque_semaine: 571, deux_semaines: 285, quatre_semaines: 143 },
] as const;

describe("budget mensuel", () => {
  it.each(PUBLISHED)("retrouve les montants de l'article pour $hours h", (row) => {
    expect(monthlyCost(row.hours, "chaque_semaine")).toBe(row.chaque_semaine);
    expect(monthlyCost(row.hours, "deux_semaines")).toBe(row.deux_semaines);
    expect(monthlyCost(row.hours, "quatre_semaines")).toBe(row.quatre_semaines);
  });

  it("retrouve les 4 h par semaine de l'article", () => {
    expect(monthlyCost(4, "chaque_semaine")).toBe(761);
  });

  it("utilise le tarif de la fiche de faits", () => {
    expect(loadKnowledge().fact("tarif_horaire")?.values).toContain("43.90");
  });

  it("montre que les budgets du guide sont calculés hors TVA (contradiction C2)", () => {
    const guide = [
      { hours: 2, frequency: "deux_semaines", announced: 175 },
      { hours: 2.5, frequency: "chaque_semaine", announced: 440 },
      { hours: 3.5, frequency: "chaque_semaine", announced: 615 },
    ] as const;
    for (const g of guide) {
      expect(Math.abs(monthlyCost(g.hours, g.frequency, 40.61) - g.announced)).toBeLessThanOrEqual(1);
      expect(monthlyCost(g.hours, g.frequency) - g.announced).toBeGreaterThan(14);
    }
  });

  it("écrit les durées à la française", () => {
    expect(formatHours(2)).toBe("2 h");
    expect(formatHours(2.5)).toBe("2 h 30");
  });
});
