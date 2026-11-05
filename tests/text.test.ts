import { describe, expect, it } from "vitest";
import { htmlToText, normalize } from "@/lib/text";

describe("texte des pages", () => {
  it("retire les balises, les scripts et décode les entités", () => {
    const html = "<p>Annulation&nbsp;gratuite jusqu&#8217;à <strong>48H</strong>.</p><script>x()</script>";
    expect(htmlToText(html)).toBe("Annulation gratuite jusqu’à 48H .");
  });

  it("compare sans tenir compte des apostrophes, guillemets et espaces", () => {
    expect(normalize("le bouton » Sauter un ménage » depuis votre compte .")).toBe(
      normalize("le bouton « Sauter un ménage » depuis votre compte."),
    );
  });
});
