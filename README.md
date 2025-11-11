# 🧠 Test de Rationalité

Application web bilingue (FR/EN) pour évaluer la rationalité cognitive, basée sur le CART (Comprehensive Assessment of Rational Thinking) de Stanovich, West & Toplak (2016).

🌐 **Site en ligne** : https://rationality-test.com

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Fonctionnalités](#-fonctionnalités)
3. [Architecture technique](#️-architecture-technique)
4. [Installation et développement](#-installation-et-développement)
5. [Structure du projet](#-structure-du-projet)
6. [Améliorations à venir](#-améliorations-à-venir)
7. [Déploiement](#-déploiement)
8. [Ressources scientifiques](#-ressources-scientifiques)

---

## 🎯 Vue d'ensemble

### Objectif

Créer un test de rationalité scientifiquement validé, accessible gratuitement en ligne, pour :
- **Auto-évaluation** : Identifier ses biais cognitifs et mesurer sa rationalité
- **Recrutement** : Évaluer la pensée critique et la résistance aux biais
- **Recherche** : Collecter des données anonymes pour validation scientifique
- **Éducation** : Sensibiliser aux biais cognitifs et à la pensée rationnelle

### Versions Disponibles

#### 🚀 **Version Courte** : ~25 points, 20 minutes
- 6 modules essentiels
- Aperçu rapide des principaux biais cognitifs

#### 🎯 **Version Complète** : ~94 points, 60 minutes
- 12 modules approfondis
- Évaluation exhaustive sur toutes les dimensions de la rationalité
- **RECOMMANDÉ** pour une analyse détaillée

### Modules Évalués (Version Complète)

1. **Raisonnement Probabiliste** (18 items) - Probability matching, erreur du parieur, taux de base
2. **Raisonnement Scientifique** (20 items) - Falsification, corrélation/causation, groupes contrôles
3. **Réflexion vs Intuition** (11 items) - Cognitive Reflection Test (CRT)
4. **Biais de Croyance** (16 items) - Raisonnement syllogistique
5. **Raisonnement Disjonctif** (6 items) - Logique des énoncés "OU"
6. **Ancrage** (8 items) - Résistance à l'ancrage numérique
7. **Calibration des Connaissances** (26 items) - Overconfidence
8. **Numératie Probabiliste** (5 items) - Manipulation des probabilités
9. **Pensée Superstitieuse** (12 items Likert) - Croyances paranormales
10. **Attitudes Anti-Science** (13 items Likert) - Rejet de la science
11. **Croyances Conspirationnistes** (12 items Likert) - Théories du complot
12. **Croyances Dysfonctionnelles** (9 items Likert) - Croyances irrationnelles

---

## ✨ Fonctionnalités

### ✅ Fonctionnalités Principales

#### Interface & UX
- 🌐 **Site bilingue FR/EN** avec sélecteur de langue en temps réel
- 📱 **Responsive design** (mobile, tablette, desktop)
- 🎨 **UI moderne** avec Tailwind CSS et shadcn/ui
- 💾 **Persistance automatique** des réponses (localStorage)
- 📊 **Barre de progression** avec estimation du temps restant
- ♿ **Accessible** et optimisé pour l'impression

#### Types de Questions
- ✅ **Multiple choice** (QCM avec une réponse)
- ✅ **Input numérique** avec validation
- ✅ **Ranking** (classement par ordre de probabilité)
- ✅ **Intervalles de confiance** (90% confidence intervals)
- ✅ **Échelles de Likert** (7 points, accord/désaccord)

#### Résultats & Analyses
- 📈 **Score global** avec interprétation détaillée
- 🎯 **Radar Chart** montrant le profil cognitif (12 dimensions)
- 📊 **Bar Chart** classant les modules par performance
- 💪 **Forces/Faiblesses** identifiées automatiquement
- 📚 **Descriptions scientifiques** pour chaque dimension
- 🔗 **Liens partageables** avec token unique
- 📧 **Envoi par email** avec HTML responsive
- 🖨️ **Impression PDF** avec accordéons automatiquement dépliés

#### Base de Données & Analytics
- 💾 **Supabase** pour la persistance des résultats
- 📊 **Statistiques globales** (moyenne, médiane, meilleur score)
- 📈 **Percentile réel** basé sur tous les tests complétés
- 🔄 **Anonyme par défaut** (RGPD compliant)

#### Internationalisation
- 🇫🇷 **Français** : Version complète
- 🇬🇧 **Anglais** : Version complète (défaut)
- 🌐 **URLs localisées** : `/fr/*` et `/en/*`
- 🔗 **Liens Wikipedia adaptatifs** selon la langue
- 📝 **Toutes les chaînes UI traduites** (messages/fr.json, messages/en.json)
- 📖 **138+ questions traduites** (test-court-en.json, test-complet-en.json)

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Frontend
- **Framework** : Next.js 15 (App Router avec structure `[locale]`)
- **Langage** : TypeScript (strict mode)
- **Styling** : Tailwind CSS v3 + shadcn/ui
- **State Management** : Zustand (avec persistance localStorage)
- **i18n** : next-intl v3 (middleware avec détection automatique)
- **Graphiques** : Recharts (RadarChart, BarChart)
- **Icons** : Lucide React

#### Backend & Infrastructure
- **Base de données** : Supabase (PostgreSQL)
- **Email** : Resend API
- **Déploiement** : Vercel (CI/CD automatique)
- **Analytics** : Supabase Row Level Security (RLS)

### Architecture des Données

#### Schema Supabase (`test_results`)
```sql
CREATE TABLE test_results (
  id uuid PRIMARY KEY,
  created_at timestamptz,
  result_token text UNIQUE,
  test_version text,              -- 'courte' | 'complète'
  total_points numeric,
  total_possible numeric,
  percentage numeric,
  module_scores jsonb,            -- Détail par module
  answers jsonb,                  -- Toutes les réponses
  user_agent text,
  country_code text
);
```

#### Types de Questions
```typescript
type QuestionType =
  | 'multiple-choice'  // Une seule réponse
  | 'ranking'          // Classement d'options
  | 'number'           // Input numérique
  | 'confidence'       // Intervalle 90%
  | 'likert';          // Échelle 1-7

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  explanation: string;
  // Type-specific fields...
}
```

### Scoring Algorithm

1. **Questions objectives** (multiple-choice, number, ranking) :
   - Correct = points complets
   - Incorrect = 0 point

2. **Intervalles de confiance** :
   - Réponse dans intervalle = points complets
   - Hors intervalle = 0 point
   - Bonus si intervalle étroit et correct

3. **Échelles de Likert** (reverse scoring) :
   - Score = (8 - réponse) / 7 * points_max
   - Inversion automatique si `reverse: true`

4. **Percentile** :
   - Basé sur la distribution réelle des résultats dans Supabase
   - Formule : `(nombre résultats < score) / (total résultats) * 100`

---

## 🚀 Installation et Développement

### Prérequis

- Node.js 18+
- npm ou yarn
- Git
- Compte Supabase (pour la base de données)
- Compte Resend (pour l'envoi d'emails)

### Installation

```bash
# 1. Cloner le repo
git clone https://github.com/Romain-Deleglise/rationality-test.git
cd rationality-test

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés
```

### Configuration `.env.local`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre_anon_key"
SUPABASE_SERVICE_ROLE_KEY="votre_service_role_key"

# Resend (email)
RESEND_API_KEY="re_votre_cle"

# URL du site
NEXT_PUBLIC_URL="http://localhost:3000"
```

### Lancer le projet

```bash
# Développement
npm run dev

# Le site est accessible sur http://localhost:3000
# Version française : http://localhost:3000/fr
# Version anglaise : http://localhost:3000/en
```

### Commandes Utiles

```bash
# Développement
npm run dev          # Serveur de dev avec hot-reload

# Production
npm run build        # Build optimisé
npm run start        # Serveur de production

# Qualité du code
npm run lint         # ESLint
npx tsc --noEmit     # Vérification TypeScript
```

---

## 📁 Structure du Projet

```
rationality-test/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (minimal)
│   │   ├── [locale]/                     # Routes localisées
│   │   │   ├── layout.tsx                # Layout avec NextIntlClientProvider
│   │   │   ├── page.tsx                  # Page d'accueil (i18n)
│   │   │   ├── test/
│   │   │   │   ├── page.tsx              # Page du test
│   │   │   │   └── TestContent.tsx       # Logique du test
│   │   │   └── resultats/
│   │   │       ├── page.tsx              # Résultats avec graphiques
│   │   │       └── [token]/page.tsx      # Résultats partagés
│   │   └── api/                          # API routes (non localisées)
│   │       ├── save-results/route.ts     # Sauvegarde Supabase
│   │       └── send-results/route.ts     # Envoi email
│   │
│   ├── components/
│   │   ├── Question.tsx                  # Composant question générique
│   │   ├── ResultsCharts.tsx             # RadarChart + BarChart
│   │   ├── LanguageSwitcher.tsx          # Sélecteur FR/EN
│   │   └── ui/                           # shadcn/ui components
│   │
│   ├── data/
│   │   ├── test-court.json               # Version courte FR (25 points)
│   │   ├── test-court-en.json            # Version courte EN
│   │   ├── test-complet.json             # Version complète FR (94 points)
│   │   └── test-complet-en.json          # Version complète EN
│   │
│   ├── store/
│   │   └── useTestStore.ts               # Zustand store (session, answers)
│   │
│   ├── lib/
│   │   ├── scoring.ts                    # Algorithme de scoring CART
│   │   ├── supabase.ts                   # Client + helpers Supabase
│   │   └── utils.ts                      # Utilitaires
│   │
│   ├── types/
│   │   └── index.ts                      # Types TypeScript globaux
│   │
│   ├── i18n.ts                           # Config next-intl
│   └── middleware.ts                     # Middleware i18n (locale routing)
│
├── messages/
│   ├── fr.json                           # Traductions françaises
│   └── en.json                           # Traductions anglaises
│
├── public/                               # Assets statiques
├── .env.local                            # Variables d'environnement (gitignored)
├── next.config.ts                        # Config Next.js + next-intl
├── tailwind.config.ts                    # Config Tailwind
├── tsconfig.json                         # Config TypeScript
└── package.json                          # Dépendances
```

---

## 🔮 Améliorations à Venir

### 🚨 **Obligatoires** (À faire en priorité)

#### 1. **Intégration complète des traductions dans les autres pages** ⚡ URGENT
- [ ] **Page `/test`** : Intégrer `useTranslations('test')` pour les questions
  - Charger `test-court-en.json` ou `test-complet-en.json` selon la locale
  - Traduire les boutons "Suivant", "Précédent", "Terminer"
  - Adapter les unités (€ → $, centimes → cents, etc.)
- [ ] **Page `/resultats`** : Intégrer `useTranslations('results')`
  - Traduire tous les textes des résultats
  - Adapter les descriptions de modules
  - Traduire les interprétations (excellent, bon, moyen, etc.)
- [ ] **Page `/resultats/[token]`** : Même chose pour les résultats partagés

#### 2. **Email multilingue** 🌐
- [ ] Détecter la locale du test et envoyer l'email dans la bonne langue
- [ ] Créer template HTML pour EN (actuellement seulement FR)
- [ ] Adapter les références et liens selon la langue

#### 3. **Tests de validation** 🧪
- [ ] Tester le changement de langue dans toutes les pages
- [ ] Vérifier que les liens partagés fonctionnent avec locale
- [ ] Tester l'impression PDF en FR et EN
- [ ] Vérifier l'envoi d'email en FR et EN

#### 4. **SEO multilingue** 🔍
- [ ] Ajouter balises `hreflang` pour FR/EN
- [ ] Créer `sitemap.xml` avec les deux versions
- [ ] Optimiser `metadata` dans les layouts pour chaque langue
- [ ] Ajouter `robots.txt`

#### 5. **Corrections mineures UI** 🎨
- [ ] Vérifier que tous les accordéons se déplient en impression
- [ ] Tester le bouton "Refaire le test" dans toutes les langues
- [ ] S'assurer que les graphiques s'affichent correctement sur mobile

### 💎 **Facultatives** (Nice to have)

#### UX & Accessibilité
- [ ] **Mode sombre** (dark mode)
- [ ] **Préférences utilisateur** (taille de police, contraste)
- [ ] **Clavier shortcuts** (flèches pour naviguer)
- [ ] **ARIA labels** complets pour accessibilité
- [ ] **Animations** plus fluides (Framer Motion)
- [ ] **Feedback visuel** lors des réponses correctes/incorrectes (mode practice)

#### Fonctionnalités Avancées
- [ ] **Comptes utilisateurs** (optionnel, via Supabase Auth)
  - Historique des tests passés
  - Comparaison dans le temps
  - Objectifs personnels
- [ ] **Mode "Practice"** avec feedback immédiat
  - Voir si la réponse est correcte/incorrecte
  - Lire l'explication avant de passer à la suivante
- [ ] **Export PDF professionnel** (librairie dédiée)
  - Meilleure mise en forme
  - Graphiques vectoriels
  - Logo et branding
- [ ] **Partage social** (Twitter, LinkedIn)
  - Génération d'image OG avec score
  - Boutons de partage
- [ ] **Variantes de questions** (anti-mémorisation)
  - Pool de questions aléatoires par module
  - Valeurs numériques randomisées
- [ ] **Système de badges** (gamification)
  - "Maître du raisonnement probabiliste"
  - "Champion de la falsification"
  - etc.

#### Analytics & Recherche
- [ ] **Dashboard admin** (Supabase ou custom)
  - Stats détaillées (N, moyenne, écart-type par module)
  - Corrélations entre modules
  - Analyse des questions les plus difficiles
- [ ] **API publique** pour chercheurs
  - Accès aux données anonymisées
  - Documentation OpenAPI
  - Rate limiting
- [ ] **Comparaison démographique** (optionnel)
  - Âge, éducation, profession
  - Graphs comparatifs
  - Respect strict du RGPD

#### Contenu Additionnel
- [ ] **Page "Méthodologie"**
  - Explication scientifique du CART
  - Validation du test
  - Limites et critiques
- [ ] **Page "FAQ"**
  - Questions fréquentes
  - Conseils pour améliorer sa rationalité
- [ ] **Blog/Articles**
  - Ressources sur les biais cognitifs
  - Études de cas
  - Recommandations de lectures
- [ ] **Ressources pédagogiques**
  - Exercices pour améliorer chaque dimension
  - Liens vers courses (MOOC, livres)
  - Communautés (LessWrong, etc.)

#### Langues Additionnelles
- [ ] **Espagnol** (ES)
- [ ] **Allemand** (DE)
- [ ] **Italien** (IT)
- [ ] **Portugais** (PT)
- [ ] **Chinois** (ZH) - Grand marché potentiel
- [ ] **Japonais** (JA)

#### Infrastructure
- [ ] **Tests automatisés**
  - Unit tests (Vitest)
  - E2E tests (Playwright)
  - CI/CD avec GitHub Actions
- [ ] **Monitoring**
  - Sentry pour error tracking
  - Plausible/Umami pour analytics privacy-friendly
  - Uptime monitoring (UptimeRobot)
- [ ] **Performance**
  - Image optimization (WebP, AVIF)
  - Code splitting avancé
  - Service Worker (PWA)
  - CDN pour assets

#### Validation Scientifique
- [ ] **Beta test avec 500+ participants**
- [ ] **Analyse psychométrique**
  - Cronbach's alpha (fiabilité interne)
  - Test-retest reliability
  - Corrélations avec d'autres tests (CRT, IQ)
- [ ] **Publication scientifique**
  - Préparer manuscrit
  - Soumettre à journal (JDMJ, Thinking & Reasoning)
- [ ] **Partenariats académiques**
  - Universités (recherche collaborative)
  - Labos de psychologie cognitive

---

## 🚢 Déploiement

### Vercel (Automatique)

Le site est déployé automatiquement sur Vercel à chaque push sur la branche principale.

**URL de production** : https://rationality-test.com
**Preview URLs** : Chaque PR génère une preview URL

### Workflow Git

```bash
# 1. Créer une branche pour une feature
git checkout -b feature/nom-feature

# 2. Faire des modifications
git add .
git commit -m "feat: Description des changements"

# 3. Pusher la branche
git push origin feature/nom-feature

# 4. Créer une Pull Request sur GitHub

# 5. Merger dans main après review

# 6. Vercel déploie automatiquement
```

### Variables d'Environnement (Vercel Dashboard)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Resend
RESEND_API_KEY=re_xxx

# Site URL
NEXT_PUBLIC_URL=https://rationality-test.com
```

---

## 📖 Ressources Scientifiques

### Références Clés

**CART (Comprehensive Assessment of Rational Thinking)**
- Stanovich, K. E., West, R. F., & Toplak, M. E. (2016). *The Rationality Quotient: Toward a Test of Rational Thinking*. MIT Press.
- Stanovich, K. E. (2009). *What Intelligence Tests Miss: The Psychology of Rational Thought*. Yale University Press.

**Biais Cognitifs & Heuristiques**
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Kahneman, D., & Tversky, A. (1973). On the psychology of prediction. *Psychological Review*, 80(4), 237-251.
- Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. *Science*, 185(4157), 1124-1131.

**Cognitive Reflection Test (CRT)**
- Frederick, S. (2005). Cognitive Reflection and Decision Making. *Journal of Economic Perspectives*, 19(4), 25-42.

**Biais de Croyance (Belief Bias)**
- Evans, J. St. B. T., Barston, J. L., & Pollard, P. (1983). On the conflict between logic and belief in syllogistic reasoning. *Memory & Cognition*, 11(3), 295-306.

**Falsification & Wason Selection Task**
- Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson.
- Wason, P. C. (1968). Reasoning about a rule. *Quarterly Journal of Experimental Psychology*, 20(3), 273-281.

### Documentation Technique

- [Next.js Documentation](https://nextjs.org/docs)
- [Next-intl (i18n)](https://next-intl-docs.vercel.app/)
- [Supabase Docs](https://supabase.com/docs)
- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🧪 Tests

### Checklist de Tests Manuels

Avant chaque déploiement, vérifier :

#### Général
- [ ] Page d'accueil charge en FR et EN
- [ ] Sélecteur de langue fonctionne partout
- [ ] Liens GitHub et références externes fonctionnent
- [ ] Responsive mobile/tablette/desktop

#### Test
- [ ] Bouton "Commencer le test" fonctionne (FR & EN)
- [ ] Questions s'affichent correctement
- [ ] Navigation suivant/précédent fonctionne
- [ ] Barre de progression est précise
- [ ] Tous les types de questions fonctionnent (MCQ, number, Likert, etc.)
- [ ] Réponses sauvegardées après refresh
- [ ] Timer fonctionne correctement

#### Résultats
- [ ] Page de résultats s'affiche après le test
- [ ] Score global correct
- [ ] Radar chart et bar chart s'affichent
- [ ] Forces/faiblesses identifiées
- [ ] Lien partageable fonctionne
- [ ] Bouton "Copier le lien" fonctionne
- [ ] Bouton "Refaire le test" fonctionne
- [ ] Impression PDF déplie les accordéons
- [ ] Envoi email fonctionne avec HTML propre

#### Base de données
- [ ] Résultats sauvegardés dans Supabase
- [ ] Token unique généré
- [ ] Percentile réel calculé
- [ ] Stats globales affichées

---

## 🤝 Contribution

### Guidelines

1. **Branching** : Créer une branche par feature (`feature/nom`, `fix/bug`, etc.)
2. **Commits** : Messages clairs et descriptifs (Convention Conventional Commits)
3. **Code Style** : Suivre les règles ESLint et Prettier
4. **TypeScript** : Toujours typer correctement (strict mode)
5. **Testing** : Tester manuellement avant de pusher
6. **i18n** : Toutes les nouvelles strings doivent être traduites (FR + EN)

### Ajout de Questions

Pour ajouter des questions au test, modifier les fichiers JSON :

**`/src/data/test-complet.json`** (FR) et **`/src/data/test-complet-en.json`** (EN)

```json
{
  "id": "nouvelle-question",
  "type": "multiple-choice",
  "text": "Votre question ?",
  "options": ["Option A", "Option B", "Option C"],
  "correct": 1,
  "points": 1,
  "explanation": "Explication scientifique de la bonne réponse..."
}
```

---

## 📝 Licence

Ce projet est open-source sous licence **MIT**.

---

## 👤 Auteur

**Romain Delègise** - Pause IA
Contact : [GitHub](https://github.com/Romain-Deleglise)

---

## 🙏 Remerciements

- **Keith E. Stanovich, Richard F. West, Maggie E. Toplak** pour le CART
- **Daniel Kahneman** et **Amos Tversky** pour leurs travaux sur les biais cognitifs
- **Shane Frederick** pour le Cognitive Reflection Test
- Communauté **LessWrong** et **Effective Altruism** pour les ressources sur la rationalité
- **shadcn** pour les composants UI
- **Vercel** pour l'hébergement
- **Supabase** pour la base de données

---

**⭐ Si ce projet vous intéresse, n'hésitez pas à le star sur GitHub !**
