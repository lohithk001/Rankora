import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export function ScoreRadarChart({ components }) {
  if (!components) return null;

  const data = [
    { subject: 'Problem-Solving', value: components.problemSolving || 0, fullMark: 100 },
    { subject: 'Engineering Quality', value: components.engineeringQuality || 0, fullMark: 100 },
    { subject: 'Technical Skills', value: components.technicalSkills || 0, fullMark: 100 },
    { subject: 'Collaboration', value: components.collaboration || 0, fullMark: 100 },
    { subject: 'Growth Velocity', value: components.growthConsistency || 0, fullMark: 100 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-white font-semibold">{payload[0].payload.subject}</p>
          <p className="text-cyan-400 font-bold mt-0.5">{payload[0].value} / 100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[260px] flex items-center justify-center min-h-[260px]">
      <ResponsiveContainer width="100%" height={260} minHeight={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            stroke="#475569" 
            tick={{ fill: '#64748B', fontSize: 9 }} 
          />
          <Radar
            name="Demonstrated Index"
            dataKey="value"
            stroke="#6366F1"
            strokeWidth={2}
            fill="#6366F1"
            fillOpacity={0.4}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
