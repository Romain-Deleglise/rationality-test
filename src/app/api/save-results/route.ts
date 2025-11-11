import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route pour sauvegarder les résultats d'un test de rationalité
 *
 * POST /api/save-results
 *
 * Body :
 * {
 *   session: TestSession,
 *   testScore: TestScore,
 *   modules: Module[],
 *   demographics?: {
 *     ageRange?: string,
 *     educationLevel?: string,
 *     countryCode?: string
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testScore, session, modules, demographics } = body;

    // Validation basique
    if (!testScore || !session || !modules) {
      return NextResponse.json(
        { error: 'Missing required fields: testScore, session, modules' },
        { status: 400 }
      );
    }

    // Déterminer la version du test
    const version = modules.length > 6 ? 'complète' : 'courte';

    // 1. Insérer la session de test
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
        ${version},
        ${new Date(session.startedAt).toISOString()},
        ${new Date(session.completedAt).toISOString()},
        ${testScore.totalEarned},
        ${testScore.totalPossible},
        ${testScore.percentage},
        ${testScore.percentile || null},
        ${demographics?.ageRange || null},
        ${demographics?.educationLevel || null},
        ${demographics?.countryCode || null},
        ${request.headers.get('user-agent') || 'Unknown'}
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

    // 3. (Optionnel) Insérer les réponses individuelles
    // Commenté par défaut pour économiser de l'espace
    /*
    if (session.answers && session.answers.length > 0) {
      for (const answer of session.answers) {
        // Trouver la question correspondante
        const question = modules
          .flatMap(m => m.questions)
          .find(q => q.id === answer.questionId);

        if (question) {
          const questionScore = testScore.modules
            .flatMap(m => m.questions)
            .find(qs => qs.questionId === answer.questionId);

          await sql`
            INSERT INTO question_answers (
              session_id,
              module_id,
              question_id,
              question_type,
              user_answer,
              correct_answer,
              is_correct,
              score,
              max_score
            ) VALUES (
              ${sessionId},
              ${modules.find(m => m.questions.some(q => q.id === question.id))?.id},
              ${question.id},
              ${question.type},
              ${JSON.stringify(answer.value)},
              ${JSON.stringify(question.correct)},
              ${questionScore?.correct || false},
              ${questionScore?.earned || 0},
              ${questionScore?.possible || 0}
            )
          `;
        }
      }
    }
    */

    // 4. Calculer le percentile réel (si assez de données)
    try {
      const { rows: percentileRows } = await sql`
        SELECT calculate_percentile(${testScore.percentage}, ${version}) as real_percentile
      `;

      const realPercentile = percentileRows[0]?.real_percentile;

      // Mettre à jour le percentile si disponible
      if (realPercentile !== null) {
        await sql`
          UPDATE test_sessions
          SET percentile = ${realPercentile}
          WHERE id = ${sessionId}
        `;
      }
    } catch (percentileError) {
      // Ignorer silencieusement les erreurs de calcul de percentile
      console.warn('Could not calculate real percentile:', percentileError);
    }

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Test results saved successfully',
    });

  } catch (error) {
    console.error('Error saving test results:', error);

    // Log plus détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to save test results',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/save-results
 * Retourne les statistiques de base
 */
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT
        COUNT(*) as total_tests,
        COUNT(CASE WHEN version = 'courte' THEN 1 END) as tests_courts,
        COUNT(CASE WHEN version = 'complète' THEN 1 END) as tests_complets,
        AVG(percentage) as avg_score
      FROM test_sessions
      WHERE completed_at >= NOW() - INTERVAL '30 days'
    `;

    return NextResponse.json({
      stats: rows[0],
      period: 'Last 30 days',
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
