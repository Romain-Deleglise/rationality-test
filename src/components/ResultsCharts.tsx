'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { ModuleScore } from '@/lib/scoring';

interface ResultsChartsProps {
  moduleScores: ModuleScore[];
}

export function RadarChartComponent({ moduleScores }: ResultsChartsProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .map((module) => ({
      module: module.moduleName.split(' (')[0], // Enlever le "(X items)"
      score: Math.round(module.percentage),
      fullMark: 100,
    }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="module" 
          tick={{ fill: '#4b5563', fontSize: 12 }}
          style={{ fontSize: '12px' }}
        />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.5}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => `${value}%`}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ moduleScores }: ResultsChartsProps) {
  const data = moduleScores
    .filter(m => m.possible > 0)
    .map((module) => ({
      name: module.moduleName.split(' (')[0],
      score: Math.round(module.percentage),
    }))
    .sort((a, b) => b.score - a.score); // Trier par score décroissant

  const getBarColor = (score: number) => {
    if (score >= 75) return '#10b981'; // vert
    if (score >= 50) return '#f59e0b'; // orange
    return '#ef4444'; // rouge
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280' }} />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={180}
          tick={{ fill: '#4b5563', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => `${value}%`}
        />
        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}