-- Schema pour Test de Rationalité (CART)
-- Base de données : PostgreSQL (Vercel Postgres)
-- Version : 1.0
-- Date : 2025-11-11

-- ============================================
-- Table : test_sessions
-- Stocke chaque session de test complétée
-- ============================================

CREATE TABLE test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Metadata du test
  version VARCHAR(10) NOT NULL CHECK (version IN ('courte', 'complète')),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,

  -- Scores globaux
  total_score NUMERIC(5,2) NOT NULL,
  total_possible NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  percentile INTEGER CHECK (percentile >= 0 AND percentile <= 100),

  -- Données anonymes optionnelles (avec consentement)
  age_range VARCHAR(20),  -- '18-25', '26-35', '36-45', '46-60', '60+'
  education_level VARCHAR(50),  -- 'Collège', 'Lycée', 'Licence', 'Master', 'Doctorat'
  country_code VARCHAR(2),  -- ISO 3166-1 alpha-2 : 'FR', 'BE', 'CH', 'CA', etc.

  -- Technique (pour debug et analytics)
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_test_sessions_version ON test_sessions(version);
CREATE INDEX idx_test_sessions_completed_at ON test_sessions(completed_at DESC);
CREATE INDEX idx_test_sessions_percentage ON test_sessions(percentage DESC);
CREATE INDEX idx_test_sessions_created_at ON test_sessions(created_at DESC);

-- Index composite pour requêtes filtrées
CREATE INDEX idx_test_sessions_version_date ON test_sessions(version, completed_at DESC);

-- Commentaires
COMMENT ON TABLE test_sessions IS 'Stocke les sessions de test complétées avec scores globaux';
COMMENT ON COLUMN test_sessions.version IS 'Version du test : courte (18min, 6 modules) ou complète (50min, 11 modules)';
COMMENT ON COLUMN test_sessions.percentile IS 'Percentile calculé par rapport aux autres utilisateurs (0-100)';

-- ============================================
-- Table : module_scores
-- Scores détaillés par module pour chaque session
-- ============================================

CREATE TABLE module_scores (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,

  -- Identification du module
  module_id VARCHAR(50) NOT NULL,
  module_name VARCHAR(200) NOT NULL,

  -- Scores
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour jointures et agrégations
CREATE INDEX idx_module_scores_session_id ON module_scores(session_id);
CREATE INDEX idx_module_scores_module_id ON module_scores(module_id);
CREATE INDEX idx_module_scores_module_percentage ON module_scores(module_id, percentage DESC);

-- Commentaires
COMMENT ON TABLE module_scores IS 'Scores détaillés par module pour chaque session de test';
COMMENT ON COLUMN module_scores.module_id IS 'ID technique du module (ex: prob-stats, sci-reasoning)';

-- ============================================
-- Table : question_answers (OPTIONNEL)
-- Stocke les réponses individuelles
-- Utile pour analyser quelles questions sont les plus difficiles
-- ============================================

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES test_sessions(id) ON DELETE CASCADE,

  -- Identification
  module_id VARCHAR(50) NOT NULL,
  question_id VARCHAR(50) NOT NULL,
  question_type VARCHAR(30) NOT NULL,  -- 'multiple-choice', 'number', 'confidence-interval', etc.

  -- Réponses (stockage flexible en JSONB)
  user_answer JSONB,  -- La réponse de l'utilisateur
  correct_answer JSONB,  -- La réponse correcte (pour comparaison)
  is_correct BOOLEAN NOT NULL,

  -- Scores
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour analyses
CREATE INDEX idx_question_answers_session_id ON question_answers(session_id);
CREATE INDEX idx_question_answers_question_id ON question_answers(question_id);
CREATE INDEX idx_question_answers_is_correct ON question_answers(question_id, is_correct);
CREATE INDEX idx_question_answers_module_id ON question_answers(module_id);

-- Commentaires
COMMENT ON TABLE question_answers IS 'Réponses individuelles par question (optionnel, pour analyses approfondies)';
COMMENT ON COLUMN question_answers.user_answer IS 'Réponse de l''utilisateur en JSON (format flexible selon type de question)';

-- ============================================
-- Vues utiles pour les statistiques
-- ============================================

-- Vue : Statistiques globales récentes (30 derniers jours)
CREATE OR REPLACE VIEW stats_global_30d AS
SELECT
  COUNT(*) as total_tests,
  COUNT(CASE WHEN version = 'courte' THEN 1 END) as tests_courts,
  COUNT(CASE WHEN version = 'complète' THEN 1 END) as tests_complets,
  AVG(percentage) as avg_score,
  STDDEV(percentage) as std_dev,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY percentage) as q1,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY percentage) as median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY percentage) as q3,
  MIN(percentage) as min_score,
  MAX(percentage) as max_score
FROM test_sessions
WHERE completed_at >= NOW() - INTERVAL '30 days';

COMMENT ON VIEW stats_global_30d IS 'Statistiques globales des 30 derniers jours';

-- Vue : Statistiques par module (30 derniers jours)
CREATE OR REPLACE VIEW stats_by_module_30d AS
SELECT
  module_id,
  module_name,
  COUNT(*) as attempts,
  AVG(percentage) as avg_percentage,
  STDDEV(percentage) as std_dev,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY percentage) as median_percentage,
  MIN(percentage) as min_percentage,
  MAX(percentage) as max_percentage
FROM module_scores ms
JOIN test_sessions ts ON ms.session_id = ts.id
WHERE ts.completed_at >= NOW() - INTERVAL '30 days'
GROUP BY module_id, module_name
ORDER BY avg_percentage ASC;

COMMENT ON VIEW stats_by_module_30d IS 'Statistiques par module des 30 derniers jours, triées du plus difficile au plus facile';

-- Vue : Distribution des scores (30 derniers jours)
CREATE OR REPLACE VIEW score_distribution_30d AS
SELECT
  version,
  CASE
    WHEN percentage >= 90 THEN '90-100'
    WHEN percentage >= 80 THEN '80-89'
    WHEN percentage >= 70 THEN '70-79'
    WHEN percentage >= 60 THEN '60-69'
    WHEN percentage >= 50 THEN '50-59'
    WHEN percentage >= 40 THEN '40-49'
    ELSE '0-39'
  END as score_range,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY version)), 2) as percentage_of_tests
FROM test_sessions
WHERE completed_at >= NOW() - INTERVAL '30 days'
GROUP BY version, score_range
ORDER BY version, score_range DESC;

COMMENT ON VIEW score_distribution_30d IS 'Distribution des scores par tranches pour chaque version du test';

-- ============================================
-- Fonctions utiles
-- ============================================

-- Fonction : Calculer le percentile réel pour un score donné
CREATE OR REPLACE FUNCTION calculate_percentile(
  p_percentage NUMERIC,
  p_version VARCHAR
) RETURNS INTEGER AS $$
DECLARE
  v_total_count INTEGER;
  v_below_count INTEGER;
  v_percentile INTEGER;
BEGIN
  -- Compter uniquement sur les 90 derniers jours pour éviter dérive
  SELECT
    COUNT(*),
    SUM(CASE WHEN percentage < p_percentage THEN 1 ELSE 0 END)
  INTO v_total_count, v_below_count
  FROM test_sessions
  WHERE version = p_version
    AND completed_at >= NOW() - INTERVAL '90 days';

  -- Si pas assez de données (< 30 tests), retourner NULL
  IF v_total_count < 30 THEN
    RETURN NULL;
  END IF;

  -- Calculer le percentile
  v_percentile := ROUND((v_below_count::NUMERIC / v_total_count) * 100);

  RETURN v_percentile;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_percentile IS 'Calcule le percentile réel d''un score par rapport aux 90 derniers jours';

-- Fonction : Nettoyage automatique des vieilles données (RGPD)
CREATE OR REPLACE FUNCTION delete_old_sessions()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Supprimer les sessions de plus de 2 ans
  DELETE FROM test_sessions
  WHERE completed_at < NOW() - INTERVAL '2 years';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION delete_old_sessions IS 'Supprime les sessions de plus de 2 ans (politique de rétention RGPD)';

-- ============================================
-- Données de démonstration (pour tests)
-- À SUPPRIMER EN PRODUCTION
-- ============================================

-- Insérer quelques sessions de test
INSERT INTO test_sessions (
  version, started_at, completed_at,
  total_score, total_possible, percentage, percentile,
  age_range, education_level, country_code
) VALUES
  ('courte', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '20 minutes', 28.5, 38, 75.0, 75, '26-35', 'Master', 'FR'),
  ('courte', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '18 minutes', 22.8, 38, 60.0, 50, '18-25', 'Licence', 'FR'),
  ('complète', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '52 minutes', 46.5, 55, 84.5, 90, '36-45', 'Doctorat', 'BE'),
  ('courte', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '22 minutes', 19.0, 38, 50.0, 40, '46-60', 'Lycée', 'CH'),
  ('complète', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '48 minutes', 41.25, 55, 75.0, 80, '26-35', 'Master', 'FR');

-- ============================================
-- Vérifications finales
-- ============================================

-- Compter les tables créées
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('test_sessions', 'module_scores', 'question_answers')
ORDER BY tablename;

-- Vérifier les vues
SELECT
  schemaname,
  viewname
FROM pg_views
WHERE schemaname = 'public'
  AND viewname LIKE 'stats_%'
ORDER BY viewname;

-- Afficher les fonctions créées
SELECT
  proname as function_name,
  pg_get_function_arguments(oid) as arguments,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('calculate_percentile', 'delete_old_sessions');

-- ============================================
-- Instructions de déploiement
-- ============================================

/*
1. Dans Vercel Dashboard :
   - Storage → Create Database → Postgres
   - Région : Europe West (Frankfurt)
   - Plan : Hobby (gratuit)

2. Exécuter ce fichier SQL :
   - Via l'interface Vercel : onglet "Query"
   - Copier-coller tout ce fichier
   - Exécuter

3. Vérifier que tout est créé :
   - 3 tables : test_sessions, module_scores, question_answers
   - 3 vues : stats_global_30d, stats_by_module_30d, score_distribution_30d
   - 2 fonctions : calculate_percentile, delete_old_sessions

4. Supprimer les données de démonstration :
   DELETE FROM test_sessions;

5. Tester la connexion depuis Next.js :
   npm install @vercel/postgres

   // Dans un API route :
   import { sql } from '@vercel/postgres';
   const { rows } = await sql`SELECT NOW()`;
   console.log(rows);
*/
