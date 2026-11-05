# Choix techniques

## L'IA comprend et rédige, le code vérifie

Un modèle de langage est bon pour comprendre un message écrit n'importe comment et pour rédiger une réponse polie. Il est mauvais pour garantir un chiffre ou respecter une règle à chaque fois. Le projet sépare donc les deux :

| Tâche | Qui la fait |
| --- | --- |
| Comprendre la demande, résumer, rédiger | Le modèle |
| Lire la durée, la fréquence, la ville, la langue | Le code |
| Calculer un budget | Le code, avec la formule publiée par MénageSimple |
| Vérifier que chaque chiffre a une source | Le code |
| Refuser une promesse (remboursement, réduction, gratuité) | Le code |
| Décider qu'un humain reprend la main | Le code, à partir de l'intention, des faits cités et de règles de détection |
| Envoyer | Une personne de l'équipe |

## Une fiche de faits plutôt qu'une recherche dans le site

Le site compte une quarantaine de faits utiles pour le service client. Ils tiennent dans la consigne du modèle : pas besoin de base vectorielle ni de recherche sémantique, qui ajouteraient une source d'erreur. Chaque fait garde sa phrase exacte et sa page ; `npm run check-site` vérifie chaque semaine que la phrase est toujours en ligne.

Le fichier est en YAML pour qu'une personne non développeuse puisse le corriger : changer une phrase, ou passer un fait de `contradictory` à `verified` une fois la contradiction tranchée.

## Un modèle local par défaut

Mistral 7B tourne avec Ollama sur un ordinateur portable :

- **coût nul**, ce que demande l'exercice ;
- **aucun message client ne sort de l'entreprise**, ce qui simplifie la protection des données (nLPD) ;
- **rejouable** : les réponses sont enregistrées, donc le banc d'essai se relance sans modèle.

L'API Gemini est branchée en option, avec l'offre gratuite. Changer de modèle ne change ni la fiche de faits, ni les contrôles, ni le banc d'essai : c'est ce qui permet de comparer les modèles sur les mêmes 60 messages.

## Des règles sans IA comme point de comparaison

Le fournisseur `regles` classe le message par mots-clés et répond avec des modèles de texte. Il sert à deux choses :

1. **mesurer ce que l'IA apporte vraiment** : sur le jeu de contrôle, écrit après coup, les règles s'effondrent dès que la formulation change ;
2. **ne jamais tomber en panne** : si le modèle ne répond pas ou répond hors format, le copilote se replie sur les règles et le signale.

## Pas de base de données

Le prototype ne stocke rien : pas de compte, pas d'historique, aucune donnée client. En production, les brouillons et les décisions de l'équipe vivraient dans l'outil de support déjà en place (Freshdesk ou Zendesk, cités dans la politique de confidentialité de MénageSimple), pas dans une base de plus.

## Next.js et TypeScript

Une seule base de code pour l'interface, l'API et les scripts, déployable gratuitement sur Vercel. Le moteur (`lib/`) ne dépend pas de Next.js : il peut tourner dans un script, un workflow n8n (par un appel HTTP) ou une fonction branchée sur l'outil de support.

## Code et données

| Dossier | Contenu |
| --- | --- |
| `data/` | Fiche de faits et contradictions |
| `lib/` | Moteur : lecture du message, consigne, modèles, contrôles, statut |
| `eval/` | Les 60 messages de test, le lanceur et le rapport |
| `recordings/` | Réponses enregistrées du modèle, pour rejouer sans lui |
| `app/` | Interface de démonstration et API |
| `scripts/` | Vérification du site public |
| `tests/` | Tests, lancés à chaque modification par GitHub Actions |
