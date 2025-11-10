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
      module: module.moduleName.split(' (')[0].substring(0, 18), // Limiter à 18 caractères
      score: Math.round(module.percentage),
      fullMark: 100,
    }));

  return (
    <ResponsiveContainer width="100%" height={450}>
      <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
          dataKey="module" 
          tick={{ fill: '#4b5563', fontSize: 10 }}
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
      name: module.moduleName.split(' (')[0].substring(0, 20), // Limiter la longueur
      score: Math.round(module.percentage),
    }))
    .sort((a, b) => b.score - a.score);

  const getBarColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: '#4b5563', fontSize: 11 }}
        />
        <YAxis 
          domain={[0, 100]}
          tick={{ fill: '#6b7280' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => `${value}%`}
        />
        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}