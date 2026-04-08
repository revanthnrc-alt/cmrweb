import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/cn';

export type RankTier = 'Newbie' | 'Learner' | 'Builder' | 'Expert' | 'Elite' | 'Legend';

export interface RankBadgeProps {
  rank: RankTier;
  xp: number;
  nextRankXP?: number;
  showProgress?: boolean;
  className?: string;
}

const rankConfig: Record<RankTier, { color: string; icon: string; bg: string }> = {
  Newbie: { color: 'text-text-secondary', icon: '🌱', bg: 'bg-text-muted/20' },
  Learner: { color: 'text-blue-400', icon: '📖', bg: 'bg-blue-500/20' },
  Builder: { color: 'text-accent-green', icon: '🔨', bg: 'bg-accent-green/20' },
  Expert: { color: 'text-accent-purple', icon: '🔮', bg: 'bg-accent-purple/20' },
  Elite: { color: 'text-accent-amber', icon: '⚡', bg: 'bg-accent-amber/20' },
  Legend: { color: 'text-accent-cyan', icon: '👑', bg: 'bg-gradient-to-r from-accent-cyan/20 to-accent-amber/20' },
};

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  xp,
  nextRankXP,
  showProgress = true,
  className
}) => {
  const config = rankConfig[rank];
  const progress = nextRankXP ? Math.min(100, Math.max(0, (xp / nextRankXP) * 100)) : 100;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-4">
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative overflow-hidden", config.bg)}>
          {rank === 'Legend' && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          <span className="relative z-10">{config.icon}</span>
        </div>
        
        <div>
          <h3 className={cn("font-space text-2xl font-bold tracking-wide uppercase", config.color)}>
            {rank}
          </h3>
          <p className="text-text-secondary font-medium">
            {xp.toLocaleString()} XP
          </p>
        </div>
      </div>

      {showProgress && nextRankXP && (
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-text-secondary">
            <span>Progress to next rank</span>
            <span>{nextRankXP.toLocaleString()} XP</span>
          </div>
          <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-border-subtle">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", 
                rank === 'Legend' ? 'bg-gradient-to-r from-accent-cyan to-accent-amber' : 'bg-current'
              )}
              style={{ color: `var(--${config.color.replace('text-', '')})` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
