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

// Fonction utilitaire pour diviser un texte en plusieurs lignes
function wrapText(text: string, maxLength: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

// Custom tick pour le radar chart avec retour à la ligne
const CustomRadarTick = ({ payload, x, y, textAnchor, ...rest }: any) => {
  const lines = wrapText(payload.value, 20);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={11}
        fontWeight={500}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={0}
            dy={index === 0 ? 0 : 12}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

// Custom tick pour le bar chart avec retour à la ligne
const CustomBarTick = ({ x, y, payload }: any) => {
  const lines = wrapText(payload.value, 25);
  // Calculer l'offset vertical pour centrer le texte multi-lignes
  const lineHeight = 12;
  const totalHeight = lines.length * lineHeight;
  const startOffset = -totalHeight / 2 + lineHeight / 2;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={0}
        textAnchor="end"
        fill="#374151"
        fontSize={11}
        fontWeight={500}
      >
        {lines.map((line, index) => (
          <tspan
            key={index}
            x={-8}
            dy={index === 0 ? startOffset : lineHeight}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function RadarChartComponent({ moduleScores }: ChartProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .map((score) => {
      const name = score.moduleName.split(' (')[0];
      return {
        module: name,
        fullName: name,
        score: score.percentage,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={550}>
      <RadarChart data={data} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
        <PolarGrid stroke="#e5e7eb" strokeWidth={1.5} />
        <PolarAngleAxis
          dataKey="module"
          tick={<CustomRadarTick />}
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
      const name = score.moduleName.split(' (')[0];
      return {
        module: name,
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

  return (
    <ResponsiveContainer width="100%" height={Math.max(500, data.length * 70)}>
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 20, right: 30, left: 200, bottom: 20 }}
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
          tick={<CustomBarTick />}
          width={190}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
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
