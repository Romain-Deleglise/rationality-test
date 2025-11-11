# Proposition d'Architecture de Base de Données

## 🎯 Recommandation : **Vercel Postgres**

### Pourquoi Vercel Postgres plutôt que Firebase ?

#### ✅ Avantages de Vercel Postgres

1. **Intégration native avec votre stack**
   - Déjà sur Vercel
   - Zero configuration
   - Variables d'environnement automatiques
   - Edge functions optimisées

2. **Données structurées**
   - Schéma SQL clair et prévisible
   - Relations explicites
   - Requêtes SQL standard
   - Excellent pour les agrégations statistiques

3. **Coûts**
   - **Plan Hobby (GRATUIT)** : 256 MB, 60h compute/mois
   - Largement suffisant pour démarrer (estimé : 10-50k tests)
   - Scale progressif

4. **Developer Experience**
   - TypeScript native avec `@vercel/postgres`
   - Migrations versionnées
   - Requêtes type-safe
   - Debugging facile

#### ❌ Pourquoi pas Firebase ?

1. **Complexité inutile** pour ce cas d'usage
   - Pas besoin de real-time
   - Pas d'authentification complexe
   - Pas de synchro offline

2. **Coûts imprévisibles**
   - Facturation sur les lectures/écritures
   - Peut devenir cher rapidement

3. **Vendor lock-in** plus fort
   - SDK propriétaire
   - Migration difficile

4. **Requêtes d'agrégation** difficiles
   - Pas de SQL
   - Calculs statistiques complexes

---

## 📊 Schéma de Base de Données

### Table : `test_sessions`

Stocke chaque session de test complétée.

```sql
CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metadata
  version VARCHAR(10) NOT NULL CHECK (version IN ('courte', 'complète')),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,

  -- Scores globaux
  total_score NUMERIC(5,2) NOT NULL,
  total_possible NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  percentile INTEGER,

  -- Données anonymes optionnelles (si l'utilisateur accepte)
  age_range VARCHAR(20),  -- '18-25', '26-35', etc.
  education_level VARCHAR(50),  -- 'Lycée', 'Licence', 'Master', 'Doctorat'
  country_code VARCHAR(2),  -- 'FR', 'BE', 'CH', etc.

  -- Technique
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_test_sessions_version ON test_sessions(version);
CREATE INDEX idx_test_sessions_completed_at ON test_sessions(completed_at);
CREATE INDEX idx_test_sessions_percentage ON test_sessions(percentage);
```

### Table : `module_scores`

Scores détaillés par module pour chaque session.

```sql
CREATE TABLE module_scores (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,

  module_id VARCHAR(50) NOT NULL,
  module_name VARCHAR(200) NOT NULL,

  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour jointures
CREATE INDEX idx_module_scores_session_id ON module_scores(session_id);
CREATE INDEX idx_module_scores_module_id ON module_scores(module_id);
```

### Table : `question_answers` (optionnel - pour analyse approfondie)

Stocker les réponses individuelles permet d'analyser quelles questions sont les plus difficiles.

```sql
CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,

  module_id VARCHAR(50) NOT NULL,
  question_id VARCHAR(50) NOT NULL,
  question_type VARCHAR(30) NOT NULL,

  user_answer JSONB,  -- Stockage flexible de tous types de réponses
  correct_answer JSONB,
  is_correct BOOLEAN NOT NULL,

  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_question_answers_session_id ON question_answers(session_id);
CREATE INDEX idx_question_answers_question_id ON question_answers(question_id);
```

---

## 🛠️ Implémentation

### 1. Setup Vercel Postgres

```bash
# Dans le dashboard Vercel
1. Aller dans Storage → Create Database
2. Choisir "Postgres"
3. Région : Europe West (Frankfurt) pour la France
4. Plan : Hobby (gratuit)

# Les variables d'environnement seront auto-créées :
# - POSTGRES_URL
# - POSTGRES_PRISMA_URL
# - POSTGRES_URL_NON_POOLING
```

### 2. Migration SQL

Créer `src/db/schema.sql` :

```sql
-- Fichier complet avec toutes les tables ci-dessus
-- À exécuter une seule fois via Vercel dashboard
```

### 3. API Routes

#### Sauvegarder un résultat : `src/app/api/save-results/route.ts`

```typescript
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testScore, session, modules, demographics } = body;

    // 1. Insérer la session
    const { rows } = await sql`
      INSERT INTO test_sessions (
        version,
        started_at,
        completed_at,
        total_score,
        total_possible,
        percentage,
        percentile,
        age_range,
        education_level,
        country_code,
        user_agent
      ) VALUES (
        ${modules.length > 6 ? 'complète' : 'courte'},
        ${session.startedAt},
        ${session.completedAt},
        ${testScore.totalEarned},
        ${testScore.totalPossible},
        ${testScore.percentage},
        ${testScore.percentile},
        ${demographics?.ageRange || null},
        ${demographics?.educationLevel || null},
        ${demographics?.countryCode || null},
        ${request.headers.get('user-agent')}
      )
      RETURNING id
    `;

    const sessionId = rows[0].id;

    // 2. Insérer les scores par module
    for (const moduleScore of testScore.modules) {
      await sql`
        INSERT INTO module_scores (
          session_id,
          module_id,
          module_name,
          score,
          max_score,
          percentage
        ) VALUES (
          ${sessionId},
          ${moduleScore.moduleId},
          ${moduleScore.moduleName},
          ${moduleScore.earned},
          ${moduleScore.possible},
          ${moduleScore.percentage}
        )
      `;
    }

    return NextResponse.json({
      success: true,
      sessionId
    });

  } catch (error) {
    console.error('Error saving test results:', error);
    return NextResponse.json(
      { error: 'Failed to save results' },
      { status: 500 }
    );
  }
}
```

#### Récupérer les statistiques : `src/app/api/stats/route.ts`

```typescript
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Stats globales
    const { rows: globalStats } = await sql`
      SELECT
        COUNT(*) as total_tests,
        AVG(percentage) as avg_score,
        STDDEV(percentage) as std_dev,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY percentage) as median_score,
        MIN(percentage) as min_score,
        MAX(percentage) as max_score
      FROM test_sessions
      WHERE completed_at >= NOW() - INTERVAL '30 days'
    `;

    // Stats par module
    const { rows: moduleStats } = await sql`
      SELECT
        module_id,
        module_name,
        COUNT(*) as attempts,
        AVG(percentage) as avg_percentage,
        STDDEV(percentage) as std_dev
      FROM module_scores
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY module_id, module_name
      ORDER BY avg_percentage ASC
    `;

    // Distribution des scores
    const { rows: distribution } = await sql`
      SELECT
        CASE
          WHEN percentage >= 90 THEN '90-100'
          WHEN percentage >= 80 THEN '80-89'
          WHEN percentage >= 70 THEN '70-79'
          WHEN percentage >= 60 THEN '60-69'
          WHEN percentage >= 50 THEN '50-59'
          ELSE '0-49'
        END as score_range,
        COUNT(*) as count
      FROM test_sessions
      WHERE completed_at >= NOW() - INTERVAL '30 days'
      GROUP BY score_range
      ORDER BY score_range DESC
    `;

    return NextResponse.json({
      global: globalStats[0],
      byModule: moduleStats,
      distribution,
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
```

---

## 📈 Calcul du Percentile Réel

Actuellement, le percentile est estimé. Avec la DB, on peut calculer le vrai percentile :

```typescript
// Dans src/lib/scoring.ts
export async function calculateRealPercentile(
  percentage: number,
  version: string
): Promise<number> {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) as total_count,
             SUM(CASE WHEN percentage < ${percentage} THEN 1 ELSE 0 END) as below_count
      FROM test_sessions
      WHERE version = ${version}
        AND completed_at >= NOW() - INTERVAL '90 days'
    `;

    const totalCount = parseInt(rows[0].total_count);
    const belowCount = parseInt(rows[0].below_count);

    if (totalCount === 0) return 50; // Pas encore de données

    return Math.round((belowCount / totalCount) * 100);
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return calculatePercentile(percentage); // Fallback to estimation
  }
}
```

---

## 🔒 RGPD et Confidentialité

### Données collectées

1. **OBLIGATOIRES** (anonymes) :
   - Scores de test
   - Date/heure
   - Version du test

2. **OPTIONNELLES** (avec consentement explicite) :
   - Tranche d'âge (pas l'âge exact)
   - Niveau d'éducation
   - Pays (pas la ville)

### Pas de données personnelles

- ❌ Pas de nom
- ❌ Pas d'email (sauf envoi de résultats, non stocké)
- ❌ Pas d'IP
- ❌ Pas de cookies de tracking

### Rétention des données

```sql
-- Politique de suppression automatique (après 2 ans)
CREATE OR REPLACE FUNCTION delete_old_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM test_sessions
  WHERE completed_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;

-- Cron job Vercel (dans vercel.json)
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 0 1 * *"  // Premier jour de chaque mois
  }]
}
```

---

## 💰 Estimation des Coûts

### Plan Hobby (GRATUIT)

- **Stockage** : 256 MB
- **Compute** : 60 heures/mois

**Capacité estimée :**

```
Taille moyenne d'un test complet :
- test_sessions : ~500 bytes
- module_scores (11 modules) : ~1.5 KB
- Total par test : ~2 KB

256 MB = 128 000 tests complets

À 100 tests/jour → 3 000 tests/mois → Gratuit pendant 40+ mois
```

### Quand passer au plan payant ?

- **Pro Plan** ($20/mois) : 512 MB storage, 100h compute
- Nécessaire si > 200-300 tests/jour

---

## 🚀 Plan de Migration

### Phase 1 : Setup minimal (1-2h)

1. Créer la base Vercel Postgres
2. Exécuter le schéma SQL
3. Créer l'API `/api/save-results`
4. Tester avec quelques entrées manuelles

### Phase 2 : Intégration (2-3h)

1. Modifier `src/app/resultats/page.tsx` :
   - Appeler `/api/save-results` après calcul du score
   - Gérer les erreurs silencieusement (pas bloquer l'affichage)

2. Ajouter un formulaire optionnel de démographie :
   ```tsx
   <AccordionItem title="📊 Aider la recherche (optionnel)">
     <select name="ageRange">
       <option>18-25</option>
       <option>26-35</option>
       ...
     </select>
   </AccordionItem>
   ```

### Phase 3 : Dashboard stats (3-4h)

1. Créer `/app/stats/page.tsx`
2. Afficher statistiques publiques :
   - Nombre total de tests
   - Score moyen par module
   - Distribution des scores

---

## 📝 Fichiers à créer

```
rationality-test/
├── src/
│   ├── db/
│   │   └── schema.sql           # Schéma complet de la DB
│   ├── app/
│   │   ├── api/
│   │   │   ├── save-results/
│   │   │   │   └── route.ts     # POST pour sauvegarder
│   │   │   ├── stats/
│   │   │   │   └── route.ts     # GET pour statistiques
│   │   │   └── cron/
│   │   │       └── cleanup/
│   │   │           └── route.ts # Nettoyage auto
│   │   └── stats/
│   │       └── page.tsx         # Dashboard public
│   └── lib/
│       └── percentile.ts        # Calcul percentile réel
└── vercel.json                  # Config cron jobs
```

---

## ✅ Checklist de Déploiement

- [ ] Créer la base Vercel Postgres
- [ ] Exécuter `schema.sql`
- [ ] Créer les 3 API routes
- [ ] Tester avec curl/Postman
- [ ] Intégrer dans la page résultats
- [ ] Ajouter formulaire démographie (optionnel)
- [ ] Créer page statistiques
- [ ] Ajouter mentions légales RGPD
- [ ] Configurer cron de nettoyage
- [ ] Monitorer les premiers 100 tests

---

## 🎯 Alternative Simple (si pas le temps maintenant)

### Option : Vercel KV (Redis)

Si vraiment pressés, Vercel KV peut servir de solution temporaire :

**Avantages :**
- Setup en 2 min
- Pas de schéma à définir
- Ultra rapide

**Inconvénients :**
- Pas de requêtes complexes
- Difficile de calculer stats
- Migration vers Postgres après = travail

**Recommandation :** Prendre le temps de faire Postgres directement.

---

## 📚 Ressources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [SQL.js Playground](https://sql.js.org/examples/GUI/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## Conclusion

**Vercel Postgres est le meilleur choix pour ce projet.**

- Simple à setup
- Gratuit pour commencer
- Scalable quand nécessaire
- Excellent pour les agrégations statistiques
- Cohérent avec votre stack Vercel/Next.js

**Temps estimé d'implémentation complète : 6-8 heures**
