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

    // Générer le contenu HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .score { font-size: 56px; font-weight: bold; margin: 15px 0; }
            .score-label { font-size: 18px; opacity: 0.95; }
            .content { background: #ffffff; padding: 30px; }
            .interpretation { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .module { background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .module-name { font-weight: bold; color: #1f2937; margin-bottom: 8px; }
            .score-bar { background: #e5e7eb; height: 24px; border-radius: 12px; overflow: hidden; margin: 8px 0; position: relative; }
            .score-fill { height: 100%; transition: width 0.3s ease; }
            .score-fill.green { background: #10b981; }
            .score-fill.blue { background: #3b82f6; }
            .score-fill.yellow { background: #f59e0b; }
            .score-fill.red { background: #ef4444; }
            .score-text { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-weight: bold; color: #1f2937; font-size: 14px; }
            .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 30px; color: #6b7280; font-size: 14px; background: #f9fafb; }
            .tips { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
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
              <h2 style="color: #1f2937; margin-top: 0;">Vos Résultats</h2>
              
              <div class="interpretation">
                <strong>Interprétation :</strong><br>
                ${testScore.interpretation}
              </div>
              
              <h3 style="color: #1f2937; margin-top: 30px;">Détail par Module</h3>
              ${testScore.modules
                .filter((m: any) => m.possible > 0)
                .sort((a: any, b: any) => b.percentage - a.percentage)
                .map((module: any) => {
                  const color = 
                    module.percentage >= 75 ? 'green' :
                    module.percentage >= 50 ? 'blue' :
                    module.percentage >= 35 ? 'yellow' : 'red';
                  return `
                    <div class="module">
                      <div class="module-name">${module.moduleName.split(' (')[0]}</div>
                      <div class="score-bar">
                        <div class="score-fill ${color}" style="width: ${module.percentage}%"></div>
                        <div class="score-text">${module.percentage.toFixed(0)}%</div>
                      </div>
                      <div style="font-size: 13px; color: #6b7280; margin-top: 5px;">
                        ${module.earned.toFixed(1)} / ${module.possible.toFixed(1)} points
                      </div>
                    </div>
                  `;
                }).join('')}
              
              ${testScore.strengths.length > 0 ? `
                <div class="tips">
                  <strong>✓ Vos Forces :</strong><br>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    ${testScore.strengths.map((s: string) => `<li>${s.split(' (')[0]}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${testScore.weaknesses.length > 0 ? `
                <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <strong>⚠ Points à améliorer :</strong><br>
                  <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    ${testScore.weaknesses.map((w: string) => `<li>${w.split(' (')[0]}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              <h3 style="color: #1f2937; margin-top: 30px;">Prochaines étapes</h3>
              <ul>
                <li>Consultez vos résultats détaillés avec explications scientifiques</li>
                <li>Explorez les ressources recommandées pour vos faiblesses spécifiques</li>
                <li>Repassez le test dans 6-12 mois pour mesurer vos progrès réels</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="https://votre-domaine.com/resultats" class="cta-button">
                  📊 Voir les résultats complets
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 5px 0;"><strong>Test de Rationalité</strong></p>
              <p style="margin: 5px 0;">Basé sur le CART (Stanovich et al., 2016)</p>
              <p style="margin: 5px 0;">Projet open-source et gratuit</p>
              <p style="margin: 15px 0 5px 0; font-size: 12px; color: #9ca3af;">
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