import type { Metadata } from "next";
import { Geist_Mono, Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";
import { Rail } from "./ui/Rail";
import "./globals.css";

const ui = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });
const proof = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif", display: "swap" });
const code = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Copilote · registre des plis",
  description:
    "Prototype pour MénageSimple : un copilote qui prépare les réponses du service client à partir de faits vérifiés, contrôle ses chiffres et ses promesses, et ne laisse rien partir sans signature humaine.",
};

const CONTRACT = `<!--
THESIS: le copilote comme registre de plis recommandés : chaque réponse a un numéro de suivi, des étapes visibles, et ne part qu'avec une signature. Refuse la boîte de réception grise à trois colonnes.
OWN-WORLD: papier registre gris-vert, encre noire, filets fins ; jaune signal = action humaine, crayon bleu = sources, vert encre = prêt, vermillon = errata ; Schibsted Grotesk, Source Serif 4 pour l'épreuve, Geist Mono pour les numéros.
STORY: Luca comprend en dix secondes ; l'agent trie, vérifie l'épreuve annotée, signe ou transmet.
FIRST VIEWPORT: rail étroit ; registre à gauche ; pli ouvert au centre (suivi, lettre, épreuve perforée annotée) ; marge à droite (contrôles, sources, errata) ; « Signer et copier » sous l'épreuve.
FORM: Envoi recommandé (tirage, 7e) fondu avec Épreuve corrigée ; seed 4e39d313.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${ui.variable} ${proof.variable} ${code.variable}`}>
      <body className="min-h-dvh">
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <div className="flex min-h-dvh flex-col md:flex-row">
          <Rail />
          <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
