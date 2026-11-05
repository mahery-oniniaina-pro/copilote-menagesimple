import { describe, expect, it } from "vitest";
import { runCopilot } from "@/lib/copilot";
import type { Provider } from "@/lib/providers/types";
import { rulesProvider } from "@/lib/providers/rules";

function fakeProvider(output: unknown): Provider {
  return { id: "faux", label: "Modèle de test", generate: async () => ({ output, durationMs: 1 }) };
}

const base = {
  langue: "fr",
  resume: "Question",
  a_transmettre: false,
  raison_transmission: "",
};

describe("copilote", () => {
  it("prépare une réponse prête quand tout est vérifié", async () => {
    const result = await runCopilot(
      "Combien coûte un ménage de 2h30 toutes les deux semaines ?",
      fakeProvider({
        ...base,
        intention: "prix_budget",
        faits_utilises: ["tarif_horaire", "formule_budget"],
        reponse: "Pour 2 h 30 toutes les deux semaines, comptez CHF 238 par mois, au tarif de CHF 43.90 de l'heure.",
      }),
    );
    expect(result.status).toBe("pret");
    expect(result.reply).toMatch(/^Bonjour,/);
  });

  it("renvoie à la relecture un chiffre sans source", async () => {
    const result = await runCopilot(
      "Combien coûte un ménage de 2h30 toutes les deux semaines ?",
      fakeProvider({ ...base, intention: "prix_budget", faits_utilises: ["tarif_horaire"], reponse: "Comptez CHF 199 par mois." }),
    );
    expect(result.status).toBe("a_revoir");
    expect(result.checks.find((c) => c.id === "chiffres")?.ok).toBe(false);
    expect(result.checks.find((c) => c.id === "calcul")?.ok).toBe(false);
  });

  it("bloque une promesse de remboursement", async () => {
    const result = await runCopilot(
      "Comment fonctionne l'annulation ?",
      fakeProvider({ ...base, intention: "annuler_sauter", faits_utilises: ["sauter_menage"], reponse: "Pas de souci, nous vous remboursons." }),
    );
    expect(result.status).toBe("a_revoir");
  });

  it("transmet une question qui touche un point contradictoire du site", async () => {
    const result = await runCopilot(
      "Je dois fournir l'aspirateur ?",
      fakeProvider({ ...base, intention: "materiel_produits", faits_utilises: ["materiel_produits"], reponse: "Oui." }),
    );
    expect(result.status).toBe("a_transmettre");
    expect(result.contradictions.map((c) => c.id)).toEqual(["C1"]);
  });

  it("remplace le brouillon par une réponse d'attente sur un point non tranché, même sans citation", async () => {
    const result = await runCopilot(
      "Je dois fournir l'aspirateur ?",
      fakeProvider({ ...base, intention: "materiel_produits", faits_utilises: [], reponse: "Oui, prévoyez votre aspirateur." }),
    );
    expect(result.status).toBe("a_transmettre");
    expect(result.reply).toContain("Nous la vérifions avec l'équipe");
    expect(result.reply).not.toContain("prévoyez");
    expect(result.contradictions.map((c) => c.id)).toEqual(["C1"]);
  });

  it("transmet la durée conseillée pour un 4,5 pièces (contradiction C3)", async () => {
    const result = await runCopilot(
      "Il faut combien d'heures pour un 4,5 pièces ?",
      fakeProvider({ ...base, intention: "duree_conseillee", faits_utilises: ["duree_minimale"], reponse: "Comptez au moins 2 heures." }),
    );
    expect(result.status).toBe("a_transmettre");
    expect(result.contradictions.map((c) => c.id)).toEqual(["C3"]);
  });

  it("transmet un dégât même si le modèle se trompe d'intention", async () => {
    const result = await runCopilot(
      "Votre intervenante a cassé mon vase.",
      fakeProvider({ ...base, intention: "fonctionnement_general", faits_utilises: ["meme_intervenante"], reponse: "Nous privilégions le même intervenant." }),
    );
    expect(result.status).toBe("a_transmettre");
    expect(result.priority).toBe("urgente");
  });

  it("se replie sur les règles si le modèle répond n'importe quoi", async () => {
    const result = await runCopilot("Comment je saute le ménage de la semaine prochaine ?", fakeProvider({ texte: "?" }));
    expect(result.fallback).toBeDefined();
    expect(result.intent).toBe("annuler_sauter");
  });

  it("classe le démarchage sans réponse", async () => {
    const result = await runCopilot("Nous sommes une agence SEO et pouvons doubler vos réservations.", rulesProvider());
    expect(result.status).toBe("a_classer");
    expect(result.reply).toBe("");
  });

  it("retrouve seul la source d'un chiffre écrit tel quel dans un fait vérifié", async () => {
    const result = await runCopilot(
      "Comment j'annule mon ménage ?",
      fakeProvider({
        ...base,
        intention: "annuler_sauter",
        faits_utilises: [],
        reponse: "Cliquez sur « Sauter un ménage » : c'est sans frais jusqu'à 48 heures avant, ensuite 90 % sont facturés.",
      }),
    );
    expect(result.status).toBe("pret");
    expect(result.facts.map((f) => f.id)).toContain("annulation_48h");
    expect(result.flags.some((f) => f.startsWith("Source ajoutée"))).toBe(true);
  });

  it("renvoie à la relecture une annulation qui oublie les 90 %", async () => {
    const result = await runCopilot(
      "Comment j'annule mon ménage ?",
      fakeProvider({ ...base, intention: "annuler_sauter", faits_utilises: ["sauter_menage", "annulation_48h"], reponse: "Vous pouvez annuler jusqu'à 48 heures avant." }),
    );
    expect(result.status).toBe("a_revoir");
    expect(result.checks.find((c) => c.id === "regle_annulation")?.ok).toBe(false);
  });

  it("signale un identifiant de fait inventé", async () => {
    const result = await runCopilot(
      "Vous venez à Lausanne ?",
      fakeProvider({ ...base, intention: "zones_desservies", faits_utilises: ["zones", "fait_invente"], reponse: "Oui, nous venons à Lausanne." }),
    );
    expect(result.checks.find((c) => c.id === "sources")?.ok).toBe(false);
    expect(result.status).toBe("a_revoir");
  });
});
