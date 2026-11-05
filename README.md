# Copilote du service client MénageSimple

Prototype réalisé pour le deuxième tour du poste « Digital Projects & AI Assistant » chez Stonks Holding AG.
Projet indépendant, non affilié à MénageSimple SA. Il n'utilise que des données publiques ou inventées.

**Démo** : https://copilote-menagesimple.vercel.app

## En bref

Le copilote lit un message de client, prépare une réponse qui ne cite que des faits vérifiés du site de MénageSimple, contrôle lui-même ses chiffres et ses promesses, et passe la main à l'équipe dès qu'il est question d'argent, de dégâts, d'absence d'intervenante ou d'un point sur lequel le site se contredit. Une personne relit toujours avant l'envoi.

Pourquoi ce problème, en quatre chiffres tirés de sources publiques ([détail](docs/analyse.md)) :

- **CHF 4.00** sur les CHF 43.90 de l'heure pour tout faire tourner, service client compris ; **CHF 0.80** de marge ;
- **lundi à vendredi, 8 h à 19 h** : un message du vendredi soir attend environ 61 heures, alors que l'annulation gratuite s'arrête 48 heures avant ;
- **45 avis Google de 1 à 3 étoiles** sur 386 : annulations de dernière minute, litiges sur les frais et dégâts reviennent dans les plus récents ;
- **5 contradictions** sur le site, sur des questions que les clients posent avant de réserver ([détail](data/contradictions.yaml)).

Une IA branchée telle quelle sur ce site répondrait faux avec assurance. Le projet commence donc par une fiche de faits vérifiés, et ajoute l'IA ensuite.

## Résultats

60 messages inventés, chacun avec la réponse attendue : 40 de base, et 20 de contrôle écrits après coup, qui n'ont jamais servi à régler le système.

| | Mistral 7B, en local | Règles sans IA |
| --- | --- | --- |
| Jeu de contrôle : cas réussis | **15/20** | 5/20 |
| Cas sensibles sortis « prêts à envoyer » (argent, dégât, absence…) | **0/32** | 8/32 |
| Réponses dont chaque chiffre a une source | 60/60 | 59/59 |
| Jeu de base : cas réussis | 27/40 | 36/40 (règles écrites avec ces messages) |
| Coût | 0 CHF | 0 CHF |

L'échec le plus sérieux qui reste : « Votre site plante au moment de mettre le code postal » a été classé sans réponse, comme du démarchage. Le détail des 60 cas est dans [`eval/RAPPORT.md`](eval/RAPPORT.md), et l'histoire des corrections (trois passages du modèle, une relecture indépendante) dans [`eval/JOURNAL.md`](eval/JOURNAL.md).

## Comment ça marche

1. **Lecture sans IA** : durée, fréquence, ville et canton, créneau, langue, tentative d'injection. Le budget est calculé avec la formule publiée par MénageSimple.
2. **Brouillon par le modèle** (Mistral 7B en local) : intention, résumé pour l'équipe, faits utilisés, réponse, dans un format JSON imposé.
3. **Contrôles sans IA** : chaque chiffre doit avoir une source, aucune promesse interdite, au moins un fait cité, budget juste, langue du client.
4. **Statut** : prêt, à revoir, à transmettre ou à classer. Argent, dégât, absence, données personnelles et menace juridique passent toujours à un humain, même si le modèle se trompe d'intention.
5. **Relecture** par l'équipe, puis envoi.

Les choix techniques et ce qui a été écarté sont expliqués dans [`docs/decisions.md`](docs/decisions.md).

## Lancer le projet

Node 20 ou plus récent.

```bash
npm install
npm test            # tests et banc d'essai rejoué : sans réseau, sans modèle, sans clé
npm run dev         # interface sur http://localhost:3000
```

Avec un modèle :

```bash
ollama pull mistral                # modèle local et gratuit (https://ollama.com)
npm run eval -- --live ollama      # repasse les 60 messages et enregistre les réponses
cp .env.example .env.local         # facultatif : GEMINI_API_KEY pour l'offre gratuite de Gemini
npm run eval -- --live gemini
```

`npm run check-site` relit le site public et vérifie que chaque citation de la fiche de faits y figure encore (GitHub Actions le lance chaque lundi).

## Organisation

| Dossier | Contenu |
| --- | --- |
| [`data/`](data) | Fiche de faits et contradictions du site |
| [`lib/`](lib) | Moteur : lecture du message, consigne, modèles, contrôles, statut |
| [`eval/`](eval) | Les 60 messages de test, le lanceur et le rapport |
| [`recordings/`](recordings) | Réponses enregistrées du modèle, pour rejouer sans lui |
| [`app/`](app) | Interface de démonstration et API |
| [`docs/`](docs) | Analyse du problème, choix techniques, mise en service |

## Mise en service proposée

1. Trancher les cinq contradictions et corriger le site.
2. Deux semaines en observation dans l'outil de support : le copilote propose, l'équipe envoie, on mesure la part de brouillons envoyés sans retouche.
3. Automatiser seulement les questions d'information qui passent ce cap ; les incidents restent humains.
4. Faire passer l'assistant téléphonique en test sur le même banc d'essai.

## Licence

Code sous licence [PolyForm Noncommercial 1.0.0](LICENSE) : libre pour l'évaluation et tout usage non commercial ; un usage commercial demande l'accord de l'auteur.
Les citations du site de MénageSimple restent la propriété de MénageSimple SA ; elles sont reprises comme courtes citations, pour vérification.
