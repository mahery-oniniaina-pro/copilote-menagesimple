export const metadata = { title: "Méthode · Copilote" };

const STEPS = [
  { label: "Lu sans IA", text: "Durée, fréquence, ville et canton, langue, situation sensible, tentative d'injection. Le budget est calculé avec la formule publiée par MénageSimple." },
  { label: "Rédigé par le modèle", text: "Mistral 7B, en local, donne l'intention, un résumé pour l'équipe, les faits utilisés et une épreuve, dans un format imposé." },
  { label: "Contrôlé sans IA", text: "Chaque chiffre doit avoir une source, aucune promesse ne passe, au moins un fait est cité, le budget et la langue sont justes." },
  { label: "Signé ou transmis", text: "Argent, dégât, absence, données personnelles, menace et points non tranchés reviennent toujours à l'équipe. Le reste attend votre signature." },
];

export default function Methode() {
  return (
    <main className="mx-auto w-full max-w-[1040px] px-4 py-6 md:px-8 md:py-10">
      <header className="max-w-[68ch]">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">Méthode</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-600">
          Le copilote prépare, l&apos;équipe décide. L&apos;IA sert à comprendre le message et à rédiger ; tout ce qui doit être
          juste, les chiffres, les règles, le choix de passer la main, est vérifié par du code.
        </p>
      </header>

      <ol className="mt-9 grid gap-px overflow-hidden rounded-lg border border-ink-150 bg-ink-150 md:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.label} className="bg-sheet px-5 py-5">
            <div className="flex items-center" aria-hidden>
              <span className={`size-2.5 rounded-full border-[1.5px] border-ink-900 ${index === STEPS.length - 1 ? "bg-signal" : "bg-ink-900"}`} />
              <span className="h-[1.5px] flex-1 bg-ink-900" />
            </div>
            <h2 className="mt-3 text-[15px] font-semibold">{step.label}</h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-x-14 gap-y-10 md:grid-cols-2">
        <section className="max-w-[62ch]">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Pourquoi ce problème</h2>
          <ul className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-700">
            <li>Sur CHF 43.90 de l&apos;heure, il reste CHF 4.00 pour tout faire tourner, service client compris, et CHF 0.80 de marge. Un client qui réserve 2 h 30 toutes les deux semaines laisse CHF 260 par an pour tout le fonctionnement.</li>
            <li>Le service client répond du lundi au vendredi, de 8 h à 19 h : un message du vendredi soir attend environ 61 heures.</li>
            <li>Les avis Google récents à 1 ou 2 étoiles parlent d&apos;annulations de dernière minute, de litiges sur les frais et de dégâts : des moments où une réponse rapide et juste compte.</li>
            <li>Le site se contredit sur cinq points que les clients demandent. Une IA branchée telle quelle répondrait faux avec assurance.</li>
          </ul>
        </section>

        <section className="max-w-[62ch]">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Mise en service proposée</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-ink-700 marker:font-code marker:text-[12px] marker:text-ink-500">
            <li>Trancher les cinq errata et corriger le site : une ligne à changer dans la fiche de faits pour chacun.</li>
            <li>Deux semaines en observation dans l&apos;outil de support : le copilote propose, l&apos;équipe envoie, on mesure la part d&apos;épreuves signées sans retouche.</li>
            <li>Automatiser seulement les questions d&apos;information qui passent ce cap ; les incidents restent humains.</li>
            <li>Faire passer l&apos;assistant téléphonique en test sur le même banc d&apos;essai.</li>
          </ol>
        </section>

        <section className="max-w-[62ch]">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Volontairement écarté</h2>
          <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
            <li>Aucun accès aux systèmes de MénageSimple, aucune donnée personnelle : messages inventés, avis lus pour les thèmes seulement.</li>
            <li>Pas d&apos;envoi automatique, pas de chatbot public au départ : d&apos;abord en interne, là où une erreur ne coûte rien.</li>
            <li>Pas de tri des candidatures d&apos;intervenantes par IA : décision sur des personnes, trop sensible.</li>
            <li>Pas de base vectorielle ni de base de données : une quarantaine de faits tiennent dans la consigne, et le prototype ne stocke rien.</li>
          </ul>
        </section>

        <section className="max-w-[62ch]">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">Coût et limites</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
            0 CHF. Le modèle tourne en local avec Ollama : aucun message client ne sort de la machine. En ligne, la démo rejoue
            les réponses enregistrées et traite un message nouveau avec les règles sans IA.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
            Un modèle de 7 milliards de paramètres se trompe parfois d&apos;intention ou de langue ; les règles de détection ne
            connaissent que les tournures prévues ; 60 messages inventés ne remplacent pas de vrais messages. D&apos;où la phase
            d&apos;observation avant toute automatisation.
          </p>
          <a
            href="https://github.com/mahery-oniniaina-pro/copilote-menagesimple"
            className="mt-4 inline-block text-[14px] font-medium text-pencil underline"
          >
            Lire le code et le journal des essais
          </a>
        </section>
      </div>

      <footer className="mt-14 border-t border-ink-150 pt-5 text-[12.5px] text-ink-500">
        Prototype réalisé par Mahery Oniniaina pour le deuxième tour du poste « Digital Projects &amp; AI Assistant » chez Stonks
        Holding AG. Non affilié à MénageSimple SA ; messages inventés ; faits tirés du site public le 5 novembre 2026.
      </footer>
    </main>
  );
}
