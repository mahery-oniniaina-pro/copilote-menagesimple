# Banc d'essai

Généré par `npm run eval`. Réponses des modèles enregistrées le 5 novembre 2026. Tous les messages sont inventés.

- **Jeu de base** ([`cases.yaml`](cases.yaml)) : 40 messages écrits à partir des six motifs du formulaire de contact et des thèmes des avis publics. Les règles sans IA ont été écrites en même temps : leur score y est optimiste.
- **Jeu de contrôle** ([`controle.yaml`](controle.yaml)) : 20 messages écrits ensuite, dans un style plus libre, jamais utilisés pour régler les règles ni la consigne du modèle.

## Résultats

### Jeu de base (40 messages)

| | Mistral 7B via Ollama, en local | Règles et modèles de réponse, sans IA |
| --- | --- | --- |
| Cas réussis (tous les critères) | 27/40 | 36/40 |
| Intention juste | 34/40 | 38/40 |
| Bon statut | 36/40 | 36/40 |
| Cas sensibles transmis à l'équipe | 21/21 | 21/21 |
| Réponses dont tous les chiffres sont sourcés | 40/40 | 39/39 |
| Réponses sans promesse interdite | 38/40 | 39/39 |
| Questions simples prêtes du premier coup | 11/15 | 12/15 |
| Temps médian par message | 12,4 s | 0,0 s |
| Replis sur les règles | 0 | 0 |

### Jeu de contrôle (20 messages)

| | Mistral 7B via Ollama, en local | Règles et modèles de réponse, sans IA |
| --- | --- | --- |
| Cas réussis (tous les critères) | 15/20 | 5/20 |
| Intention juste | 17/20 | 6/20 |
| Bon statut | 15/20 | 9/20 |
| Cas sensibles transmis à l'équipe | 8/11 | 3/11 |
| Réponses dont tous les chiffres sont sourcés | 20/20 | 20/20 |
| Réponses sans promesse interdite | 20/20 | 20/20 |
| Questions simples prêtes du premier coup | 6/7 | 5/7 |
| Temps médian par message | 10,6 s | 0,0 s |
| Replis sur les règles | 0 | 0 |

Un cas est réussi si l'intention, le statut, les chiffres, l'absence de promesse, les textes attendus et les faits cités sont tous justes.
Les questions simples sont celles dont la seule réponse attendue est « prêt ». Un cas sensible est un cas qui doit finir « à transmettre » : argent, dégât, absence, données personnelles, menace, modification, disponibilité ou point non tranché.

## Cas ratés

### Mistral 7B via Ollama, en local

- **A3** (Avant de réserver) : ne cite pas duree_minimale.
- **B1** (Réservation existante) : statut « À revoir » au lieu de « Prêt à envoyer après relecture » ; contrôle « Aucune promesse » : gratuité (« sans frais »).
- **B2** (Réservation existante) : statut « À transmettre à l'équipe » au lieu de « Prêt à envoyer après relecture » ; il manque « 90 ».
- **B7** (Réservation existante) : intention « Autres prestations » au lieu de « Modifier une réservation » ou « Fonctionnement du service ».
- **C2** (Incident) : intention « Contestation de frais » au lieu de « Intervenante absente ou ménage annulé par MénageSimple » ou « Ménage pas satisfaisant ».
- **C10** (Incident) : intention « Intervenante absente ou ménage annulé par MénageSimple » au lieu de « Ménage pas satisfaisant ».
- **D3** (Pas de disponibilité) : intention « Zones desservies » au lieu de « Pas de disponibilité ».
- **D6** (Pas de disponibilité) : intention « Zones desservies » au lieu de « Pas de disponibilité ».
- **E1** (Autre demande) : statut « À transmettre à l'équipe » au lieu de « Prêt à envoyer après relecture ».
- **E4** (Piège) : contrôle « Aucune promesse » : réduction (« réduction »).
- **E5** (Piège) : statut « À revoir » au lieu de « Prêt à envoyer après relecture » ; contrôle « Langue du client » : Message en de, réponse en fr.
- **E7** (Autre demande) : intention « Matériel et produits » au lieu de « Autres prestations ».
- **E8** (Autre demande) : ne cite pas laa_allianz.
- **H3** (Avant de réserver) : statut « À transmettre à l'équipe » au lieu de « Prêt à envoyer après relecture ».
- **H9** (Réservation existante) : statut « À revoir » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe** ; contrôle « Au moins un fait cité » : La réponse ne s'appuie sur aucun fait vérifié ; contrôle « Règle d'annulation complète » : La réponse doit rappeler les 48 heures et les 90 %.
- **H11** (Réservation impossible) : intention « Hors sujet » au lieu de « Réservation impossible » ; statut « À classer, sans réponse » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H17** (Autre demande) : intention « Autres prestations » au lieu de « Fonctionnement du service » ; statut « À revoir » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe** ; contrôle « Au moins un fait cité » : La réponse ne s'appuie sur aucun fait vérifié.
- **H20** (Piège) : intention « Matériel et produits » au lieu de « Hors sujet » ; statut « À transmettre à l'équipe » au lieu de « À classer, sans réponse ».

### Règles et modèles de réponse, sans IA

- **A2** (Avant de réserver) : statut « À revoir » au lieu de « Prêt à envoyer après relecture » ; contrôle « Langue du client » : Message en en, réponse en fr.
- **E4** (Piège) : intention « Fonctionnement du service » au lieu de « Hors sujet » ou « Contestation de frais » ou « Prix et budget » ; statut « Prêt à envoyer après relecture » au lieu de « À classer, sans réponse » ou « À transmettre à l'équipe » ou « À revoir ».
- **E5** (Piège) : statut « À revoir » au lieu de « Prêt à envoyer après relecture » ; contrôle « Langue du client » : Message en de, réponse en fr ; il manque « 43.90 ».
- **E7** (Autre demande) : intention « Matériel et produits » au lieu de « Autres prestations » ; statut « À transmettre à l'équipe » au lieu de « Prêt à envoyer après relecture ».
- **H4** (Incident) : intention « Fonctionnement du service » au lieu de « Intervenante absente ou ménage annulé par MénageSimple » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H5** (Incident) : intention « Fonctionnement du service » au lieu de « Dégât ou casse » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H6** (Incident) : intention « Fonctionnement du service » au lieu de « Ménage pas satisfaisant » ou « Contestation de frais » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H7** (Avant de réserver) : intention « Fonctionnement du service » au lieu de « Zones desservies » ; ne cite pas zones.
- **H8** (Avant de réserver) : intention « Paiement et facturation » au lieu de « Employeur, AVS et assurances » ; statut « À transmettre à l'équipe » au lieu de « Prêt à envoyer après relecture ».
- **H9** (Réservation existante) : intention « Fonctionnement du service » au lieu de « Modifier une réservation » ou « Annuler ou sauter un ménage » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H10** (Réservation existante) : intention « Fonctionnement du service » au lieu de « Modifier une réservation » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H12** (Pas de disponibilité) : intention « Fonctionnement du service » au lieu de « Pas de disponibilité » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H13** (Avant de réserver) : intention « Fonctionnement du service » au lieu de « Autres prestations » ; statut « À revoir » au lieu de « Prêt à envoyer après relecture » ; contrôle « Langue du client » : Message en en, réponse en fr.
- **H14** (Autre demande) : intention « Fonctionnement du service » au lieu de « Candidature d'intervenante ».
- **H15** (Incident) : intention « Fonctionnement du service » au lieu de « Contestation de frais » ou « Paiement et facturation ».
- **H16** (Autre demande) : intention « Fonctionnement du service » au lieu de « Données personnelles » ; statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H17** (Autre demande) : statut « Prêt à envoyer après relecture » au lieu de « À transmettre à l'équipe » ; **cas sensible non transmis à l'équipe**.
- **H18** (Avant de réserver) : intention « Prix et budget » au lieu de « Durée d'un passage » ; ne cite pas duree_petit_logement.
- **H20** (Piège) : intention « Matériel et produits » au lieu de « Hors sujet » ; statut « À transmettre à l'équipe » au lieu de « À classer, sans réponse ».

## Relancer

```bash
npm run eval                   # rejoue les réponses enregistrées et les règles : gratuit, sans réseau
npm run eval -- --live ollama  # interroge Mistral en local et enregistre ses réponses
npm run eval -- --live gemini  # idem avec l'API Gemini (GEMINI_API_KEY)
```
