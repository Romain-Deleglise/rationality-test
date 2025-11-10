# Test de Rationalité

Application web pour évaluer la rationalité cognitive basée sur le CART (Comprehensive Assessment of Rational Thinking) de Stanovich et al. (2016).

🌐 **Site en ligne** : https://rationality-test.com

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Installation et développement](#installation-et-développement)
4. [Structure du projet](#structure-du-projet)
5. [Fonctionnalités](#fonctionnalités)
6. [Roadmap](#roadmap)
7. [Déploiement](#déploiement)

---

## 🎯 Vue d'ensemble

### Objectif

Créer un test de rationalité scientifiquement validé, accessible gratuitement en ligne, pour :
- **Auto-évaluation** : Identifier ses biais cognitifs
- **Recrutement** : Identifier des personnes capables de comprendre les arguments d'AI risk
- **Recherche** : Collecter des données anonymes pour validation scientifique

### Version Actuelle

**Version courte** : ~55 points, 50 minutes
- 11 modules (sur 16 de la version complète)
- Questions de type : multiple-choice, numérique, intervalles de confiance, Likert

---

## 🏗️ Architecture Technique

### Stack

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **State Management** : Zustand (avec persistance localStorage)
- **Graphiques** : Recharts (à venir)
- **Déploiement** : Vercel
- **Base de données** : Vercel Postgres (à venir)

### Pourquoi Next.js ?

- **SSR/SSG** : Bon pour le SEO
- **App Router** : Routing moderne basé sur les fichiers
- **Vercel** : Déploiement automatique depuis GitHub
- **TypeScript** : Type safety pour éviter les bugs

---

## 🚀 Installation et Développement

### Prérequis

- Node.js 18+
- npm ou yarn
- Git

### Installation
```bash
# 1. Cloner le repo
git clone https://github.com/Romain-Deleglise/rationality-test.git
cd rationality-test

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de dev
npm run dev
```

Le site est accessible sur : http://localhost:3000

### Commandes Utiles
```bash
# Développement
npm run dev          # Lance le serveur de dev

# Production
npm run build        # Build pour production
npm run start        # Lance le serveur de prod

# Qualité du code
npm run lint         # Vérifie le code avec ESLint
```

---

## 📁 Structure du Projet
```
rationality-test/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── layout.tsx         # Layout global
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── test/
│   │   │   └── page.tsx       # Page du test
│   │   └── resultats/
│   │       └── page.tsx       # Page des résultats
│   │
│   ├── components/            # Composants React
│   │   ├── Question.tsx       # Composant générique de question
│   │   └── ui/                # Composants shadcn/ui
│   │
│   ├── data/
│   │   └── test-court.json    # Questions du test (version courte)
│   │
│   ├── store/
│   │   └── useTestStore.ts    # State management (Zustand)
│   │
│   ├── types/
│   │   └── index.ts           # Types TypeScript
│   │
│   └── lib/
│       ├── scoring.ts         # Logique de calcul des scores (à venir)
│       └── utils.ts           # Utilitaires
│
├── public/                    # Assets statiques
├── .env.local                 # Variables d'environnement (pas commité)
├── next.config.ts             # Config Next.js
├── tailwind.config.ts         # Config Tailwind
├── tsconfig.json              # Config TypeScript
└── package.json               # Dépendances
```

---

## ✨ Fonctionnalités

### ✅ Implémenté

- [x] Page d'accueil avec présentation
- [x] Navigation entre questions
- [x] Barre de progression
- [x] Persistance des réponses (localStorage)
- [x] Support de plusieurs types de questions :
  - Multiple choice
  - Input numérique
  - Intervalles de confiance
  - Échelle de Likert
- [x] Page de résultats basique
- [x] Design responsive (mobile/desktop)
- [x] Déploiement automatique sur Vercel

### 🔄 En Cours

- [ ] Système de scoring CART complet
- [ ] Graphiques des résultats (recharts)
- [ ] Page de résultats détaillée avec feedback personnalisé

### 📅 Roadmap (Prochaines Étapes)

#### Phase 1 : Scoring et Résultats (Semaine 1-2)
- [ ] Implémenter l'algorithme de scoring CART pour chaque module
- [ ] Créer les graphiques radar/bar pour la page de résultats
- [ ] Ajouter le calcul des forces/faiblesses
- [ ] Générer des recommandations personnalisées

#### Phase 2 : Base de Données (Semaine 3)
- [ ] Setup Vercel Postgres
- [ ] Sauvegarder les résultats anonymes
- [ ] Calculer les statistiques globales (moyenne, percentiles)
- [ ] Afficher "Vous êtes au Xème percentile"

#### Phase 3 : Contenu Complet (Semaine 4-5)
- [ ] Ajouter les 5 modules manquants (version complète = 16 modules)
- [ ] Créer des variantes de questions (anti-mémorisation)
- [ ] Ajouter les explications détaillées pour chaque question
- [ ] Mode "practice" avec feedback immédiat

#### Phase 4 : Features Avancées (Semaine 6+)
- [ ] Comptes utilisateurs (optionnel)
- [ ] Historique des tests passés
- [ ] Export PDF des résultats
- [ ] Version anglaise (i18n)
- [ ] Analytics (Plausible ou Google Analytics)
- [ ] Page "À propos" avec méthodologie scientifique
- [ ] Page "FAQ"

#### Phase 5 : Validation Scientifique (Long terme)
- [ ] Beta test avec 200+ participants
- [ ] Analyse statistique (corrélations, fiabilité)
- [ ] Publication scientifique
- [ ] API publique pour chercheurs

---

## 🚢 Déploiement

### Vercel (Automatique)

Le site est déployé automatiquement sur Vercel à chaque push sur `main`.

**URL de production** : https://rationality-test.com

### Workflow Git
```bash
# 1. Créer une branche pour une feature
git checkout -b feature/nom-feature

# 2. Faire des modifications
git add .
git commit -m "Description des changements"

# 3. Pusher la branche
git push origin feature/nom-feature

# 4. Créer une Pull Request sur GitHub
# 5. Merger dans main après review
# 6. Vercel déploie automatiquement
```

### Variables d'Environnement

À configurer sur Vercel Dashboard :
```bash
# Base de données (quand implémenté)
POSTGRES_URL=...
POSTGRES_PRISMA_URL=...

# Analytics (optionnel)
NEXT_PUBLIC_GA_ID=...
```

---

## 🧪 Tests

### Tests Manuels Actuels

Avant chaque déploiement, vérifier :

- [ ] Page d'accueil charge correctement
- [ ] Bouton "Commencer le test" fonctionne
- [ ] Questions s'affichent correctement
- [ ] Navigation suivant/précédent fonctionne
- [ ] Barre de progression est correcte
- [ ] Les réponses sont sauvegardées (refresh → reprend où on était)
- [ ] Page de résultats s'affiche après la dernière question
- [ ] Responsive mobile fonctionne

### Tests Automatisés (À venir)
```bash
# Unit tests
npm run test

# E2E tests avec Playwright
npm run test:e2e
```

---

## 🤝 Contribution

### Guidelines

1. **Branching** : Créer une branche par feature
2. **Commits** : Messages descriptifs en français
3. **Code Style** : Suivre les règles ESLint
4. **TypeScript** : Toujours typer correctement
5. **Testing** : Tester manuellement avant de pusher

### Ajout de Questions

Pour ajouter des questions au test, modifier `/src/data/test-court.json` :
```json
{
  "id": "nouvelle-question",
  "type": "multiple-choice",
  "text": "Question ?",
  "options": ["A", "B", "C"],
  "correct": 1,
  "points": 1,
  "explanation": "Explication..."
}
```

---

## 📖 Ressources

### Documentation Technique

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Ressources Scientifiques

- **CART** : Stanovich, K. E., West, R. F., & Toplak, M. E. (2016). *The Rationality Quotient*. MIT Press.
- **Base rates** : Kahneman & Tversky (1973)
- **CRT** : Frederick, S. (2005). *Cognitive Reflection Test*

---

## 📝 Licence

Ce projet est open-source sous licence MIT.

---

## 👤 Auteur

**Romain Delègise** - Pause IA  
Contact : [GitHub](https://github.com/Romain-Deleglise)

---

## 🙏 Remerciements

- Stanovich et al. pour le CART
- Communauté LessWrong pour les ressources sur la rationalité
- shadcn pour les composants UI