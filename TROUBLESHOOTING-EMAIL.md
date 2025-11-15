# 🔧 Guide de Dépannage - Envoi d'Emails

## Problème: Les emails de résultats ne sont plus envoyés

### 🔍 Diagnostic Rapide

#### 1. Vérifier les Variables d'Environnement Vercel

Aller sur https://vercel.com → Votre projet → Settings → Environment Variables

**Variables OBLIGATOIRES:**
- `RESEND_API_KEY` → Doit commencer par `re_`
- `NEXT_PUBLIC_URL` → Doit être `https://rationality-test.com` (sans slash final)

**Comment vérifier:**
```bash
# Dans le dashboard Vercel, vérifier que ces variables existent
# et sont définies pour "Production"
```

#### 2. Vérifier le Status de Resend

1. Se connecter sur https://resend.com/dashboard
2. Aller dans "API Keys"
3. Vérifier que la clé API est:
   - ✅ Active (pas révoquée)
   - ✅ A les permissions d'envoi
4. Aller dans "Domains"
5. Vérifier que `send.rationality-test.com` est:
   - ✅ Vérifié (status "Verified")
   - ✅ Les records DNS sont corrects

#### 3. Vérifier le Quota Resend

**Plan Gratuit Resend:**
- 100 emails/jour
- 1 domaine custom

Si le quota est dépassé:
- Attendre 24h pour reset
- OU passer au plan payant

**Comment vérifier:**
1. Dashboard Resend → "Usage"
2. Voir combien d'emails ont été envoyés aujourd'hui

#### 4. Tester l'API Directement

```bash
# Depuis votre machine locale (avec .env.local configuré)
node debug-email.js
```

Ce script va:
1. Vérifier les variables d'environnement
2. Tester l'API /api/send-results
3. Afficher les erreurs détaillées

#### 5. Vérifier les Logs Vercel

```bash
# Dans le terminal ou sur vercel.com
vercel logs --prod

# Chercher les erreurs liées à "send-results"
```

Erreurs courantes:
- `Error: Missing API key` → RESEND_API_KEY non définie
- `Error: Invalid API key` → Clé API incorrecte/révoquée
- `Error: Domain not verified` → DNS non configuré correctement
- `Error: Daily sending quota exceeded` → Quota dépassé

### 🛠️ Solutions par Type d'Erreur

#### Erreur: "Missing API key" ou "Invalid API key"

**Solution:**
1. Aller sur https://resend.com/api-keys
2. Créer une nouvelle clé API (si l'ancienne est révoquée)
3. Copier la clé (commence par `re_`)
4. Aller sur Vercel → Settings → Environment Variables
5. Mettre à jour `RESEND_API_KEY` avec la nouvelle valeur
6. **IMPORTANT:** Redéployer le site (Deployments → Redeploy)

#### Erreur: "Domain not verified"

**Solution:**
1. Aller sur https://resend.com/domains
2. Cliquer sur `send.rationality-test.com`
3. Vérifier les DNS records:

```
Type  | Name                          | Value
------|-------------------------------|------------------
MX    | send.rationality-test.com     | feedback-smtp.us-east-1...
TXT   | send.rationality-test.com     | v=spf1 include:amazonses.com ~all
TXT   | resend._domainkey.send...     | p=...
```

4. Si les records DNS ne sont pas corrects, les mettre à jour chez votre registrar
5. Attendre 10-15 minutes pour propagation DNS
6. Revenir sur Resend et cliquer "Verify"

#### Erreur: "Daily sending quota exceeded"

**Solutions:**
1. **Option 1 (gratuite):** Attendre 24h pour reset du quota
2. **Option 2 (recommandée):** Passer au plan payant Resend
   - $20/mois pour 50,000 emails/mois
   - Pas de limite journalière

#### Erreur: "Failed to fetch" (depuis le navigateur)

**Solution:**
1. Ouvrir DevTools (F12)
2. Onglet "Network"
3. Réessayer d'envoyer l'email
4. Cliquer sur la requête `/api/send-results`
5. Regarder la réponse exacte

Si status 500:
- Vérifier les logs Vercel (problème serveur)

Si status 400:
- Vérifier que l'email est valide
- Vérifier que `testScore` existe

Si status 401/403:
- Problème avec la clé API Resend

### ✅ Checklist Complète

- [ ] `RESEND_API_KEY` est définie sur Vercel
- [ ] `NEXT_PUBLIC_URL` est définie sur Vercel (`https://rationality-test.com`)
- [ ] La clé API Resend est active (non révoquée)
- [ ] Le domaine `send.rationality-test.com` est vérifié sur Resend
- [ ] Les records DNS sont corrects
- [ ] Le quota journalier n'est pas dépassé (< 100 emails/jour)
- [ ] Le site a été redéployé après modification des variables d'environnement
- [ ] Aucune erreur dans les logs Vercel

### 🧪 Test Final

Après avoir tout vérifié:

1. Aller sur https://rationality-test.com
2. Compléter le test
3. Sur la page de résultats, entrer un email
4. Cliquer "Envoyer par email"
5. Vérifier que:
   - Le bouton affiche "Envoi en cours..."
   - Puis affiche un message de succès
   - L'email arrive dans les 1-2 minutes

**Note:** Vérifier aussi le dossier Spam!

### 📞 Support Resend

Si le problème persiste après toutes ces vérifications:

1. Contacter le support Resend: support@resend.com
2. Donner ces informations:
   - Domaine: send.rationality-test.com
   - Email d'envoi: results@send.rationality-test.com
   - Erreur exacte des logs Vercel
   - Timestamp de la dernière tentative

### 🔄 Dernière Solution (Reset Complet)

Si vraiment rien ne fonctionne:

1. Sur Resend, supprimer le domaine `send.rationality-test.com`
2. Re-créer le domaine
3. Re-configurer les DNS
4. Créer une nouvelle clé API
5. Mettre à jour `RESEND_API_KEY` sur Vercel
6. Redéployer

---

**Date de création:** 2025-11-15
**Dernière mise à jour:** 2025-11-15
