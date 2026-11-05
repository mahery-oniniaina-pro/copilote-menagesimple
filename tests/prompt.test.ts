import { describe, expect, it } from "vitest";
import { analyzeMessage } from "@/lib/extract";
import { loadKnowledge } from "@/lib/knowledge";
import { modelJsonSchema, systemPrompt, userPrompt } from "@/lib/prompt";

describe("consigne du modèle", () => {
  const knowledge = loadKnowledge();

  it("ne montre comme faits vérifiés que les faits vérifiés", () => {
    const prompt = systemPrompt(knowledge);
    const verifiedPart = prompt.split("POINTS NON TRANCHÉS")[0];
    expect(verifiedPart).toContain("[tarif_horaire]");
    expect(verifiedPart).not.toContain("[materiel_produits]");
  });

  it("donne au modèle le budget calculé par le code", () => {
    const message = "Combien pour 2h30 toutes les deux semaines ?";
    expect(userPrompt(message, analyzeMessage(message))).toContain("CHF 238 par mois");
  });

  it("guide le modèle quand le code détecte un dégât ou une annulation", () => {
    const degat = "Elle a laissé des taches sur le parquet";
    expect(userPrompt(degat, analyzeMessage(degat))).toContain("Demande des photos");
    const annulation = "Je dois annuler lundi";
    expect(userPrompt(annulation, analyzeMessage(annulation))).toContain("90 %");
  });

  it("impose un format qui n'accepte que des identifiants de faits connus", () => {
    const schema = modelJsonSchema(knowledge) as { properties: { faits_utilises: { items: { enum: string[] } } } };
    expect(schema.properties.faits_utilises.items.enum).toContain("zones");
    expect(schema.properties.faits_utilises.items.enum).toHaveLength(knowledge.facts.length);
  });
});
