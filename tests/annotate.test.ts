import { describe, expect, it } from "vitest";
import { annotate } from "@/lib/annotate";
import { loadKnowledge } from "@/lib/knowledge";

describe("annotation de l'épreuve", () => {
  const knowledge = loadKnowledge();
  const facts = ["tarif_horaire", "formule_budget", "sauter_menage"].map((id) => knowledge.fact(id)!);

  it("souligne chaque chiffre sourcé et le relie à son fait", () => {
    const { segments, notes } = annotate("Comptez CHF 238 par mois, au tarif de CHF 43.90 de l'heure.", facts, ["238"]);
    expect(segments.filter((s) => s.note).map((s) => s.text)).toEqual(["CHF 238", "CHF 43.90"]);
    expect(notes.map((n) => n.fact.id)).toEqual(["formule_budget", "tarif_horaire"]);
  });

  it("relie une expression entre guillemets au fait qui la contient", () => {
    const { notes } = annotate("Cliquez sur « Sauter un ménage » depuis votre compte.", facts);
    expect(notes.map((n) => n.fact.id)).toEqual(["sauter_menage"]);
  });

  it("ne souligne pas un chiffre sans source", () => {
    expect(annotate("Comptez CHF 199 par mois.", facts).notes).toEqual([]);
  });
});
