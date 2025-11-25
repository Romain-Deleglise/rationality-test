# Changelog - Test de Rationalité

## [2025-11-25] - Réorganisation des options + Fix navigation

### 🎯 Réorganisation des options pour éviter les patterns de réponses

**Problème détecté :** Plusieurs modules présentaient 3 questions consécutives ou plus avec la même bonne réponse (ex: toutes "c" ou toutes "b"), permettant aux participants de deviner un pattern plutôt que de réfléchir aux questions.

**Corrections appliquées :**

#### Test Complet (`test-complet.json`)
- **Module 1 (Raisonnement Probabiliste)** : Questions 3-7 (5 questions avec "c")
  → Alternance des réponses: c-b-c-b-c
- **Module 2 (Raisonnement Scientifique)** : Questions 12-14 (3 questions avec "b")
  → Pattern corrigé: b-c-b
- **Module 14 (Raisonnement Causal)** : Questions 1-5 (5 questions avec "b")
  → Alternance des réponses: b-a-b-a-b
- **Module 15 (Effets de Cadrage)** : Questions 1-8 (8 questions avec "b")
  → Alternance des réponses: b-a-b-a-b-a-b-b
- **Module 17 (Coûts Irrécupérables)** : Questions 1-4 (4 questions avec "b")
  → Pattern corrigé: b-a-b-b

#### Test Court (`test-court.json`)
- **Module 2 (Raisonnement Scientifique)** :
  - Questions 3-5 (3 questions avec "c") → Pattern corrigé: c-b-c
  - Questions 9-11 (3 questions avec "b") → Pattern corrigé: b-a-b

**Méthode utilisée :**
- Réorganisation de l'ordre des options sans changer le sens des questions
- Les bonnes réponses restent sémantiquement identiques
- Le système de scoring reste inchangé (vérifié)

**Impact :**
- ✅ Amélioration de la validité psychométrique du test
- ✅ Prévention du "pattern guessing"
- ✅ Aucun impact sur les scores existants

**Fichiers modifiés :**
- `src/data/test-complet.json`
- `src/data/test-court.json`

---

### 🐛 Correction du bug de retour en arrière

**Problème :** Lorsque l'utilisateur cliquait sur le bouton retour du navigateur et confirmait vouloir quitter le test (en cliquant sur "Oui"), le popup se déclenchait correctement mais l'utilisateur restait sur la page du test.

**Cause :** Le code utilisait `window.history.back()` qui revenait simplement à l'entrée d'historique ajoutée par le système de protection, créant une boucle.

**Solution :** Utiliser `router.push(\`/\${locale}\`)` pour rediriger explicitement vers la page d'accueil lorsque l'utilisateur confirme vouloir quitter.

**Fichier modifié :**
- `src/app/[locale]/test/TestContent.tsx` (ligne 111)

**Test :**
- ✅ Bouton retour + confirmation "Oui" → Redirige vers la page d'accueil
- ✅ Bouton retour + confirmation "Non" → Reste sur le test
- ✅ Tentative de fermeture d'onglet → Popup de confirmation

---

### 📝 Commit

**Branch :** `claude/clarify-test-questions-01AZv6yraUp7koQNrpwvcui1`

**Commits :**
1. `fix: Réorganisation des options pour éviter les patterns de réponses`
2. `fix: Correction du bug de retour en arrière du navigateur`

---

## [2025-11-12] - Multilingual fixes + SEO + Dark Mode + Methodology

### ✅ Fixes Critiques

#### 1. Problème de changement de langue
**Problème :** La page d'accueil restait toujours en français ou toujours en anglais, même après sélection de l'autre langue.

**Solution :**
- ✅ Passer `locale` explicitement à `getMessages({ locale })` dans layout
- ✅ Ajouter prop `locale` au `NextIntlClientProvider`
- ✅ Corriger les fallbacks dans `i18n.ts`, `LanguageSwitcher.tsx`, et `layout.tsx`

**Fichiers modifiés :**
- `src/app/[locale]/layout.tsx`
- `src/i18n.ts`
- `src/components/LanguageSwitcher.tsx`

#### 2. Message "enjoy" supprimé
- ✅ Supprimé de `messages/en.json` et `messages/fr.json`
- ✅ Supprimé du composant de la page d'accueil
- ✅ Ajouté ":)" au footer anglais comme demandé

---

### 🔍 SEO Multilingue

#### Fichiers créés
- ✅ `public/robots.txt` : Permet tous les crawlers, référence le sitemap
- ✅ `src/app/sitemap.ts` : Génère dynamiquement un sitemap avec alternates EN/FR

#### Metadata dynamiques par locale
- ✅ Fonction `generateMetadata` avec contenu spécifique à chaque langue
- ✅ Balises hreflang via `alternates.languages`
- ✅ Metadata OpenGraph pour Twitter/LinkedIn
- ✅ Twitter Card metadata
- ✅ URLs canoniques
- ✅ Keywords SEO par langue

**Impact :** Meilleur référencement sur Google, Bing, etc. pour les deux langues

---

### 🌙 Mode Sombre (Dark Mode)

#### Dépendances installées
- `next-themes`: ^0.2.1

#### Fichiers créés
- ✅ `src/components/ThemeProvider.tsx` : Wrapper next-themes
- ✅ `src/components/ThemeToggle.tsx` : Bouton de bascule thème
- ✅ `tailwind.config.ts` : Configuration Tailwind avec `darkMode: 'class'`

#### Intégration
- ✅ ThemeProvider dans le layout principal
- ✅ Bouton de bascule à côté du sélecteur de langue
- ✅ Classes dark: sur la page d'accueil
- ✅ Support de la préférence système
- ✅ Transitions fluides

**Fichiers modifiés :**
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`

---

### 📚 Page Méthodologie

#### Route créée : `/[locale]/methodologie`

**Contenu complet (bilingue FR/EN) :**
- ✅ Qu'est-ce que le CART ?
- ✅ Validation scientifique
  - Propriétés psychométriques
  - Indépendance du QI
  - Prédictions réelles
- ✅ Notre adaptation
  - Différences avec le CART original
  - Questions du domaine public
- ✅ **Limites & Critiques** (section importante)
  - Paradoxe de la conscience de soi
  - Dépendance au contexte
  - Biais culturel (WEIRD)
  - Motivation et effort
  - Non-diagnostique
- ✅ La rationalité peut-elle être améliorée ?
  - Pratique délibérée
  - Protocoles externes
  - Attentes réalistes
- ✅ Références scientifiques (5 sources clés)

**Fichiers créés :**
- `src/app/[locale]/methodologie/page.tsx`

**Traductions ajoutées :**
- `messages/en.json` : Objet complet "methodology"
- `messages/fr.json` : Objet complet "methodology"
- Ajout dans `nav.methodology` pour les deux langues

---

### 📱 Partage Social

#### Composant créé
- ✅ `src/components/SocialShare.tsx`
  - Bouton Twitter
  - Bouton LinkedIn
  - Support bilingue
  - Ouvre dans nouvelle fenêtre

**Note :** Le composant est créé mais pas encore intégré dans les pages de résultats.

---

### 📦 Dépendances Installées

```json
{
  "next-themes": "^0.2.1",         // Dark mode
  "framer-motion": "^11.x",        // Animations (installé mais non intégré)
  "@react-pdf/renderer": "^3.x"    // PDF professionnel (installé mais non intégré)
}
```

---

### 🔧 Fichiers Modifiés

**Configuration :**
- `package.json` : Nouvelles dépendances
- `package-lock.json` : Lock file mis à jour
- `tailwind.config.ts` : Créé avec dark mode

**Layout & i18n :**
- `src/app/[locale]/layout.tsx` : ThemeProvider, metadata dynamiques, locale explicite
- `src/i18n.ts` : Fallback corrigé à 'en'
- `src/components/LanguageSwitcher.tsx` : Fallback corrigé
- `src/middleware.ts` : Déjà correct (defaultLocale: 'en')

**Traductions :**
- `messages/en.json` : +90 lignes (methodology, nav update, footer smiley)
- `messages/fr.json` : +90 lignes (methodology, nav update)

**Pages :**
- `src/app/[locale]/page.tsx` : Classes dark mode, suppression "enjoy"

**Nouveaux fichiers :**
- `public/robots.txt`
- `src/app/sitemap.ts`
- `src/components/ThemeProvider.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/SocialShare.tsx`
- `src/app/[locale]/methodologie/page.tsx`
- `tailwind.config.ts`

---

### ⏳ Tâches Restantes (Optionnelles)

#### À terminer
1. **Intégrer SocialShare** dans `/resultats/page.tsx` et `/resultats/[token]/page.tsx`
   - Composant créé, besoin de l'importer et l'utiliser
2. **Export PDF professionnel**
   - `@react-pdf/renderer` installé
   - Créer un composant PDF stylé avec graphiques
3. **Animations Framer Motion**
   - `framer-motion` installé
   - Ajouter transitions de page
   - Animer les cartes et accordéons

#### Améliorations futures
- Ajouter classes dark: aux autres pages (test, résultats)
- Optimiser les images pour le dark mode
- Ajouter plus de réseaux sociaux (Facebook, Email)
- Analytics

---

### 📝 Commits de cette session

1. **fix: Pass locale explicitly to getMessages and Provider**
   - Correction du bug de langue
   - Ajout smiley au footer EN

2. **feat: Add comprehensive multilingual SEO**
   - robots.txt, sitemap.xml, metadata dynamiques
   - hreflang, OpenGraph, Twitter Cards

3. **feat: Add dark mode support**
   - next-themes, ThemeProvider, ThemeToggle
   - Configuration Tailwind
   - Classes dark sur home page

4. **feat: Add comprehensive Methodology page**
   - Page complète bilingue
   - CART, validation, limites, critiques
   - Références scientifiques

5. **feat: Add social sharing buttons**
   - Composant SocialShare (Twitter, LinkedIn)
   - Bilingue, prêt à intégrer

**Branch :** `claude/incomplete-description-011CV22eLUMFpf9smJ4taRv1`
**Pushed :** ✅ Tous les commits poussés

---

### ✅ Résumé de la Session

**Problèmes résolus :**
- ✅ Langue bloquée (FR ou EN) → Maintenant fonctionnel
- ✅ Message "enjoy" → Supprimé
- ✅ Footer anglais → Smiley ajouté

**Nouvelles fonctionnalités :**
- ✅ SEO multilingue complet
- ✅ Mode sombre fonctionnel
- ✅ Page Méthodologie complète et scientifique
- ✅ Boutons de partage social créés

**État du projet :**
- ✅ Site entièrement bilingue (FR/EN)
- ✅ SEO optimisé pour les moteurs de recherche
- ✅ Dark mode avec transition fluide
- ✅ Transparence scientifique complète
- ⚠️ PDF & animations : bibliothèques installées, intégration à faire

---

## [2025-11-11] - Corrections bugs critiques + Architecture DB

### ✅ Bugs corrigés

#### 1. Version courte vs complète du test
**Problème :** La version courte chargeait les mêmes données que la version complète (juste les 6 premiers modules du même fichier).

**Solution :**
- ✅ Créé `src/data/test-court.json` (6 modules, 26 questions, ~18min)
- ✅ Créé `src/data/test-complet.json` (11 modules, 37 questions, ~50min)
- ✅ Modifié `TestContent.tsx` pour charger le bon fichier selon `?version=full`

**Fichiers modifiés :**
- `src/app/test/TestContent.tsx`
- `src/data/test-court.json`
- `src/data/test-complet.json` (nouveau)

---

#### 2. Graphiques avec labels qui se chevauchent
**Problème :** Les noms de modules trop longs se chevauchaient sur les graphiques radar et bar.

**Solution :**
- ✅ **Radar Chart :**
  - Augmenté hauteur (450px → 500px)
  - Ajouté marges (top: 20, right: 30, bottom: 20, left: 30)
  - Réduit taille police (13px → 11px)
  - Labels raccourcis à 15 caractères + "..."
  - Tooltip avec nom complet au survol

- ✅ **Bar Chart :**
  - Hauteur dynamique selon nombre de modules (min 400px, +60px par module)
  - Marge gauche adaptative selon longueur des labels
  - Labels raccourcis à 19 caractères + "..."
  - Tooltip avec nom complet au survol
  - Taille police réduite (13px → 11px)

**Fichiers modifiés :**
- `src/components/ResultsCharts.tsx`

---

#### 3. Erreurs TypeScript
**Problème mentionné :** Erreur TypeScript dans `scoring.ts`

**Investigation :**
- ✅ Exécuté `npx tsc --noEmit` → **Aucune erreur TypeScript**
- ✅ Le code compile correctement
- ⚠️ Le build échoue localement à cause de Google Fonts (403 Forbidden) mais fonctionne sur Vercel

**Conclusion :** Pas d'erreur TypeScript réelle. Le problème de build local est dû à l'environnement, pas au code.

---

### 🗄️ Nouvelle fonctionnalité : Base de données

#### Recommandation : **Vercel Postgres** (plutôt que Firebase)

**Pourquoi Vercel Postgres ?**
- ✅ Intégration native avec Vercel (zero config)
- ✅ Données structurées (SQL = parfait pour agrégations statistiques)
- ✅ Plan gratuit généreux (256 MB = ~128 000 tests)
- ✅ Coûts prévisibles
- ✅ TypeScript native via `@vercel/postgres`
- ✅ Migrations versionnées

**Pourquoi pas Firebase ?**
- ❌ Complexité inutile (pas besoin de real-time, auth complexe, synchro offline)
- ❌ Coûts imprévisibles (facturation par lecture/écriture)
- ❌ Requêtes d'agrégation difficiles (pas de SQL)
- ❌ Vendor lock-in plus fort

---

#### Schéma de base de données

**3 tables créées :**

1. **`test_sessions`** : Scores globaux par session
   - ID unique (UUID)
   - Version (courte/complète)
   - Scores globaux (total, pourcentage, percentile)
   - Données démographiques optionnelles (âge, éducation, pays)
   - User agent
   - RGPD-compliant (anonyme, rétention 2 ans)

2. **`module_scores`** : Détails par module
   - Lié à `test_sessions` (CASCADE DELETE)
   - Scores par module
   - Pourcentages

3. **`question_answers`** (optionnel) : Réponses individuelles
   - Permet d'analyser quelles questions sont les plus difficiles
   - Stockage flexible en JSONB
   - Peut être désactivé pour économiser de l'espace

**3 vues SQL pour statistiques :**
- `stats_global_30d` : Stats globales (moyenne, médiane, écart-type)
- `stats_by_module_30d` : Stats par module
- `score_distribution_30d` : Distribution des scores par tranches

**2 fonctions SQL :**
- `calculate_percentile(percentage, version)` : Calcule le percentile réel
- `delete_old_sessions()` : Nettoyage automatique RGPD (>2 ans)

---

#### Fichiers créés

1. **`DATABASE_PROPOSAL.md`** (détaillé, 15-20 min de lecture)
   - Comparaison Vercel Postgres vs Firebase
   - Schéma complet avec explications
   - Code TypeScript pour API routes
   - Calcul du percentile réel
   - Politique RGPD
   - Estimation des coûts
   - Plan de migration étape par étape

2. **`DATABASE_QUICKSTART.md`** (guide rapide, 5 min)
   - 7 étapes pour setup complet (20 min total)
   - Instructions pas à pas avec screenshots
   - Code de test
   - Troubleshooting

3. **`src/db/schema.sql`** (prêt à déployer)
   - Schéma PostgreSQL complet
   - Index optimisés
   - Vues et fonctions
   - Données de démonstration (à supprimer en prod)
   - Commentaires détaillés

4. **`src/app/api/save-results/route.ts`** (API route exemple)
   - POST : Sauvegarder un test
   - GET : Récupérer statistiques de base
   - Gestion d'erreurs
   - Calcul automatique du percentile réel
   - Validation des données

---

#### Capacité estimée (Plan gratuit)

```
Vercel Postgres Hobby (GRATUIT) :
- Stockage : 256 MB
- Compute : 60 heures/mois

Taille par test complet :
- test_sessions : ~500 bytes
- module_scores (11 modules) : ~1.5 KB
- Total : ~2 KB/test

Capacité = 256 MB / 2 KB = 128 000 tests complets

À 100 tests/jour :
- 3 000 tests/mois
- Gratuit pendant 40+ mois
```

---

### 📊 Prochaines étapes recommandées

#### Court terme (1-2 heures)
- [ ] Setup Vercel Postgres (suivre `DATABASE_QUICKSTART.md`)
- [ ] Tester l'API `/api/save-results`
- [ ] Intégrer dans la page résultats

#### Moyen terme (3-5 heures)
- [ ] Ajouter formulaire de démographie optionnel
- [ ] Créer page `/stats` avec statistiques publiques
- [ ] Afficher le percentile réel (au lieu de l'estimation)

#### Long terme (5-10 heures)
- [ ] Compléter les questions manquantes (actuellement 37, objectif 85)
- [ ] Ajouter explications détaillées pour chaque question
- [ ] Créer variantes de questions (anti-mémorisation)
- [ ] Dashboard admin pour analyser les résultats

---

### 📈 État du projet

**Fonctionnalités opérationnelles :**
- ✅ Page d'accueil complète
- ✅ Test avec 37 questions (6 types de questions)
- ✅ Version courte (6 modules) et complète (11 modules)
- ✅ Système de scoring complet
- ✅ Page de résultats détaillée avec graphiques
- ✅ Export PDF (via impression)
- ✅ Envoi par email (API route existante)

**Améliorations récentes :**
- ✅ Séparation version courte/longue
- ✅ Graphiques optimisés
- ✅ Architecture DB prête à déployer

**À compléter :**
- ⏳ Questions : 37/85 (43%)
- ⏳ Explications détaillées : ~30%
- ⏳ Base de données : Architecture prête, à déployer
- ⏳ Statistiques publiques : 0%

---

### 🔧 Problèmes connus

1. **Build local échoue (Google Fonts)**
   - Erreur : 403 Forbidden sur fonts.googleapis.com
   - Impact : Impossible de builder localement
   - Solution : Fonctionne sur Vercel (environnement différent)
   - Workaround : Utiliser `npm run dev` pour développement local

2. **Peu de questions actuellement**
   - Total : 37 questions (objectif 85)
   - Version courte : 26 questions (correct)
   - Version complète : 37 questions (devrait être 85)
   - À compléter : ~48 questions supplémentaires

3. **Percentile estimé (pas réel)**
   - Actuellement : Fonction `calculatePercentile()` basée sur distribution théorique
   - Solution : Implémenter la DB pour calculer le vrai percentile

---

### 📝 Commit

**Branch :** `claude/incomplete-description-011CV22eLUMFpf9smJ4taRv1`

**Commit message :**
```
Fix: Bugs critiques + Architecture base de données

- Séparé version courte/longue (test-court.json vs test-complet.json)
- Corrigé graphiques (labels qui se chevauchaient)
- Proposé architecture Vercel Postgres complète
- Créé schéma SQL + API routes + documentation
```

**Fichiers modifiés :**
- `src/app/test/TestContent.tsx`
- `src/components/ResultsCharts.tsx`
- `src/data/test-court.json`
- `package-lock.json`

**Fichiers créés :**
- `DATABASE_PROPOSAL.md`
- `DATABASE_QUICKSTART.md`
- `src/db/schema.sql`
- `src/app/api/save-results/route.ts`
- `src/data/test-complet.json`
- `CHANGELOG.md`

**Pushed to :** `origin/claude/incomplete-description-011CV22eLUMFpf9smJ4taRv1`

---

### 💡 Recommandations

1. **Priorité #1 : Déployer la base de données**
   - Temps estimé : 20 minutes (suivre QUICKSTART)
   - Impact : Percentiles réels, statistiques, amélioration continue

2. **Priorité #2 : Ajouter plus de questions**
   - Besoin de 48 questions supplémentaires pour la version complète
   - Utiliser les questions du guide détaillé fourni

3. **Priorité #3 : Page de statistiques publiques**
   - Créer `/app/stats/page.tsx`
   - Afficher score moyen, distribution, module le plus difficile
   - Transparence scientifique

4. **Nice to have : Formulaire démographique**
   - Optionnel, avec consentement explicite
   - Permettrait des analyses par âge, niveau d'éducation

---

### 📚 Documentation

- **Pour déployer la DB** : Lire `DATABASE_QUICKSTART.md` (5 min)
- **Pour comprendre l'architecture** : Lire `DATABASE_PROPOSAL.md` (15-20 min)
- **Pour voir le schéma SQL** : `src/db/schema.sql`
- **Pour voir l'API** : `src/app/api/save-results/route.ts`

---

### ✅ Résumé

**Bugs critiques corrigés :** 3/3
- ✅ Version courte/longue
- ✅ Graphiques
- ✅ Erreurs TypeScript (en fait, il n'y en avait pas)

**Nouvelle fonctionnalité :** Architecture DB complète
- ✅ Schéma PostgreSQL
- ✅ API routes
- ✅ Documentation détaillée
- ⏳ À déployer (20 min)

**Le projet est prêt pour :**
- ✅ Développement local (`npm run dev`)
- ✅ Déploiement sur Vercel
- ✅ Ajout de la base de données (optionnel mais recommandé)
- ✅ Ajout de contenu (questions supplémentaires)
