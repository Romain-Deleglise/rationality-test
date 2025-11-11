import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client pour le browser (utilise la clé anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface TestResult {
  id?: string;
  created_at?: string;
  result_token: string;
  email?: string;
  test_version: 'courte' | 'complète';
  total_points: number;
  total_possible: number;
  percentage: number;
  module_scores: any; // JSON
  answers?: any; // JSON optionnel
  user_agent?: string;
  country_code?: string;
}

// Fonction pour générer un token unique
export function generateResultToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Fonction pour sauvegarder un résultat
export async function saveTestResult(result: Omit<TestResult, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('test_results')
    .insert([result])
    .select()
    .single();

  if (error) {
    console.error('Error saving test result:', error);
    throw error;
  }

  return data;
}

// Fonction pour récupérer un résultat par token
export async function getTestResultByToken(token: string) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('result_token', token)
    .single();

  if (error) {
    console.error('Error fetching test result:', error);
    return null;
  }

  return data;
}

// Fonction pour calculer le vrai percentile basé sur tous les résultats
export async function calculateRealPercentile(
  percentage: number,
  testVersion: 'courte' | 'complète'
): Promise<number> {
  // Compter combien de résultats sont inférieurs à ce score
  const { count: lowerCount, error: lowerError } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
    .eq('test_version', testVersion)
    .lt('percentage', percentage);

  // Compter le total de résultats pour cette version
  const { count: totalCount, error: totalError } = await supabase
    .from('test_results')
    .select('*', { count: 'exact', head: true })
    .eq('test_version', testVersion);

  if (lowerError || totalError || !totalCount || totalCount === 0) {
    return 50; // Valeur par défaut si erreur ou pas assez de données
  }

  // Calculer le percentile
  const percentile = Math.round((lowerCount! / totalCount) * 100);
  return percentile;
}

// Fonction pour obtenir les statistiques globales
export async function getGlobalStats(testVersion: 'courte' | 'complète') {
  const { data, error } = await supabase
    .from('test_results')
    .select('percentage')
    .eq('test_version', testVersion);

  if (error || !data || data.length === 0) {
    return null;
  }

  const percentages = data.map(r => r.percentage).sort((a, b) => a - b);
  const count = percentages.length;

  return {
    count,
    average: percentages.reduce((a, b) => a + b, 0) / count,
    median: percentages[Math.floor(count / 2)],
    p25: percentages[Math.floor(count * 0.25)],
    p75: percentages[Math.floor(count * 0.75)],
    min: percentages[0],
    max: percentages[count - 1],
  };
}
