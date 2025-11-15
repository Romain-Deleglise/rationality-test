# 📊 Monitoring Post-Lancement - Guide Express

Configuration rapide (5 minutes) pour surveiller votre site en production.

**Budget : 0€ - Toutes les solutions sont 100% GRATUITES** ✨

---

## 📊 1. Vercel Analytics + Speed Insights - 100% GRATUIT (30 SECONDES)

**Status** : ✅ Code déjà ajouté dans `src/app/[locale]/layout.tsx`

### Pourquoi Vercel Analytics + Speed Insights ?
- ✅ **100% gratuit** (2,500 événements/mois inclus)
- ✅ **Privacy-friendly** : Pas de cookies, RGPD compliant
- ✅ **Intégration native** : Déjà inclus avec Vercel
- ✅ **Aucune configuration** nécessaire
- ✅ **Rapide** : Déjà optimisé pour Next.js
- ✅ **Core Web Vitals** : Mesure automatique des performances (LCP, FID, CLS)

### Configuration :

1. **Activer dans Vercel Dashboard** :
   - Aller sur https://vercel.com/dashboard
   - Sélectionner votre projet `rationality-test`
   - Aller dans l'onglet **Analytics** → Cliquer **Enable**
   - Aller dans l'onglet **Speed Insights** → Cliquer **Enable**

2. **C'est tout !** ✅ Le code est déjà dans le projet

3. **Déployer et visiter** :
   - Déployer votre site (fait automatiquement)
   - Visiter https://rationality-test.com
   - Attendre 30 secondes
   - Les données apparaîtront dans les dashboards

### Dashboards

**Analytics** : https://vercel.com/dashboard → Votre projet → **Analytics**
- Visiteurs uniques
- Pages vues (pageviews)
- Top pages
- Top referrers (sources de trafic)
- Pays
- Navigateurs et appareils
- Temps réel

**Speed Insights** : https://vercel.com/dashboard → Votre projet → **Speed Insights**
- **Core Web Vitals** (Google ranking factors) :
  - **LCP** (Largest Contentful Paint) : Temps de chargement principal
  - **FID** (First Input Delay) : Temps de réponse à l'interaction
  - **CLS** (Cumulative Layout Shift) : Stabilité visuelle
- Scores par page (Desktop + Mobile)
- Performance par pays
- Tendances dans le temps

---

## 🔔 2. UptimeRobot - Monitoring Uptime (2 MINUTES)

**Objectif** : Recevoir une alerte si le site tombe

### Configuration :

1. **Créer compte** : https://uptimerobot.com/signUp

2. **Add New Monitor** :
   ```
   Monitor Type: HTTPS
   URL: https://rationality-test.com
   Friendly Name: Rationality Test
   Monitoring Interval: 5 minutes
   ```

3. **Alert Contacts** :
   - Ajouter votre email : `rom.deleglise@orange.fr`
   - Type : Email

4. **Save** ✅

### Gratuit à vie
- **Jusqu'à 50 monitors**
- **Vérification toutes les 5 minutes**
- **Alertes email illimitées**

---

## 🐛 3. Sentry - Error Tracking (OPTIONNEL - 10 MIN)

**Objectif** : Être notifié des bugs/erreurs JavaScript automatiquement

### Si vous voulez l'installer maintenant :

#### Étape 1 : Créer compte Sentry

1. Aller sur https://sentry.io/signup/
2. Sélectionner "Next.js"
3. Créer projet : `rationality-test`

#### Étape 2 : Installer Sentry

```bash
cd /home/user/rationality-test
npx @sentry/wizard@latest -i nextjs
```

Le wizard va :
- Installer les dépendances
- Créer les fichiers de config
- Vous demander votre DSN (copié depuis dashboard)

#### Étape 3 : Ajouter variables d'environnement

Dans **Vercel Dashboard → Settings → Environment Variables** :

```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx (optionnel)
```

### Tarif Sentry
- **Gratuit jusqu'à 5K erreurs/mois**
- Puis payant selon volume

### Dashboard
https://sentry.io/organizations/votre-org/projects/rationality-test/

**Ce que vous verrez :**
- Erreurs JavaScript en temps réel
- Stacktraces détaillées
- Navigation utilisateur avant l'erreur
- Notifications par email

---

## 🎯 Recommandation

### À faire MAINTENANT (3 minutes) :
1. ✅ **Vercel Analytics + Speed Insights** : Activer dans Vercel Dashboard (30 sec)
2. ✅ **UptimeRobot** : Configurer monitoring uptime (2 min)

### À faire PLUS TARD (si besoin) :
- ⏸️ **Sentry** : Seulement si vous voyez des bugs récurrents

**COÛT TOTAL : 0€ à vie** 🎉

---

## 📈 Accès rapide (après configuration)

- **Analytics** : https://vercel.com/dashboard → Votre projet → Analytics
- **Speed Insights** : https://vercel.com/dashboard → Votre projet → Speed Insights
- **Uptime** : https://uptimerobot.com/dashboard
- **Errors** : https://sentry.io (si configuré)

---

## ✅ Checklist Post-Config

- [ ] Vercel Analytics : Activé dans dashboard (15 sec)
- [ ] Vercel Speed Insights : Activé dans dashboard (15 sec)
- [ ] UptimeRobot configuré avec alerte email (2 min)
- [ ] (Optionnel) Sentry installé

**Une fois fait, votre site est complètement monitoré - GRATUITEMENT ! 🚀**
