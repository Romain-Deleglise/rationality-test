// Remplacer src/components/ResultsCharts.tsx

'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { ModuleScore } from '@/lib/scoring';

interface ChartProps {
  moduleScores: ModuleScore[];
}

export function RadarChartComponent({ moduleScores }: ChartProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .map((score) => {
      // Raccourcir les noms pour éviter le chevauchement
      const name = score.moduleName.split(' (')[0];
      const shortName = name.length > 18 ? name.substring(0, 15) + '...' : name;
      return {
        module: shortName,
        fullName: name,
        score: score.percentage,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#e5e7eb" strokeWidth={1.5} />
        <PolarAngleAxis
          dataKey="module"
          tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.5}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ moduleScores }: ChartProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .map((score) => {
      // Raccourcir les noms pour l'affichage
      const name = score.moduleName.split(' (')[0];
      const shortName = name.length > 22 ? name.substring(0, 19) + '...' : name;
      return {
        module: shortName,
        fullName: name,
        score: score.percentage,
      };
    });

  const getColor = (score: number) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#3b82f6'; // blue
    if (score >= 35) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Calculer la marge gauche dynamiquement selon la longueur des labels
  const maxLabelLength = Math.max(...data.map(d => d.module.length));
  const leftMargin = Math.min(180, Math.max(120, maxLabelLength * 7));

  return (
    <ResponsiveContainer width="100%" height={Math.max(400, data.length * 60)}>
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 20, right: 30, left: leftMargin, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="module"
          tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
          width={leftMargin - 30}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number, name: string, props: any) => [
            `${value.toFixed(1)}%`,
            props.payload.fullName || 'Score'
          ]}
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            padding: '8px 12px'
          }}
        />
        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
