import { loadSamples } from "@/lib/samples";
import { CopilotWorkspace } from "./components/CopilotWorkspace";

export default async function Home() {
  const samples = await loadSamples();
  return (
    <>
      <h1>Le copilote du service client</h1>
      <p className="lead">
        Il lit le message, prépare une réponse qui ne cite que des faits vérifiés du site, contrôle lui-même ses chiffres et
        ses promesses, et passe la main à l&apos;équipe dès qu&apos;il est question d&apos;argent, de dégâts, d&apos;absence ou
        d&apos;un point sur lequel le site se contredit. Une personne relit toujours avant l&apos;envoi.
      </p>
      <CopilotWorkspace samples={samples} />
    </>
  );
}
