export const metadata = { title: "Méthode · Copilote service client" };

export default function Methode() {
  return (
    <>
      <h1>Méthode</h1>
      <p className="lead">
        Le copilote prépare, l&apos;équipe décide. L&apos;IA sert à comprendre le message et à rédiger ; tout ce qui doit être juste
        (les chiffres, les règles, le choix de passer la main) est vérifié sans IA.
      </p>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <section className="card panel">
          <h2>Pourquoi ce problème</h2>
          <ul>
            <li>
              Sur CHF 43.90 de l&apos;heure, il reste CHF 4.00 pour tout faire tourner, service client compris, et CHF 0.80 de marge
              (page d&apos;accueil). Pour un client qui réserve 2 h 30 toutes les deux semaines, cela fait CHF 260 par an pour tout
              le fonctionnement.
            </li>
            <li>Le service client répond du lundi au vendredi, de 8 h à 19 h : un message du vendredi soir attend environ 61 heures.</li>
            <li>
              Dans les avis Google récents à 1 ou 2 étoiles reviennent les annulations de dernière minute, les litiges sur les frais
              et les dégâts : des situations où une réponse rapide et juste compte.
            </li>
            <li>
              Le site se contredit sur cinq points que les clients demandent (<a href="/coherence">détail</a>). Une IA branchée
              telle quelle répondrait faux avec assurance.
            </li>
          </ul>
        </section>

        <section className="card panel">
          <h2>Comment ça marche</h2>
          <ol className="steps">
            <li>
              <strong>Lecture sans IA</strong> : durée, fréquence, ville et canton, créneau, langue, tentative d&apos;injection. Le
              budget est calculé avec la formule publiée par MénageSimple.
            </li>
            <li>
              <strong>Brouillon par le modèle</strong> : intention, résumé pour l&apos;équipe, faits utilisés, réponse, dans un
              format imposé.
            </li>
            <li>
              <strong>Contrôles sans IA</strong> : chaque chiffre doit avoir une source, aucune promesse, au moins un fait cité,
              budget juste, langue du client.
            </li>
            <li>
              <strong>Statut</strong> : prêt, à revoir, à transmettre ou à classer. Argent, dégât, absence, données personnelles et
              menace juridique passent toujours à un humain, même si le modèle se trompe.
            </li>
            <li>
              <strong>Relecture</strong> : une personne de l&apos;équipe relit, corrige si besoin et envoie.
            </li>
          </ol>
        </section>

        <section className="card panel">
          <h2>Ce que je n&apos;ai pas fait, volontairement</h2>
          <ul>
            <li>Aucun accès aux systèmes de MénageSimple, aucune donnée personnelle : messages inventés, avis lus seulement pour les thèmes.</li>
            <li>Pas d&apos;envoi automatique : on commence par des brouillons et on mesure.</li>
            <li>Pas de chatbot public sur le site au départ : d&apos;abord en interne, là où une erreur ne coûte rien.</li>
            <li>Pas de tri des candidatures d&apos;intervenantes par IA : décision sur des personnes, trop sensible.</li>
            <li>Pas de base vectorielle : une quarantaine de faits tiennent dans la consigne du modèle.</li>
            <li>Pas de base de données : le prototype ne stocke rien.</li>
          </ul>
        </section>

        <section className="card panel">
          <h2>Mise en service proposée</h2>
          <ol className="steps">
            <li>Trancher les cinq contradictions et corriger le site : une ligne à changer dans la fiche de faits pour chacune.</li>
            <li>
              Deux semaines en observation dans l&apos;outil de support (Freshdesk ou Zendesk) : le copilote propose, l&apos;équipe
              envoie. On mesure la part de brouillons envoyés sans retouche.
            </li>
            <li>Automatiser seulement les questions d&apos;information qui passent ce cap ; les incidents restent humains.</li>
            <li>Faire passer l&apos;assistant téléphonique testé par l&apos;équipe sur le même banc d&apos;essai.</li>
          </ol>
        </section>

        <section className="card panel">
          <h2>Coût</h2>
          <p>
            0 CHF. Le modèle (Mistral 7B) tourne en local avec Ollama : aucun message client ne sort de la machine. L&apos;API Gemini
            est prévue en option, avec l&apos;offre gratuite. Le banc d&apos;essai rejoue des réponses enregistrées, donc il se
            relance sans modèle, sans réseau et sans clé.
          </p>
        </section>

        <section className="card panel">
          <h2>Limites connues</h2>
          <ul>
            <li>Un modèle de 7 milliards de paramètres se trompe parfois d&apos;intention ou de formulation : les contrôles le rattrapent, pas toujours.</li>
            <li>Les règles qui détectent les situations sensibles ne connaissent que les formulations prévues.</li>
            <li>60 messages inventés ne remplacent pas de vrais messages : il faut mesurer en observation avant d&apos;automatiser.</li>
            <li>Les contrôles vérifient les chiffres et les promesses, pas le sens de chaque phrase : la relecture humaine reste nécessaire.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
