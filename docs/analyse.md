# Pourquoi ce problème

Tout ce qui suit vient de sources publiques lues le 5 novembre 2026 : le site de MénageSimple, ses conditions générales et sa fiche Google. Aucun nom de client n'est repris.

## Le support coûte cher, et il ferme le week-end

La page d'accueil détaille où vont les CHF 43.90 d'une heure de ménage. Pour tout faire tourner (« Recrutement, accompagnement, service client, remplacement, encaissement et sinistres »), il reste CHF 4.00. La marge est de CHF 0.80.

Prenons le client type décrit dans l'article du 26 octobre 2026 : un passage toutes les deux semaines (55 % des clients installés), de 2 h 30 (la durée médiane). Cela fait 65 heures par an, soit :

| | Par an |
| --- | --- |
| Chiffre d'affaires | CHF 2 853.50 |
| Tout le fonctionnement, support compris | CHF 260.00 |
| Marge de MénageSimple | CHF 52.00 |

Une réclamation qui demande une heure d'échanges de mails consomme une bonne part de ces CHF 260.

Le service client répond « du Lundi au Vendredi de 8H00 à 19H00 ». Un message envoyé le vendredi soir attend environ 61 heures, alors que l'annulation gratuite s'arrête 48 heures avant le ménage.

## Le formulaire de contact montre où ça bloque

La page contact propose six motifs. Trois sont des échecs :

- J'ai une question avant de réserver
- J'ai besoin d'aide pour une réservation existante
- **Je ne parviens pas à réserver**
- **Pas de disponibilité dans ma ville**
- **Pas de disponibilité à l'horaire souhaité**
- Autre demande

Le copilote reprend ces six motifs tels quels, pour s'insérer dans la façon dont l'équipe trie déjà ses messages.

## Ce que disent les avis

Fiche Google de MénageSimple à Lausanne : 4,4 étoiles, 386 avis, dont 45 de 1 à 3 étoiles. Parmi les 14 récents qui ont un texte (d'une semaine à environ un an) :

| Thème | Avis |
| --- | --- |
| Qualité variable selon l'intervenante | 7 |
| Annulation de dernière minute ou intervenante absente sans prévenir | 4 |
| Litige d'argent : 90 % facturés, remboursement refusé, heure « offerte » facturée | 3 |
| Dégâts : meuble, aspirateur | 3 |
| Matériel : « aspirateur facturé » | 1 |
| Bug de réservation : « Mode de paiement invalide » | 1 |

Un même avis peut toucher plusieurs thèmes.

La qualité et les absences relèvent du recrutement et du planning. Un prototype ne les règle pas. Ce qui transforme un mauvais passage en avis à une étoile, c'est souvent la suite : un litige mal tenu, une promesse faite puis reniée, des « mails interminables », une réponse qui contredit le site. Cette partie-là se joue dans les messages.

## Le site se contredit

Cinq points, vérifiés phrase par phrase (détail dans [`data/contradictions.yaml`](../data/contradictions.yaml)) :

| | Sujet | En bref |
| --- | --- | --- |
| C1 | Matériel | Trois pages, trois réponses sur qui apporte l'aspirateur, la serpillière et les produits |
| C2 | Budget mensuel | Les montants du guide (CHF 175, 440, 615) sont calculés sans la TVA : 8 % de moins que la réalité |
| C3 | Durée conseillée | Pour un 3 à 4 pièces : 3 à 4 heures, ou 2 h 30, selon la page |
| C4 | Paiement | Carte débitée après le ménage selon la FAQ, compte crédité à l'avance selon les CGU |
| C5 | CGU | Les frais d'annulation renvoient au point 10d, qui parle des photographies |

C1 et C3 touchent les deux questions que l'article décrit comme les plus posées avant une première réservation. C5 touche les frais d'annulation, présents dans les avis négatifs.

Un assistant IA branché tel quel sur ce site donnerait des réponses fausses avec assurance. D'où l'ordre suivi par le projet : d'abord une fiche de faits vérifiés, ensuite l'IA.

## Ils y pensent déjà

L'annonce du poste cite parmi les exemples de travail le test d'un « AI telephone assistant ». La fiche de faits, les règles et le banc d'essai de ce projet servent aussi à évaluer un assistant téléphonique.

## Sources

- https://menagesimple.com/ (détail des CHF 43.90, horaires du support)
- https://menagesimple.com/faire-le-menage-quelle-frequence-heures-chiffres/ (article du 26 octobre 2026)
- https://menagesimple.com/questions-frequentes-menage/
- https://menagesimple.com/menage-domicile-suisse-guide/
- https://menagesimple.com/conditions-generales/ (version du 15.07.2026)
- https://menagesimple.com/contact-satisfaction-client/
- Fiche Google Maps « MénageSimple », Lausanne, avis triés du moins favorable, lus le 5 novembre 2026
- Annonce du poste : https://community.n8n.io/t/324430
