import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, testScore } = await request.json();

    // Validation basique
    if (!email || !testScore) {
      return NextResponse.json(
        { error: 'Email et résultats requis' },
        { status: 400 }
      );
    }

    // Générer le contenu HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .score { font-size: 48px; font-weight: bold; margin: 10px 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .module { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .module-name { font-weight: bold; color: #1f2937; }
            .score-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 5px 0; }
            .score-fill { height: 100%; background: #3b82f6; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            a { color: #3b82f6; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vos Résultats - Test de Rationalité</h1>
              <div class="score">${testScore.percentage.toFixed(1)}%</div>
              <p>${testScore.totalEarned.toFixed(1)} / ${testScore.totalPossible.toFixed(1)} points</p>
            </div>
            
            <div class="content">
              <h2>Interprétation</h2>
              <p>${testScore.interpretation}</p>
              
              <h2>Détail par Module</h2>
              ${testScore.modules
                .filter((m: any) => m.possible > 0)
                .map((module: any) => `
                  <div class="module">
                    <div class="module-name">${module.moduleName.split(' (')[0]}</div>
                    <div class="score-bar">
                      <div class="score-fill" style="width: ${module.percentage}%"></div>
                    </div>
                    <p>${module.percentage.toFixed(0)}% (${module.earned.toFixed(1)}/${module.possible.toFixed(1)} points)</p>
                  </div>
                `).join('')}
              
              <h2>Prochaines étapes</h2>
              <ul>
                <li>Consultez vos résultats complets sur le site</li>
                <li>Explorez les ressources recommandées pour vos faiblesses</li>
                <li>Repassez le test dans 6-12 mois pour mesurer vos progrès</li>
              </ul>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://rationality-test.com/resultats" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                  Voir les résultats complets
                </a>
              </p>
            </div>
            
            <div class="footer">
              <p>Ce test est un projet open-source et gratuit.</p>
              <p>Basé sur le CART (Stanovich et al., 2016)</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email
    const data = await resend.emails.send({
      from: 'Test de Rationalité <onboarding@resend.dev>', // Change ça quand tu auras un domaine
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