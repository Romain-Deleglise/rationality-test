import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Test de Rationalité - Évaluez votre pensée critique';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 20 }}>🧠</div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          Test de Rationalité
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 'normal',
            textAlign: 'center',
            opacity: 0.9,
            maxWidth: '900px',
          }}
        >
          Évaluez votre pensée critique et vos compétences de raisonnement
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 'normal',
            marginTop: 30,
            opacity: 0.8,
          }}
        >
          Gratuit • Scientifique • Open Source
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
