# 📊 Monitoring Post-Lancement - Guide Express

Configuration rapide (10 minutes) pour surveiller votre site en production.

**Budget : 0€ - Toutes les solutions sont 100% GRATUITES** ✨

---

## 📊 1. Cloudflare Web Analytics - 100% GRATUIT (3 MINUTES)

**Status** : ✅ Code déjà ajouté dans `src/app/[locale]/layout.tsx`

### Pourquoi Cloudflare ?
- ✅ **100% gratuit à vie** (sans limite de pageviews)
- ✅ **Privacy-friendly** : Pas de cookies, RGPD compliant
- ✅ **Rapide** : Script très léger (~2KB)
- ✅ **Aucune limite** de trafic ou de données

### Configuration :

1. **Créer un compte gratuit** : https://dash.cloudflare.com/sign-up

2. **Ajouter Web Analytics** :
   - Aller dans **Analytics & Logs** → **Web Analytics**
   - Cliquer **Add a site**
   - Entrer : `rationality-test.com`
   - Copier le **Beacon Token** généré

3. **Ajouter le token dans Vercel** :
   - Aller dans **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
   - Ajouter :
     ```
     Name: NEXT_PUBLIC_CLOUDFLARE_TOKEN
     Value: [Coller votre token Cloudflare ici]
     ```
   - Cliquer **Save**
   - **Redéployer** votre site (Vercel → Deployments → Redeploy)

4. **C'est tout !** ✅ Le code est déjà prêt dans `layout.tsx`

### Dashboard
Accès : https://dash.cloudflare.com → Web Analytics

**Métriques disponibles :**
- Visiteurs uniques
- Pages vues
- Sources de trafic (referrers)
- Pays et régions
- Navigateurs et appareils
- Pages populaires

**Alternative :** Si vous préférez **Vercel Analytics** (aussi gratuit jusqu'à 2,500 événements/mois), c'est encore plus simple : juste activer dans Vercel Dashboard → Analytics.

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

### À faire MAINTENANT (5 minutes) :
1. ✅ **Cloudflare Web Analytics** : Créer compte + copier token (3 min)
2. ✅ **UptimeRobot** : Configurer monitoring uptime (2 min)

### À faire PLUS TARD (si besoin) :
- ⏸️ **Sentry** : Seulement si vous voyez des bugs récurrents

**COÛT TOTAL : 0€ à vie** 🎉

---

## 📈 Accès rapide (après configuration)

- **Analytics** : https://dash.cloudflare.com (Web Analytics)
- **Uptime** : https://uptimerobot.com/dashboard
- **Errors** : https://sentry.io (si configuré)

---

## ✅ Checklist Post-Config

- [ ] Cloudflare Web Analytics : Compte créé et token copié
- [ ] UptimeRobot configuré avec alerte email
- [ ] (Optionnel) Sentry installé

**Une fois fait, votre site est complètement monitoré - GRATUITEMENT ! 🚀**
