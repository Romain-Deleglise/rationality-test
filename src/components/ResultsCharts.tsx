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
    .map((score) => ({
      module: score.moduleName.split(' (')[0].substring(0, 20), // Tronquer si trop long
      score: score.percentage,
    }));

  return (
    <ResponsiveContainer width="100%" height={450}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="module" 
          tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
          tickLine={false}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
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
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ moduleScores }: ChartProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .map((score) => ({
      module: score.moduleName.split(' (')[0],
      score: score.percentage,
    }));

  const getColor = (score: number) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#3b82f6'; // blue
    if (score >= 35) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart 
        data={data}
        layout="horizontal"
        margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          type="number"
          domain={[0, 100]}
          tick={{ fill: '#6b7280', fontSize: 13 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis 
          type="category"
          dataKey="module" 
          tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
          width={110}
          tickLine={false}
        />
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(1)}%`}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px'
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