/**
 * Script de diagnostic pour l'envoi d'emails
 *
 * Ce script teste l'API /api/send-results
 *
 * Usage: node debug-email.js
 */

const testScore = {
  totalEarned: 25.5,
  totalPossible: 35,
  percentage: 72.86,
  interpretation: "Bon score général avec quelques points d'amélioration.",
  modules: [
    {
      moduleName: "Raisonnement Probabiliste",
      earned: 8.5,
      possible: 10,
      percentage: 85
    },
    {
      moduleName: "Raisonnement Scientifique",
      earned: 6.0,
      possible: 8,
      percentage: 75
    }
  ],
  strengths: ["Raisonnement Probabiliste"],
  weaknesses: []
};

async function testEmailAPI() {
  console.log('🧪 Test de l\'API d\'envoi d\'emails\n');

  const testEmail = 'test@example.com';
  const testLocale = 'fr';
  const testResultToken = 'test-token-123';

  const payload = {
    email: testEmail,
    testScore,
    locale: testLocale,
    resultToken: testResultToken
  };

  console.log('📤 Payload envoyé:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('\n');

  try {
    // Vérifier si on a NEXT_PUBLIC_URL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    console.log(`🌐 URL de base: ${baseUrl}`);

    const response = await fetch(`${baseUrl}/api/send-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`\n📊 Status: ${response.status} ${response.statusText}`);

    const responseData = await response.json();
    console.log('\n📥 Réponse:');
    console.log(JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ EMAIL ENVOYÉ AVEC SUCCÈS!');
    } else {
      console.log('\n❌ ERREUR lors de l\'envoi');
      if (responseData.error) {
        console.log(`Erreur: ${responseData.error}`);
      }
    }

  } catch (error) {
    console.error('\n💥 ERREUR CRITIQUE:');
    console.error(error);

    if (error.message.includes('fetch')) {
      console.log('\n⚠️  Impossible de se connecter à l\'API.');
      console.log('Vérifiez que:');
      console.log('  1. Le serveur Next.js est démarré (npm run dev)');
      console.log('  2. La variable NEXT_PUBLIC_URL est correcte');
    }
  }
}

// Vérifications préliminaires
console.log('🔍 VÉRIFICATIONS PRÉLIMINAIRES\n');

const checks = [
  {
    name: 'RESEND_API_KEY',
    value: process.env.RESEND_API_KEY,
    required: true
  },
  {
    name: 'NEXT_PUBLIC_URL',
    value: process.env.NEXT_PUBLIC_URL,
    required: false,
    default: 'http://localhost:3000'
  }
];

let hasErrors = false;

checks.forEach(check => {
  const status = check.value ? '✅' : (check.required ? '❌' : '⚠️ ');
  const value = check.value ? (check.name.includes('KEY') ? '***' : check.value) : (check.default || 'NON DÉFINIE');
  console.log(`${status} ${check.name}: ${value}`);

  if (check.required && !check.value) {
    hasErrors = true;
    console.log(`   ⛔ Cette variable est OBLIGATOIRE!`);
  }
});

console.log('\n');

if (hasErrors) {
  console.log('❌ ERREURS DE CONFIGURATION DÉTECTÉES\n');
  console.log('Les variables d\'environnement manquantes doivent être définies dans .env.local');
  console.log('\nExemple de .env.local:');
  console.log('RESEND_API_KEY=re_...');
  console.log('NEXT_PUBLIC_URL=https://rationality-test.com');
  process.exit(1);
}

// Lancer le test
testEmailAPI();
