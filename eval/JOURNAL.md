# Journal du banc d'essai

Ce qui a été testé, ce qui a échoué, et ce qui a été changé. Les chiffres à jour sont dans [`RAPPORT.md`](RAPPORT.md).

## 1. Les règles sans IA

Les règles (mots-clés et modèles de réponse) ont été écrites en même temps que les 40 messages du jeu de base. Elles y réussissent 35 cas sur 40 : un score flatteur, puisqu'elles connaissent les formulations.

Pour mesurer honnêtement, un **jeu de contrôle** de 20 messages a été écrit ensuite, dans un style plus libre (abréviations, tournures indirectes, anglais). Les règles n'y réussissent que 5 cas sur 20, et laissent passer comme « prêts » 9 des 12 cas qui devaient revenir à un humain. C'est la raison d'être du modèle : comprendre une formulation qu'on n'a pas prévue.

## 2. Premier passage de Mistral 7B

Arrêté après 27 messages du jeu de base : 16 réussis, et aucun cas sensible marqué « prêt ». Les échecs :

| Cas | Ce qui s'est passé | Ce qui a été changé |
| --- | --- | --- |
| A4, B4 | Sur un point où le site se contredit, le modèle donnait quand même une réponse (« 3 à 4 heures », « 5 jours ») | La consigne lui demande de dire seulement qu'il transmet la question |
| C8 | Le brouillon disait au client que le site donne trois réponses différentes | La consigne l'interdit |
| B2 | L'annulation rappelait les 48 heures mais pas les 90 % | Le code ajoute un rappel dans le contexte quand le message parle d'annulation, et un contrôle renvoie à la relecture toute réponse d'annulation incomplète |
| C3 | Pas de demande de photos après un dégât | Quand le code détecte un dégât, il le dit au modèle avec la marche à suivre |
| C6 | « Discuter du remboursement » dans un brouillon de litige : promesse bloquée par les contrôles | Consigne : en cas de contestation, l'équipe examine la facture, sans parler de remboursement |
| D1 | Numéro de téléphone exact, mais fait non cité | Un chiffre écrit tel quel dans un fait vérifié est accepté, et le contrôle ajoute lui-même la source |
| C4 | « Taches sur le parquet » classé en ménage mal fait plutôt qu'en dégât | Les taches font partie des dégâts détectés par les règles |

Ces corrections ont été faites à partir du **jeu de base seulement**. Les messages du jeu de contrôle n'ont servi à régler ni la consigne, ni les règles.

## 3. Deuxième passage, complet

| | Jeu de base | Jeu de contrôle |
| --- | --- | --- |
| Cas réussis | 28/40 | 12/20 |
| Cas sensibles jamais marqués « prêt » | **20/23** | 12/12 |

Sur le jeu de contrôle, le modèle fait nettement mieux que les règles (12 contre 5). Mais sur le jeu de base, trois cas qui devaient revenir à l'équipe sont sortis « prêts » :

| Cas | Ce qui s'est passé | Ce qui a été changé |
| --- | --- | --- |
| D3, D6 | « Pas de disponibilité » classé en question de zones, donc réponse prête | Les règles de détection reconnaissent maintenant l'absence de disponibilité et les erreurs de réservation : ces messages passent toujours à l'équipe |
| A4 | Durée pour un 4,5 pièces : le modèle a répondu avec des faits vérifiés sans voir que la question touchait la contradiction C3 | Le code reconnaît lui-même les sujets non tranchés (matériel, durée pour un 3 à 4,5 pièces, moment du débit), sans compter sur le modèle |
| B4 | Le brouillon donnait encore une réponse sur un point non tranché | Sur un point non tranché, le code remplace le brouillon par une réponse d'attente |
| A2, E5 | Réponse en français à un message en anglais ou en allemand | Le contexte rappelle au modèle la langue du client |
| B2 | « Gratuitement » refusé comme promesse | Le fait sur l'annulation dit aussi « gratuitement », ce qui est exact |

Leçon : pour ce qui touche à la sécurité, le code doit décider seul, et le modèle seulement aider. Ces corrections viennent encore du jeu de base uniquement.

## 4. Relecture indépendante

Avant le passage final, un relecteur sans contexte (un agent IA chargé de chercher les failles et de les prouver en exécutant le code) a relu le moteur. Il a trouvé de vrais trous, tous corrigés et couverts par des tests :

| Faille | Exemple | Correction |
| --- | --- | --- |
| Détection sensible trop fragile | « Personne n’est venu » avec l'apostrophe d'un iPhone, « abimé » sans accent circonflexe, « fermer mon compte » | Les règles comparent un texte sans accents ni apostrophes typographiques, et couvrent plus de tournures (dont l'anglais, l'allemand, un peu l'italien) |
| Source ajoutée sur une simple ressemblance | « CHF 27 de l'heure » accepté grâce à « CHF 27.16 » ; « CHF 1'380 » lu comme « CHF 1 » | Une source n'est ajoutée que si le nombre est exactement une valeur du fait ; les séparateurs de milliers sont lus |
| Chiffres non vus | « 49 frs », « 29.90 de l'heure », « +41 (0)22 518 90 99 », « trois heures » | Lecture élargie des montants, numéros et durées en lettres |
| Promesse autorisée par erreur | « Nous prendrons en charge » accepté grâce à « Nous privilégions » | Un mot de promesse n'est accepté que s'il figure tel quel dans un fait cité par le modèle |
| Montant du client répété | « Votre tarif est bien de CHF 29.90 ? » → « Oui, CHF 29.90 » | Un montant ou un pourcentage doit venir des faits ou du calcul, jamais du message |
| Points non tranchés en français seulement | « Do I need to provide my own vacuum cleaner? », « 3½ pièces » | Sujets reconnus en quatre langues ; « 3½ » et « 3.5-room » lus |
| Rapport pas toujours reproductible | Changer un fait ne périmait pas les réponses enregistrées | Chaque réponse enregistrée est liée à la consigne exacte envoyée au modèle ; le rapport n'est plus écrit s'il manque une réponse |
| Mesure trop indulgente | Un cas sensible classé « à classer » comptait comme réussi | Un cas sensible doit finir « à transmettre » |

## 5. Passage final

| | Mistral 7B, jeu de base | Mistral 7B, jeu de contrôle | Règles sans IA, jeu de contrôle |
| --- | --- | --- | --- |
| Cas réussis | 27/40 | **15/20** | 5/20 |
| Cas sensibles transmis à l'équipe | 21/21 | 8/11 | 3/11 |
| Cas sensibles sortis « prêts à envoyer » | 0 | **0** | 8 |

Sur les 32 cas sensibles des deux jeux, aucun n'est sorti « prêt à envoyer » avec le modèle : 29 sont transmis à l'équipe, 2 renvoyés en relecture (une demande de résiliation, une question sur le pourboire, que le modèle a tenté de traiter sans fait vérifié), et **1 a été classé à tort sans réponse** : « Votre site plante au moment de mettre le code postal » pris pour du démarchage. C'est l'échec le plus sérieux qui reste.

Il n'a pas été corrigé, pour garder au jeu de contrôle sa valeur de mesure. La correction prévue est une règle de principe : ne classer sans réponse qu'un démarchage reconnu par le code, jamais sur le seul avis du modèle.

Autres limites visibles dans le rapport : le modèle oublie parfois de citer le fait qu'il utilise, répond parfois en français à un message en allemand, et transmet parfois une question simple par prudence. Ce sont des erreurs coûteuses en temps, pas dangereuses : la réponse ne part pas sans relecture.
