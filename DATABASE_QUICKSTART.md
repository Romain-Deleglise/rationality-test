# 🚀 Guide Rapide - Setup Base de Données

## Étape 1 : Créer la base de données Vercel Postgres (5 min)

1. Aller sur [vercel.com](https://vercel.com) et se connecter
2. Aller dans votre projet `rationality-test`
3. Onglet **Storage** → **Create Database**
4. Choisir **Postgres**
5. Configuration :
   - **Name** : `rationality-test-db`
   - **Region** : Europe West (Frankfurt)
   - **Plan** : Hobby (FREE)
6. Cliquer **Create**

✅ Les variables d'environnement sont automatiquement créées :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

## Étape 2 : Exécuter le schéma SQL (2 min)

1. Dans l'onglet **Storage**, sélectionner votre base `rationality-test-db`
2. Aller dans l'onglet **Query**
3. Copier tout le contenu de `src/db/schema.sql`
4. Coller dans l'éditeur de requêtes
5. Cliquer **Run**

✅ Vous devriez voir :
- 3 tables créées
- 3 vues créées
- 2 fonctions créées

## Étape 3 : Installer les dépendances (1 min)

```bash
npm install @vercel/postgres
```

## Étape 4 : Tester la connexion (2 min)

Créer un fichier de test `src/app/api/test-db/route.ts` :

```typescript
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`SELECT NOW() as current_time`;
    return NextResponse.json({
      success: true,
      currentTime: rows[0].current_time,
      message: 'Database connection successful!'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

Tester :
```bash
npm run dev
# Ouvrir http://localhost:3000/api/test-db
```

Si vous voyez `"success": true` → ✅ La DB fonctionne !

## Étape 5 : Intégrer dans la page résultats (10 min)

Dans `src/app/resultats/page.tsx`, ajouter après le calcul du score :

```typescript
useEffect(() => {
  // Code existant...
  const scores = scoreTest(modules, session.answers);
  const percentile = calculatePercentile(scores.percentage);
  setTestScore({ ...scores, percentile });

  // NOUVEAU : Sauvegarder en base de données
  saveResultsToDatabase(scores, session, modules).catch(error => {
    console.error('Failed to save results:', error);
    // Ne pas bloquer l'affichage si la sauvegarde échoue
  });
}, [session, modules, router]);

async function saveResultsToDatabase(
  testScore: TestScore,
  session: TestSession,
  modules: Module[]
) {
  try {
    const response = await fetch('/api/save-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testScore,
        session,
        modules,
        // demographics: undefined // À ajouter plus tard
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save results');
    }

    const data = await response.json();
    console.log('Results saved with session ID:', data.sessionId);
  } catch (error) {
    console.error('Error saving to database:', error);
    // Fail silently - ne pas impacter l'expérience utilisateur
  }
}
```

## Étape 6 : (Optionnel) Supprimer les données de test

Si vous avez exécuté le schéma complet avec les données de démonstration :

```sql
DELETE FROM test_sessions;
```

## Étape 7 : Déployer

```bash
git add .
git commit -m "Add database integration with Vercel Postgres"
git push
```

Vercel va automatiquement :
1. Détecter les nouvelles variables d'environnement
2. Déployer avec les connexions à la DB
3. Rendre l'API `/api/save-results` disponible

## Vérification finale

1. Compléter un test sur le site en production
2. Aller dans Vercel Dashboard → Storage → votre DB → Query
3. Exécuter :
```sql
SELECT * FROM test_sessions ORDER BY created_at DESC LIMIT 5;
```

Vous devriez voir votre test ! 🎉

## Prochaines étapes

- [ ] Ajouter un formulaire de démographie (optionnel, avec consentement)
- [ ] Créer une page `/stats` pour afficher les statistiques publiques
- [ ] Configurer le cron job de nettoyage RGPD (vercel.json)
- [ ] Monitorer les performances avec Vercel Analytics

## Aide / Debug

### Erreur "relation does not exist"
→ Le schéma SQL n'a pas été exécuté correctement. Retourner à l'Étape 2.

### Erreur "connection refused"
→ Les variables d'environnement ne sont pas configurées. Vérifier dans Vercel Dashboard → Settings → Environment Variables.

### L'API renvoie une erreur 500
→ Regarder les logs dans Vercel Dashboard → Deployments → [dernier deploy] → Runtime Logs.

## Ressources

- [Documentation Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Schéma complet](./src/db/schema.sql)
- [Proposition détaillée](./DATABASE_PROPOSAL.md)
