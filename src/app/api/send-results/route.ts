// Créer le fichier : src/app/api/send-results/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { translateModuleName } from '@/lib/moduleMapping';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, testScore, locale = 'en', resultToken } = await request.json();

    // Validation
    if (!email || !testScore) {
      return NextResponse.json(
        { error: 'Email et résultats requis' },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Email translations
    const translations = {
      en: {
        title: 'Rationality Test',
        yourResults: 'Your Results',
        points: 'points',
        interpretation: 'Interpretation',
        detailByModule: 'Detail by Module',
        performanceDesc: 'Here is your performance on each dimension of rational thinking:',
        yourStrengths: 'Your Strengths',
        areasToImprove: 'Areas for Improvement',
        nextSteps: 'Next Steps',
        nextStepsItems: [
          'Consult your detailed results with complete scientific explanations',
          'Explore the recommended resources for each dimension',
          'Retake the test in 6-12 months to measure your real progress (not before, to avoid the memorization effect)'
        ],
        viewFullResults: 'View Full Results',
        importantNote: 'Important note:',
        importantNoteText: 'Knowing your biases does not automatically eliminate them. Real improvement comes from using external protocols (checklists, consultations, decision slowdown) rather than from awareness alone.',
        basedOn: 'Based on CART (Stanovich, West & Toplak, 2016)',
        projectDesc: 'Free and open-source project',
        emailReason: 'You are receiving this email because you requested your rationality test results.',
        emailSubject: 'Your Results - Rationality Test',
        moduleDescriptions: {
          'Probabilistic Reasoning': '📊 Measures your ability to reason with probabilities and avoid classic errors like the gambler\'s fallacy (believing past results influence future odds), base rate neglect (ignoring statistical frequencies), and conjunction fallacy (thinking A+B is more likely than A alone). Essential for medical diagnosis, financial decisions, and risk assessment.',
          'Scientific Reasoning': '🔬 Evaluates how rigorously you test hypotheses - seeking to falsify rather than just confirm, understanding the difference between correlation and causation, and designing valid experiments. Critical for distinguishing real effects from coincidence.',
          'Reflection vs Intuition': '🤔 Tests your ability to override intuitive but incorrect responses by engaging analytical thinking (CRT - Cognitive Reflection Test). Measures whether you pause to reflect or rush to the first answer that "feels right".',
          'Belief Bias': '⚖️ Assesses whether you can evaluate logical arguments based solely on their structure, independent of whether you agree with the conclusion. Can you accept that a valid argument might lead to a conclusion you dislike?',
          'Knowledge Calibration': '🎯 Measures how accurately you estimate your own certainty. Are you overconfident (too sure of wrong answers) or well-calibrated (your confidence matches your actual knowledge)?',
          'Probabilistic Numeracy': '🔢 Tests your ability to work with numbers in probabilistic contexts - understanding percentages, frequencies, expected values, and statistical reasoning. Foundation for interpreting medical tests, polls, and research data.',
          'Superstitious Thinking': '🔮 Evaluates your resistance to paranormal/supernatural beliefs and adherence to the principle of "proportional belief" - believing claims in proportion to the evidence supporting them.',
          'Anti-Science Attitudes': '🧪 Measures your trust in the scientific method and scientific institutions. Do you respect evidence-based reasoning even when results contradict intuitions or traditional beliefs?',
          'Conspiracy Beliefs': '🕵️ Tests your resistance to conspiracy thinking and ability to apply Occam\'s Razor (prefer simpler explanations). Can you distinguish between healthy skepticism and unfounded conspiratorial thinking?',
          'Disjunctive Reasoning': '🔀 Evaluates your ability to reason correctly with "OR" statements and disjunctive syllogisms - a fundamental logical skill often misunderstood.',
          'Anchoring': '⚓ Measures how much irrelevant initial information (anchors) influences your subsequent judgments and estimates. Strong anchoring makes you vulnerable to manipulation in negotiations and decision-making.',
          'Dysfunctional Beliefs': '🧠 Assesses tendencies toward irrational beliefs that generate unnecessary anxiety, stress, or emotional suffering (catastrophizing, all-or-nothing thinking, excessive need for approval).'
        }
      },
      fr: {
        title: 'Test de Rationalité',
        yourResults: 'Vos Résultats',
        points: 'points',
        interpretation: 'Interprétation',
        detailByModule: 'Détail par Module',
        performanceDesc: 'Voici votre performance sur chaque dimension de la pensée rationnelle :',
        yourStrengths: 'Vos Forces',
        areasToImprove: 'Points à améliorer',
        nextSteps: 'Prochaines étapes',
        nextStepsItems: [
          'Consultez vos résultats détaillés avec explications scientifiques complètes',
          'Découvrez les ressources recommandées pour chaque dimension',
          'Repassez le test dans 6-12 mois pour mesurer vos progrès réels (pas avant, pour éviter l\'effet de mémorisation)'
        ],
        viewFullResults: 'Voir les résultats complets',
        importantNote: 'Note importante',
        importantNoteText: 'Connaître vos biais ne les élimine pas automatiquement. La vraie amélioration vient de l\'utilisation de protocoles externes (checklists, consultations, ralentissement décisionnel) plutôt que de la seule prise de conscience.',
        basedOn: 'Basé sur le CART (Stanovich, West & Toplak, 2016)',
        projectDesc: 'Projet open-source et gratuit',
        emailReason: 'Vous recevez cet email car vous avez demandé vos résultats du test de rationalité.',
        emailSubject: 'Vos résultats - Test de Rationalité',
        moduleDescriptions: {
          'Raisonnement Probabiliste': '📊 Mesure votre capacité à raisonner avec les probabilités et éviter les erreurs classiques comme l\'erreur du parieur (croire que les résultats passés influencent les chances futures), la négligence des taux de base (ignorer les fréquences statistiques), et l\'erreur de conjonction (penser que A+B est plus probable que A seul). Essentiel pour les diagnostics médicaux, les décisions financières et l\'évaluation des risques.',
          'Raisonnement Scientifique': '🔬 Évalue la rigueur avec laquelle vous testez des hypothèses - chercher à réfuter plutôt que confirmer, comprendre la différence entre corrélation et causation, et concevoir des expériences valides. Critique pour distinguer les effets réels des coïncidences.',
          'Réflexion vs Intuition': '🤔 Teste votre capacité à surmonter les réponses intuitives incorrectes en engageant la pensée analytique (CRT - Test de Réflexion Cognitive). Mesure si vous prenez le temps de réfléchir ou si vous vous précipitez vers la première réponse qui "semble juste".',
          'Biais de Croyance': '⚖️ Évalue si vous pouvez juger les arguments logiques uniquement sur leur structure, indépendamment de votre accord avec la conclusion. Pouvez-vous accepter qu\'un argument valide mène à une conclusion qui vous déplaît ?',
          'Calibration des Connaissances': '🎯 Mesure la précision avec laquelle vous estimez votre propre certitude. Êtes-vous surconfiant (trop sûr de réponses erronées) ou bien calibré (votre confiance correspond à vos connaissances réelles) ?',
          'Numératie Probabiliste': '🔢 Teste votre capacité à manipuler les nombres dans des contextes probabilistes - comprendre les pourcentages, fréquences, valeurs attendues et raisonnement statistique. Base pour interpréter les tests médicaux, sondages et données de recherche.',
          'Pensée Superstitieuse': '🔮 Évalue votre résistance aux croyances paranormales/surnaturelles et votre adhésion au principe de "croyance proportionnelle" - croire aux affirmations proportionnellement aux preuves qui les soutiennent.',
          'Attitudes Anti-Science': '🧪 Mesure votre confiance dans la méthode scientifique et les institutions scientifiques. Respectez-vous le raisonnement basé sur les preuves même quand les résultats contredisent les intuitions ou croyances traditionnelles ?',
          'Croyances Conspirationnistes': '🕵️ Teste votre résistance à la pensée complotiste et votre capacité à appliquer le Rasoir d\'Occam (privilégier les explications simples). Pouvez-vous distinguer scepticisme sain et pensée conspirationniste infondée ?',
          'Raisonnement Disjonctif': '🔀 Évalue votre capacité à raisonner correctement avec les énoncés "OU" et les syllogismes disjonctifs - une compétence logique fondamentale souvent mal comprise.',
          'Ancrage': '⚓ Mesure à quel point des informations initiales non pertinentes (ancres) influencent vos jugements et estimations ultérieurs. Un fort ancrage vous rend vulnérable à la manipulation dans les négociations et prises de décision.',
          'Croyances Dysfonctionnelles': '🧠 Évalue les tendances vers des croyances irrationnelles qui génèrent anxiété, stress ou souffrance émotionnelle inutiles (catastrophisme, pensée tout-ou-rien, besoin excessif d\'approbation).'
        }
      }
    };

    const t = translations[locale as keyof typeof translations] || translations.en;

    // Helper function to get translated module name
    const getModuleName = (frName: string): string => {
      const cleanName = frName.split(' (')[0];
      return translateModuleName(cleanName, locale as 'en' | 'fr');
    };

    // Helper function to get module description
    const getModuleDesc = (frName: string): string => {
      const cleanName = frName.split(' (')[0];
      const translatedName = translateModuleName(cleanName, locale as 'en' | 'fr');
      return t.moduleDescriptions[translatedName as keyof typeof t.moduleDescriptions] || '';
    };

    // Générer le contenu texte brut (fallback)
    const textContent = `
${t.title} - ${t.yourResults}

Score Global: ${testScore.percentage.toFixed(1)}%
${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} ${t.points}

${t.interpretation.toUpperCase()}:
${testScore.interpretation}

${t.detailByModule.toUpperCase()}:
${testScore.modules
  .filter((m: any) => m.possible > 0)
  .sort((a: any, b: any) => b.percentage - a.percentage)
  .map((module: any) => {
    const name = getModuleName(module.moduleName);
    const desc = getModuleDesc(module.moduleName);
    return `
${name}: ${module.percentage.toFixed(0)}%
${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} ${t.points}
${desc}
${'█'.repeat(Math.round(module.percentage / 5))}${'░'.repeat(20 - Math.round(module.percentage / 5))}
`;
  }).join('\n')}

${t.nextSteps.toUpperCase()}:
${t.nextStepsItems.map(item => `- ${item}`).join('\n')}

---
${t.title}
${t.basedOn}
${t.projectDesc}
    `.trim();

    // Générer le contenu HTML SIMPLIFIÉ pour compatibilité email maximale
    const htmlContent = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${t.emailSubject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px;">

                  <!-- Header with Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 20px; text-align: center;">
                      <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        🧠 ${t.title}
                      </h1>
                      <p style="margin: 0 0 25px 0; color: #f3f4f6; font-size: 15px;">
                        ${t.basedOn}
                      </p>
                      <!-- Score Badge -->
                      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                        <tr>
                          <td style="background-color: #ffffff; padding: 25px 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                            <div style="text-align: center;">
                              <div style="font-size: 48px; font-weight: bold; color: #667eea; margin-bottom: 5px;">
                                ${testScore.percentage.toFixed(1)}%
                              </div>
                              <div style="font-size: 14px; color: #6b7280; font-weight: 600;">
                                ${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} ${t.points}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 20px;">

                      <!-- Interpretation -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 5px solid #f59e0b; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.7;">
                              <strong style="color: #92400e; font-size: 16px;">📝 ${t.interpretation}</strong><br><br>
                              ${testScore.interpretation}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Modules Section -->
                      <h2 style="color: #1f2937; font-size: 20px; margin: 30px 0 15px 0; padding-left: 8px; border-left: 4px solid #667eea;">
                        ${t.detailByModule}
                      </h2>
                      <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                        ${t.performanceDesc}
                      </p>

                      ${testScore.modules
                        .filter((m: any) => m.possible > 0)
                        .sort((a: any, b: any) => b.percentage - a.percentage)
                        .map((module: any) => {
                          const moduleName = getModuleName(module.moduleName);
                          const desc = getModuleDesc(module.moduleName);
                          const bgColor =
                            module.percentage >= 75 ? '#10b981' :
                            module.percentage >= 50 ? '#3b82f6' :
                            module.percentage >= 35 ? '#f59e0b' : '#ef4444';
                          const lightBgColor =
                            module.percentage >= 75 ? '#d1fae5' :
                            module.percentage >= 50 ? '#dbeafe' :
                            module.percentage >= 35 ? '#fef3c7' : '#fee2e2';

                          return `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${lightBgColor}; margin: 18px 0; border-radius: 8px; border-left: 5px solid ${bgColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                              <tr>
                                <td style="padding: 18px;">
                                  <!-- Module Header -->
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                                    <tr>
                                      <td style="vertical-align: middle;">
                                        <strong style="color: #1f2937; font-size: 17px;">${moduleName}</strong>
                                      </td>
                                      <td style="text-align: right; vertical-align: middle;">
                                        <span style="background-color: ${bgColor}; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 15px; display: inline-block;">
                                          ${module.percentage.toFixed(0)}%
                                        </span>
                                      </td>
                                    </tr>
                                  </table>

                                  <!-- Description -->
                                  ${desc ? `<p style="margin: 0 0 14px 0; color: #374151; font-size: 13px; line-height: 1.6;">${desc}</p>` : ''}

                                  <!-- Progress Bar -->
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e5e7eb; height: 28px; margin: 10px 0; border-radius: 14px; overflow: hidden;">
                                    <tr>
                                      <td style="background-color: ${bgColor}; width: ${module.percentage}%; color: #ffffff; text-align: right; padding-right: 10px; font-size: 13px; font-weight: bold; border-radius: 14px;">
                                        ${module.percentage >= 20 ? module.percentage.toFixed(0) + '%' : ''}
                                      </td>
                                      <td style="width: ${100 - module.percentage}%;"></td>
                                    </tr>
                                  </table>

                                  <!-- Points -->
                                  <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px; font-weight: 600;">
                                    📊 ${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} ${t.points}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          `;
                        }).join('')}

                      ${testScore.strengths.length > 0 ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 5px solid #10b981; margin: 30px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 12px 0; color: #065f46; font-weight: bold; font-size: 17px;">✓ ${t.yourStrengths}</p>
                              <ul style="margin: 0; padding-left: 25px; color: #1f2937;">
                                ${testScore.strengths.map((s: string) => `<li style="margin: 6px 0; font-size: 14px; line-height: 1.5;"><strong>${getModuleName(s)}</strong></li>`).join('')}
                              </ul>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      ${testScore.weaknesses.length > 0 ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border-left: 5px solid #ef4444; margin: 30px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 12px 0; color: #991b1b; font-weight: bold; font-size: 17px;">⚠️ ${t.areasToImprove}</p>
                              <ul style="margin: 0; padding-left: 25px; color: #1f2937;">
                                ${testScore.weaknesses.map((w: string) => `<li style="margin: 6px 0; font-size: 14px; line-height: 1.5;"><strong>${getModuleName(w)}</strong></li>`).join('')}
                              </ul>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      <!-- Next Steps -->
                      <h2 style="color: #1f2937; font-size: 20px; margin: 30px 0 15px 0; padding-left: 8px; border-left: 4px solid #667eea;">
                        ${t.nextSteps}
                      </h2>
                      <ul style="color: #4b5563; line-height: 1.8; font-size: 14px; padding-left: 20px;">
                        ${t.nextStepsItems.map(item => `<li style="margin: 8px 0;">${item}</li>`).join('')}
                      </ul>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 35px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.NEXT_PUBLIC_URL || 'https://rationality-test.com'}/${locale}/resultats${resultToken ? '/' + resultToken : ''}"
                               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 18px 45px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 30px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                              📊 ${t.viewFullResults}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Important Note -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 8px; margin: 30px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.7;">
                              <strong style="color: #1e40af; font-size: 16px;">💡 ${t.importantNote}</strong><br><br>
                              ${t.importantNoteText}
                            </p>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 2px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; font-weight: bold; color: #1f2937; font-size: 15px;">🧠 ${t.title}</p>
                      <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">${t.basedOn}</p>
                      <p style="margin: 5px 0; font-size: 12px; color: #3b82f6; font-weight: 600;">${t.projectDesc}</p>
                      <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;" />
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; font-style: italic;">
                        ${t.emailReason}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const emailFrom = locale === 'fr'
      ? 'Test de Rationalité <results@rationality-test.com>'
      : 'Rationality Test <results@rationality-test.com>';

    const data = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: `${t.emailSubject} (${testScore.percentage.toFixed(1)}%)`,
      html: htmlContent,
      text: textContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}