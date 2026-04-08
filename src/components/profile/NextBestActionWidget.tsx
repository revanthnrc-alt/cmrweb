import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

export interface NextBestActionWidgetProps {
  action: string;
  xpGain: string;
  rankUnlock?: string;
  onAction?: () => void;
}

export const NextBestActionWidget: React.FC<NextBestActionWidgetProps> = ({
  action,
  xpGain,
  rankUnlock,
  onAction
}) => {
  return (
    <motion.div
      animate={{ 
        borderColor: ['rgba(245,158,11,0.3)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.3)'],
        boxShadow: ['0 0 10px rgba(245,158,11,0.1)', '0 0 20px rgba(245,158,11,0.2)', '0 0 10px rgba(245,158,11,0.1)']
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-lg"
    >
      <GlassCard className="p-6 border-accent-amber/30 bg-bg-card/90 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-amber/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-accent-amber" />
          <h3 className="font-space font-bold text-accent-amber tracking-wide uppercase text-sm">
            Next Best Action
          </h3>
        </div>
        
        <p className="text-text-primary text-lg font-medium mb-5 leading-snug">
          {action}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="green">{xpGain}</Badge>
          {rankUnlock && (
            <span className="text-accent-purple text-sm font-medium flex items-center gap-1">
              <ArrowRight size={14} /> {rankUnlock}
            </span>
          )}
        </div>
        
        <button 
          onClick={onAction}
          className="w-full py-2.5 rounded-md bg-accent-amber/10 text-accent-amber font-semibold border border-accent-amber/20 hover:bg-accent-amber/20 transition-colors flex items-center justify-center gap-2"
        >
          Take Action <ArrowRight size={16} />
        </button>
      </GlassCard>
    </motion.div>
  );
};
