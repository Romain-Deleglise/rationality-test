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
import { translateModuleName } from '@/lib/moduleMapping';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ChartProps {
  moduleScores: ModuleScore[];
  locale?: string;
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
const CustomRadarTick = ({ payload, x, y, textAnchor, isDark, ...rest }: any) => {
  const lines = wrapText(payload.value, 20);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        textAnchor={textAnchor}
        fill={isDark ? "#d1d5db" : "#374151"}
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
const CustomBarTick = ({ x, y, payload, isDark }: any) => {
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
        fill={isDark ? "#d1d5db" : "#374151"}
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

export function RadarChartComponent({ moduleScores, locale = 'fr' }: ChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  const data = moduleScores
    .filter(m => m.possible > 0)
    .map((score) => {
      const rawName = score.moduleName.split(' (')[0];
      const translatedName = translateModuleName(rawName, locale as 'en' | 'fr');
      return {
        module: translatedName,
        fullName: translatedName,
        score: score.percentage,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={550}>
      <RadarChart data={data} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
        <PolarGrid stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth={1.5} />
        <PolarAngleAxis
          dataKey="module"
          tick={<CustomRadarTick isDark={isDark} />}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke={isDark ? "#60a5fa" : "#2563eb"}
          fill={isDark ? "#3b82f6" : "#3b82f6"}
          fillOpacity={isDark ? 0.3 : 0.5}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
          contentStyle={{
            backgroundColor: isDark ? '#1f2937' : '#fff',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            color: isDark ? '#f3f4f6' : '#111827'
          }}
          labelStyle={{
            color: isDark ? '#f3f4f6' : '#111827',
            fontWeight: 600
          }}
          itemStyle={{
            color: isDark ? '#f3f4f6' : '#111827'
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarChartComponent({ moduleScores, locale = 'fr' }: ChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = mounted && theme === 'dark';

  const data = moduleScores
    .filter(m => m.possible > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .map((score) => {
      const rawName = score.moduleName.split(' (')[0];
      const translatedName = translateModuleName(rawName, locale as 'en' | 'fr');
      return {
        module: translatedName,
        fullName: translatedName,
        score: score.percentage,
      };
    });

  const getColor = (score: number) => {
    if (score >= 75) return '#10b981'; // green
    if (score >= 50) return '#3b82f6'; // blue
    if (score >= 35) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Ajuster les marges selon la taille d'écran
  const chartMargin = isMobile
    ? { top: 20, right: 20, left: 10, bottom: 20 }
    : { top: 20, right: 30, left: 200, bottom: 20 };

  const yAxisWidth = isMobile ? 0 : 190;

  return (
    <ResponsiveContainer width="100%" height={Math.max(500, data.length * 70)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={chartMargin}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="module"
          tick={isMobile ? false : <CustomBarTick isDark={isDark} />}
          width={yAxisWidth}
          tickLine={false}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
          contentStyle={{
            backgroundColor: isDark ? '#1f2937' : '#fff',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            padding: '8px 12px',
            color: isDark ? '#f3f4f6' : '#111827'
          }}
          labelStyle={{
            color: isDark ? '#f3f4f6' : '#111827',
            fontWeight: 600
          }}
          itemStyle={{
            color: isDark ? '#f3f4f6' : '#111827'
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
