import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "./components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Copilote service client · prototype pour MénageSimple",
  description:
    "Un copilote qui prépare les réponses du service client à partir de faits vérifiés, contrôle ses chiffres et ses promesses, et passe la main à l'équipe quand il le faut.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="notice">
          <div className="shell">
            Prototype indépendant, non affilié à MénageSimple SA. Messages inventés, faits tirés du site public le 5 novembre 2026.
          </div>
        </div>
        <header className="topbar">
          <div className="shell">
            <a className="brand" href="/">
              Copilote service client
              <small>prototype pour MénageSimple</small>
            </a>
            <Nav />
          </div>
        </header>
        <main>
          <div className="shell">{children}</div>
        </main>
        <footer>
          <div className="shell">
            Réalisé par Mahery Oniniaina pour le deuxième tour du poste « Digital Projects &amp; AI Assistant » (Stonks Holding AG).{" "}
            <a href="https://github.com/mahery-oniniaina-pro/copilote-menagesimple">Code source</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
