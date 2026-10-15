import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function GrowthTrajectoryChart({ data }) {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-mono">
          <p className="text-slate-400 font-sans mb-1 font-semibold">{label}</p>
          <div className="space-y-1">
            <p className="text-cyan-400 font-bold">Overall Score: {payload[0].value}</p>
            {payload[1] && <p className="text-indigo-400">Problem Solving: {payload[1].value}</p>}
            {payload[2] && <p className="text-purple-400">Engineering: {payload[2].value}</p>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[220px] min-h-[220px]">
      <ResponsiveContainer width="100%" height={220} minHeight={180}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="engGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
          <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis domain={['dataMin - 10', 100]} stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#06B6D4" 
            strokeWidth={2.5} 
            fillOpacity={1} 
            fill="url(#scoreGlow)" 
          />
          <Area 
            type="monotone" 
            dataKey="engineering" 
            stroke="#6366F1" 
            strokeWidth={1.5} 
            strokeDasharray="4 4"
            fillOpacity={1} 
            fill="url(#engGlow)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
