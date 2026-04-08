import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export interface SkillData {
  skill: string;
  value: number;
}

export interface SkillRadarProps {
  data: SkillData[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} 
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="var(--accent-cyan)"
            strokeWidth={2}
            fill="var(--accent-cyan)"
            fillOpacity={0.2}
            dot={{ r: 3, fill: 'var(--accent-cyan)', strokeWidth: 0 }}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
