# Copilote du service client MénageSimple

Prototype réalisé pour le deuxième tour du poste « Digital Projects & AI Assistant » chez Stonks Holding AG.
Projet indépendant, non affilié à MénageSimple SA. Il n'utilise que des données publiques ou synthétiques.

Avant de brancher une IA sur des clients, il faut des faits fiables. Ce dépôt commence donc par une fiche de faits
tirée du site public de MénageSimple, chaque fait avec sa source et sa phrase exacte, et par la liste des points
sur lesquels le site se contredit.

- [`data/facts.yaml`](data/facts.yaml) : les faits que le copilote a le droit de citer
- [`data/contradictions.yaml`](data/contradictions.yaml) : les cinq contradictions relevées
- [`docs/analyse.md`](docs/analyse.md) : pourquoi ce problème

```bash
npm install
npm test            # tests, sans réseau ni clé
npm run check-site  # relit le site public et vérifie que chaque citation y figure encore
```

Les citations du site restent la propriété de MénageSimple SA ; elles sont reprises comme citations courtes, pour vérification.
Code sous licence [PolyForm Noncommercial 1.0.0](LICENSE).
