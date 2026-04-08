import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface XPData {
  month: string;
  xp: number;
}

export interface XPLineChartProps {
  data: XPData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-card/90 border border-border-subtle backdrop-blur-md p-3 rounded-lg shadow-xl">
        <p className="text-text-secondary text-xs font-medium mb-1">{label}</p>
        <p className="text-accent-cyan font-space text-lg font-bold">
          {payload[0].value.toLocaleString()} XP
        </p>
      </div>
    );
  }
  return null;
};

export const XPLineChart: React.FC<XPLineChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            dx={-10}
            label={{ value: 'XP', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line 
            type="monotone" 
            dataKey="xp" 
            stroke="var(--accent-cyan)" 
            strokeWidth={3}
            dot={{ fill: 'var(--accent-amber)', strokeWidth: 2, r: 4, stroke: 'var(--bg-card)' }}
            activeDot={{ fill: 'var(--accent-amber)', strokeWidth: 0, r: 6 }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
