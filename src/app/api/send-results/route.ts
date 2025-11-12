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

    // Générer le contenu HTML avec design moderne et élégant
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 20px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px 30px; text-align: center; position: relative; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="white" opacity="0.05"/></svg>') repeat; }
            .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); position: relative; }
            .score-circle { width: 140px; height: 140px; margin: 20px auto; background: white; border-radius: 50%; display: flex; align-items: center; justify-center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); position: relative; }
            .score { font-size: 42px; font-weight: 900; color: #667eea; margin: 0; }
            .score-label { font-size: 16px; opacity: 0.95; margin-top: 10px; position: relative; }
            .content { background: #ffffff; padding: 40px 30px; }
            .interpretation { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 5px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1); }
            .interpretation strong { color: #92400e; }
            .section-title { color: #1f2937; margin-top: 40px; margin-bottom: 20px; font-size: 24px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
            .section-title::before { content: ''; width: 4px; height: 24px; background: linear-gradient(180deg, #667eea, #764ba2); border-radius: 2px; }
            .module { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 20px; margin: 20px 0; border-radius: 12px; border: 2px solid transparent; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }
            .module:hover { border-color: #3b82f6; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1); }
            .module-name { font-weight: 800; color: #1f2937; font-size: 18px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
            .module-desc { font-size: 14px; color: #6b7280; margin-bottom: 16px; line-height: 1.6; font-style: italic; }
            .score-bar-container { background: #e5e7eb; height: 32px; border-radius: 16px; overflow: hidden; margin: 12px 0; position: relative; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); }
            .score-fill { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 14px; font-weight: 800; font-size: 15px; color: white; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); transition: width 1s ease; }
            .score-fill.green { background: linear-gradient(90deg, #10b981 0%, #059669 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); }
            .score-fill.blue { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); }
            .score-fill.yellow { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); }
            .score-fill.red { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2); }
            .score-detail { font-size: 13px; color: #6b7280; margin-top: 8px; font-weight: 600; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 18px 40px; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px; margin: 30px 0; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; }
            .cta-button:hover { box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5); transform: translateY(-2px); }
            .footer { text-align: center; padding: 40px; color: #6b7280; font-size: 14px; background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%); border-top: 2px solid #e5e7eb; }
            .tips { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 5px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1); }
            .tips strong { color: #065f46; }
            .warning { background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border-left: 5px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1); }
            .warning strong { color: #991b1b; }
            .info-box { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; margin-top: 30px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
            .info-box strong { color: #1e40af; }
            @media only screen and (max-width: 600px) {
              body { padding: 10px 0; }
              .header h1 { font-size: 26px; }
              .score { font-size: 36px; }
              .content { padding: 25px 20px; }
              .module { padding: 16px; }
              .section-title { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧠 ${t.title}</h1>
              <div class="score-circle">
                <div class="score">${testScore.percentage.toFixed(1)}%</div>
              </div>
              <div class="score-label">${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} ${t.points}</div>
            </div>

            <div class="content">
              <div class="interpretation">
                <strong>${t.interpretation}</strong><br><br>
                ${testScore.interpretation}
              </div>

              <h3 class="section-title">${t.detailByModule}</h3>
              <p style="color: #6b7280; font-size: 15px; margin-bottom: 25px; line-height: 1.7;">
                ${t.performanceDesc}
              </p>

              ${testScore.modules
                .filter((m: any) => m.possible > 0)
                .sort((a: any, b: any) => b.percentage - a.percentage)
                .map((module: any) => {
                  const moduleName = getModuleName(module.moduleName);
                  const desc = getModuleDesc(module.moduleName);
                  const color =
                    module.percentage >= 75 ? 'green' :
                    module.percentage >= 50 ? 'blue' :
                    module.percentage >= 35 ? 'yellow' : 'red';
                  return `
                    <div class="module">
                      <div class="module-name">${moduleName}</div>
                      ${desc ? `<div class="module-desc">${desc}</div>` : ''}
                      <div class="score-bar-container">
                        <div class="score-fill ${color}" style="width: ${module.percentage}%">
                          ${module.percentage.toFixed(0)}%
                        </div>
                      </div>
                      <div class="score-detail">
                        ${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} ${t.points}
                      </div>
                    </div>
                  `;
                }).join('')}

              ${testScore.strengths.length > 0 ? `
                <div class="tips">
                  <strong style="font-weight: 700;">✓ ${t.yourStrengths} :</strong><br>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    ${testScore.strengths.map((s: string) => `<li>${getModuleName(s)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${testScore.weaknesses.length > 0 ? `
                <div class="warning">
                  <strong>⚠️ ${t.areasToImprove}</strong><br>
                  <ul style="margin: 12px 0 0 0; padding-left: 20px; line-height: 1.7;">
                    ${testScore.weaknesses.map((w: string) => `<li style="margin: 6px 0;">${getModuleName(w)}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <h3 class="section-title">${t.nextSteps}</h3>
              <ul style="color: #4b5563; line-height: 2; font-size: 15px; padding-left: 24px;">
                ${t.nextStepsItems.map(item => `<li style="margin: 10px 0;">${item}</li>`).join('')}
              </ul>

              <div style="text-align: center; margin-top: 40px;">
                <a href="${process.env.NEXT_PUBLIC_URL || 'https://rationality-test.com'}/${locale}/resultats" class="cta-button">
                  📊 ${t.viewFullResults}
                </a>
              </div>

              <div class="info-box">
                <p style="margin: 0; font-size: 15px; line-height: 1.7;">
                  <strong>💡 ${t.importantNote}:</strong><br><br>
                  ${t.importantNoteText}
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 8px 0; font-weight: 800; color: #1f2937; font-size: 16px;">🧠 ${t.title}</p>
              <p style="margin: 6px 0; font-size: 13px;">${t.basedOn}</p>
              <p style="margin: 6px 0; font-size: 13px; color: #3b82f6; font-weight: 600;">${t.projectDesc}</p>
              <div style="margin: 25px 0 0 0; padding-top: 20px; border-top: 1px solid #d1d5db;">
                <p style="margin: 0; font-size: 12px; color: #9ca3af; font-style: italic;">
                  ${t.emailReason}
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: `${t.title} <onboarding@resend.dev>`,
      to: [email],
      subject: `${t.emailSubject} (${testScore.percentage.toFixed(1)}%)`,
      html: htmlContent,
      text: textContent, // Version texte brut pour fallback
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