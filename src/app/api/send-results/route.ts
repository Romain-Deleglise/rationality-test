// Créer le fichier : src/app/api/send-results/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, testScore } = await request.json();

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

    // Module descriptions courtes pour l'email
    const moduleDescriptions: Record<string, string> = {
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
    };

    // Générer le contenu texte brut (fallback)
    const textContent = `
Test de Rationalité - Vos Résultats

Score Global: ${testScore.percentage.toFixed(1)}%
${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} points

INTERPRÉTATION:
${testScore.interpretation}

DÉTAIL PAR MODULE:
${testScore.modules
  .filter((m: any) => m.possible > 0)
  .sort((a: any, b: any) => b.percentage - a.percentage)
  .map((module: any) => {
    const name = module.moduleName.split(' (')[0];
    const desc = moduleDescriptions[name] || '';
    return `
${name}: ${module.percentage.toFixed(0)}%
${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} points
${desc}
${'█'.repeat(Math.round(module.percentage / 5))}${'░'.repeat(20 - Math.round(module.percentage / 5))}
`;
  }).join('\n')}

PROCHAINES ÉTAPES:
- Consultez vos résultats détaillés avec explications scientifiques
- Explorez les ressources recommandées pour vos faiblesses spécifiques
- Repassez le test dans 6-12 mois pour mesurer vos progrès réels

---
Test de Rationalité
Basé sur le CART (Stanovich et al., 2016)
Projet open-source et gratuit
    `.trim();

    // Générer le contenu HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; font-weight: 700; }
            .score { font-size: 56px; font-weight: bold; margin: 15px 0; }
            .score-label { font-size: 18px; opacity: 0.95; }
            .content { background: #ffffff; padding: 30px; }
            .interpretation { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
            .module { background: #f9fafb; padding: 16px; margin: 16px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .module-name { font-weight: 700; color: #1f2937; font-size: 16px; margin-bottom: 6px; }
            .module-desc { font-size: 13px; color: #6b7280; margin-bottom: 12px; line-height: 1.5; }
            .score-bar-container { background: #e5e7eb; height: 28px; border-radius: 14px; overflow: hidden; margin: 10px 0; position: relative; }
            .score-fill { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; font-weight: 700; font-size: 14px; color: white; }
            .score-fill.green { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
            .score-fill.blue { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
            .score-fill.yellow { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
            .score-fill.red { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }
            .score-detail { font-size: 13px; color: #6b7280; margin-top: 6px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 24px 0; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); }
            .footer { text-align: center; padding: 30px; color: #6b7280; font-size: 14px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
            .tips { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
            @media only screen and (max-width: 600px) {
              .header h1 { font-size: 24px; }
              .score { font-size: 42px; }
              .content { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧠 Test de Rationalité</h1>
              <div class="score">${testScore.percentage.toFixed(1)}%</div>
              <div class="score-label">${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} points</div>
            </div>

            <div class="content">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 700;">Vos Résultats</h2>

              <div class="interpretation">
                <strong style="font-weight: 700;">Interprétation :</strong><br>
                ${testScore.interpretation}
              </div>

              <h3 style="color: #1f2937; margin-top: 32px; font-size: 20px; font-weight: 700;">Détail par Module</h3>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
                Voici votre performance sur chaque dimension de la pensée rationnelle :
              </p>

              ${testScore.modules
                .filter((m: any) => m.possible > 0)
                .sort((a: any, b: any) => b.percentage - a.percentage)
                .map((module: any) => {
                  const moduleName = module.moduleName.split(' (')[0];
                  const desc = moduleDescriptions[moduleName] || '';
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
                        ${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} points
                      </div>
                    </div>
                  `;
                }).join('')}

              ${testScore.strengths.length > 0 ? `
                <div class="tips">
                  <strong style="font-weight: 700;">✓ Vos Forces :</strong><br>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    ${testScore.strengths.map((s: string) => `<li>${s.split(' (')[0]}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${testScore.weaknesses.length > 0 ? `
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <strong style="font-weight: 700;">⚠ Points à améliorer :</strong><br>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    ${testScore.weaknesses.map((w: string) => `<li>${w.split(' (')[0]}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <h3 style="color: #1f2937; margin-top: 32px; font-size: 20px; font-weight: 700;">Prochaines étapes</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                <li>Consultez vos résultats détaillés avec explications scientifiques complètes</li>
                <li>Découvrez les ressources recommandées pour chaque dimension</li>
                <li>Repassez le test dans 6-12 mois pour mesurer vos progrès réels (pas avant, pour éviter l'effet de mémorisation)</li>
              </ul>

              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_URL || 'https://votre-site.com'}/resultats" class="cta-button">
                  📊 Voir les résultats complets
                </a>
              </div>

              <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;">
                  <strong>💡 Note importante :</strong> Connaître vos biais ne les élimine pas automatiquement.
                  La vraie amélioration vient de l'utilisation de protocoles externes (checklists, consultations, ralentissement décisionnel)
                  plutôt que de la seule prise de conscience.
                </p>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 5px 0; font-weight: 700; color: #1f2937;">Test de Rationalité</p>
              <p style="margin: 5px 0;">Basé sur le CART (Stanovich, West & Toplak, 2016)</p>
              <p style="margin: 5px 0;">Projet open-source et gratuit</p>
              <p style="margin: 20px 0 5px 0; font-size: 12px; color: #9ca3af;">
                Vous recevez cet email car vous avez demandé vos résultats du test de rationalité.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Test de Rationalité <onboarding@resend.dev>',
      to: [email],
      subject: `Vos résultats - Test de Rationalité (${testScore.percentage.toFixed(1)}%)`,
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