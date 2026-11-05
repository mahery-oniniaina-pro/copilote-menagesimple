import { describe, expect, it } from "vitest";
import { extractClaims, sameNumber } from "@/lib/claims";
import { frame } from "@/lib/format";
import { findForbiddenPromises } from "@/lib/promises";
import { detectSensitive } from "@/lib/sensitive";

describe("chiffres d'une réponse", () => {
  it("lit les séparateurs de milliers, les francs abrégés et les numéros internationaux", () => {
    expect(extractClaims("CHF 1'380 par mois").map((c) => c.value)).toEqual(["1380"]);
    expect(extractClaims("49 frs").map((c) => c.value)).toEqual(["49"]);
    expect(extractClaims("29.90 de l'heure").map((c) => c.value)).toEqual(["29.9"]);
    expect(extractClaims("+41 (0)22 518 90 99").map((c) => c.value)).toEqual(["0225189099"]);
    expect(extractClaims("trois heures et demie").map((c) => c.value)).toEqual(["3.5"]);
  });

  it("relève montants, pourcentages, durées et téléphones", () => {
    const claims = extractClaims("CHF 238 par mois, 90 % après 48 heures, 2h30, appelez le 022 518 90 99");
    expect(claims.map((c) => [c.kind, c.value])).toEqual([
      ["montant", "238"],
      ["pourcentage", "90"],
      ["durée", "48"],
      ["durée", "2.5"],
      ["téléphone", "0225189099"],
    ]);
  });

  it("compare 43,90 et 43.90", () => {
    expect(sameNumber("43,90", "43.90")).toBe(true);
    expect(sameNumber("0225189099", "0225189098")).toBe(false);
  });
});

describe("promesses", () => {
  it("bloque un remboursement ou une heure offerte", () => {
    const hits = findForbiddenPromises("Nous allons vous rembourser et l'heure est offerte.", []);
    expect(hits.map((h) => h.label)).toEqual(["remboursement", "gratuité"]);
  });

  it("laisse passer ce qu'un fait cité dit déjà", () => {
    expect(findForbiddenPromises("L'annulation est gratuite jusqu'à 48 heures avant.", ["Annulation gratuite jusqu’à 48H avant le ménage"])).toEqual([]);
  });
});

describe("situations sensibles", () => {
  it.each([
    ["La femme de ménage n'est toujours pas là", "absence_intervenante"],
    ["Elle a cassé mon vase", "degat"],
    ["Je saisis mon avocat", "menace_juridique"],
    ["Je veux être remboursée", "litige_frais"],
    ["Merci de supprimer toutes mes données", "donnees_personnelles"],
    ["Aucune disponibilité à Genève le samedi", "pas_de_disponibilite"],
    ["Le formulaire affiche un message d'erreur", "probleme_reservation"],
    ["Personne n’est venu ce matin", "absence_intervenante"],
    ["L'intervenante ne s'est pas présentée", "absence_intervenante"],
    ["Elle a abimé ma table", "degat"],
    ["des degats sur mon parquet", "degat"],
    ["Je souhaite fermer mon compte", "donnees_personnelles"],
    ["Aucune intervenante disponible à Sion ?", "pas_de_disponibilite"],
    ["Vous m'avez débité 90 % alors que j'avais annulé 3 jours avant", "litige_frais"],
  ])("« %s » passe à un humain (%s)", (message, intent) => {
    expect(detectSensitive(message)).toContain(intent);
  });

  it("ne voit rien de sensible dans une question de prix", () => {
    expect(detectSensitive("Combien coûte un ménage de 2 heures ?")).toEqual([]);
  });
});

describe("mise en forme", () => {
  it("ajoute la salutation et la signature dans la langue du client", () => {
    expect(frame("Merci pour votre question.", "fr")).toBe("Bonjour,\n\nMerci pour votre question.\n\nBien cordialement,\nL'équipe MénageSimple");
    expect(frame("Hello, yes we do.\n\nKind regards,\nThe MénageSimple team", "en")).toBe("Hello, yes we do.\n\nKind regards,\nThe MénageSimple team");
  });
});
