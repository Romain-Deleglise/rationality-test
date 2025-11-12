// Créer le fichier : src/app/api/send-results/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, testScore, locale = 'en' } = await request.json();

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
          'Probabilistic Reasoning': 'Your ability to reason with probabilities and avoid classic errors (gambler\'s fallacy, base rate neglect, conjunction error).',
          'Scientific Reasoning': 'Your ability to rigorously test hypotheses, falsify rather than confirm, and distinguish correlation from causation.',
          'Reflection vs Intuition': 'Your ability to inhibit the immediate intuitive response and engage analytical reflection (CRT).',
          'Belief Bias': 'Your ability to evaluate logical validity independently of your beliefs about the conclusion.',
          'Knowledge Calibration': 'Your ability to accurately estimate your level of certainty (avoid overconfidence).',
          'Probabilistic Numeracy': 'Your ability to manipulate numbers in probabilistic contexts and understand statistics.',
          'Superstitious Thinking': 'Your resistance to paranormal/supernatural beliefs and respect for the principle "belief proportional to evidence".',
          'Anti-Science Attitudes': 'Your resistance to rejecting science and the scientific method.',
          'Conspiracy Beliefs': 'Your resistance to conspiracy explanations and ability to apply Occam\'s Razor.',
          'Disjunctive Reasoning': 'Your ability to reason correctly with "OR" statements.',
          'Anchoring': 'Your resistance to anchoring (being too influenced by the first piece of information received).',
          'Dysfunctional Beliefs': 'Your ability to avoid irrational beliefs that cause unnecessary emotional distress.'
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
          'Raisonnement Probabiliste': 'Votre capacité à raisonner avec les probabilités et éviter les erreurs classiques (erreur du parieur, négligence des taux de base, erreur de conjonction).',
          'Raisonnement Scientifique': 'Votre capacité à tester rigoureusement des hypothèses, falsifier plutôt que confirmer, et distinguer corrélation et causation.',
          'Réflexion vs Intuition': 'Votre capacité à inhiber la réponse intuitive immédiate et engager une réflexion analytique (CRT).',
          'Biais de Croyance': 'Votre capacité à évaluer la validité logique indépendamment de vos croyances sur la conclusion.',
          'Calibration des Connaissances': 'Votre capacité à estimer avec précision votre niveau de certitude (éviter l\'overconfidence).',
          'Numératie Probabiliste': 'Votre capacité à manipuler les nombres dans des contextes probabilistes et comprendre les statistiques.',
          'Pensée Superstitieuse': 'Votre résistance aux croyances paranormales/surnaturelles et respect du principe "croyance proportionnée aux preuves".',
          'Attitudes Anti-Science': 'Votre résistance au rejet de la science et de la méthode scientifique.',
          'Croyances Conspirationnistes': 'Votre résistance aux explications complotistes et capacité à appliquer le Rasoir d\'Occam.',
          'Raisonnement Disjonctif': 'Votre capacité à raisonner correctement avec des énoncés "OU".',
          'Ancrage': 'Votre résistance à l\'ancrage (être trop influencé par la première information reçue).',
          'Croyances Dysfonctionnelles': 'Votre capacité à éviter les croyances irrationnelles qui causent de la détresse émotionnelle inutile.'
        }
      }
    };

    const t = translations[locale as keyof typeof translations] || translations.en;

    // Module name mapping FR -> EN
    const moduleNameMapping: Record<string, string> = {
      'Raisonnement Probabiliste': 'Probabilistic Reasoning',
      'Raisonnement Scientifique': 'Scientific Reasoning',
      'Réflexion vs Intuition': 'Reflection vs Intuition',
      'Biais de Croyance': 'Belief Bias',
      'Calibration des Connaissances': 'Knowledge Calibration',
      'Numératie Probabiliste': 'Probabilistic Numeracy',
      'Pensée Superstitieuse': 'Superstitious Thinking',
      'Attitudes Anti-Science': 'Anti-Science Attitudes',
      'Croyances Conspirationnistes': 'Conspiracy Beliefs',
      'Raisonnement Disjonctif': 'Disjunctive Reasoning',
      'Ancrage': 'Anchoring',
      'Croyances Dysfonctionnelles': 'Dysfunctional Beliefs'
    };

    // Helper function to get translated module name
    const getModuleName = (frName: string): string => {
      const cleanName = frName.split(' (')[0];
      return locale === 'en' ? (moduleNameMapping[cleanName] || cleanName) : cleanName;
    };

    // Helper function to get module description
    const getModuleDesc = (frName: string): string => {
      const cleanName = frName.split(' (')[0];
      const translatedName = locale === 'en' ? (moduleNameMapping[cleanName] || cleanName) : cleanName;
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

                  <!-- Header -->
                  <tr>
                    <td style="background-color: #667eea; padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0 0 20px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        🧠 ${t.title}
                      </h1>
                      <div style="background-color: #ffffff; width: 120px; height: 120px; margin: 20px auto; border-radius: 60px; display: table;">
                        <div style="display: table-cell; vertical-align: middle; text-align: center;">
                          <span style="font-size: 36px; font-weight: bold; color: #667eea;">${testScore.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                        ${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} ${t.points}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px 20px;">

                      <!-- Interpretation -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 15px;">
                            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6;">
                              <strong style="color: #92400e;">${t.interpretation}</strong><br><br>
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

                          return `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; margin: 15px 0; border: 1px solid #e5e7eb;">
                              <tr>
                                <td style="padding: 15px;">
                                  <div style="margin-bottom: 8px;">
                                    <strong style="color: #1f2937; font-size: 16px;">${moduleName}</strong>
                                    <span style="float: right; color: ${bgColor}; font-weight: bold; font-size: 16px;">
                                      ${module.percentage.toFixed(0)}%
                                    </span>
                                  </div>
                                  ${desc ? `<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px; font-style: italic; line-height: 1.5;">${desc}</p>` : ''}
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e5e7eb; height: 24px; margin: 8px 0;">
                                    <tr>
                                      <td style="background-color: ${bgColor}; width: ${module.percentage}%; color: #ffffff; text-align: right; padding-right: 8px; font-size: 13px; font-weight: bold;">
                                        ${module.percentage >= 15 ? module.percentage.toFixed(0) + '%' : ''}
                                      </td>
                                      <td style="width: ${100 - module.percentage}%;"></td>
                                    </tr>
                                  </table>
                                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
                                    ${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} ${t.points}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          `;
                        }).join('')}

                      ${testScore.strengths.length > 0 ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d1fae5; border-left: 4px solid #10b981; margin: 25px 0;">
                          <tr>
                            <td style="padding: 15px;">
                              <p style="margin: 0 0 10px 0; color: #065f46; font-weight: bold;">✓ ${t.yourStrengths}:</p>
                              <ul style="margin: 0; padding-left: 20px; color: #1f2937;">
                                ${testScore.strengths.map((s: string) => `<li style="margin: 4px 0;">${getModuleName(s)}</li>`).join('')}
                              </ul>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      ${testScore.weaknesses.length > 0 ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; margin: 25px 0;">
                          <tr>
                            <td style="padding: 15px;">
                              <p style="margin: 0 0 10px 0; color: #991b1b; font-weight: bold;">⚠️ ${t.areasToImprove}:</p>
                              <ul style="margin: 0; padding-left: 20px; color: #1f2937;">
                                ${testScore.weaknesses.map((w: string) => `<li style="margin: 4px 0;">${getModuleName(w)}</li>`).join('')}
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
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${process.env.NEXT_PUBLIC_URL || 'https://rationality-test.com'}/${locale}/resultats"
                               style="display: inline-block; background-color: #667eea; color: #ffffff; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px;">
                              📊 ${t.viewFullResults}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Important Note -->
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #dbeafe; border: 2px solid #3b82f6; margin: 25px 0;">
                        <tr>
                          <td style="padding: 15px;">
                            <p style="margin: 0; color: #1f2937; font-size: 14px; line-height: 1.6;">
                              <strong style="color: #1e40af;">💡 ${t.importantNote}:</strong><br><br>
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
    const data = await resend.emails.send({
      from: `${t.title} <onboarding@resend.dev>`,
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