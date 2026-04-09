import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAction, useQuery } from 'convex/react';
import { Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';
import type { Id } from '../../../convex/_generated/dataModel';
import { api } from '../../../convex/_generated/api';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

export interface NextBestActionWidgetProps {
  userId?: Id<'users'>;
  onAction?: () => void;
}

export const NextBestActionWidget: React.FC<NextBestActionWidgetProps> = ({
  userId,
  onAction
}) => {
  const cachedAction = useQuery(api.groq.getCachedNBA, userId ? { userId } : 'skip');
  const generateNextBestAction = useAction(api.groq.generateNextBestAction);
  const [generatedAction, setGeneratedAction] = useState<typeof cachedAction | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (cachedAction) {
      setGeneratedAction(cachedAction);
      hasRequestedRef.current = false;
      setError(null);
      return;
    }

    if (cachedAction !== null || !userId || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    setIsGenerating(true);
    setError(null);

    generateNextBestAction({ userId })
      .then((result) => {
        setGeneratedAction(result);
      })
      .catch((err) => {
        console.error('Failed to generate next best action', err);
        setError('AI planning is unavailable right now.');
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [cachedAction, generateNextBestAction, userId]);

  const handleRefresh = async () => {
    if (!userId || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateNextBestAction({ userId, force: true });
      setGeneratedAction(result);
    } catch (err) {
      console.error('Failed to refresh next best action', err);
      setError('AI planning is unavailable right now.');
    } finally {
      setIsGenerating(false);
    }
  };

  const actionData = generatedAction ?? cachedAction ?? null;

  if (!userId) {
    return (
      <GlassCard className="p-6 border-accent-amber/20 bg-bg-card/90">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-accent-amber" />
          <h3 className="font-space font-bold text-accent-amber tracking-wide uppercase text-sm">
            Next Best Action
          </h3>
        </div>
        <p className="text-text-secondary text-sm">
          Sign in to get a personalized AI plan for your next move.
        </p>
      </GlassCard>
    );
  }

  if ((cachedAction === undefined && generatedAction === null) || (isGenerating && !actionData)) {
    return (
      <motion.div
        animate={{
          borderColor: ['rgba(245,158,11,0.3)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.3)'],
          boxShadow: ['0 0 10px rgba(245,158,11,0.1)', '0 0 20px rgba(245,158,11,0.2)', '0 0 10px rgba(245,158,11,0.1)']
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="rounded-lg"
      >
        <GlassCard className="p-6 border-accent-amber/30 bg-bg-card/90 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-amber/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-accent-amber" />
            <h3 className="font-space font-bold text-accent-amber tracking-wide uppercase text-sm">
              Next Best Action
            </h3>
          </div>

          <div className="animate-pulse bg-white/5 rounded-lg h-24 mb-4" />
          <p className="text-text-secondary text-sm">💡 AI is planning your next move...</p>
        </GlassCard>
      </motion.div>
    );
  }

  if (error && !actionData) {
    return (
      <GlassCard className="p-6 border-accent-amber/20 bg-bg-card/90">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={20} className="text-accent-amber" />
          <h3 className="font-space font-bold text-accent-amber tracking-wide uppercase text-sm">
            Next Best Action
          </h3>
        </div>
        <p className="text-text-secondary text-sm mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="w-full py-2.5 rounded-md bg-accent-amber/10 text-accent-amber font-semibold border border-accent-amber/20 hover:bg-accent-amber/20 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </GlassCard>
    );
  }

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
          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            className="ml-auto inline-flex items-center justify-center rounded-full border border-accent-amber/20 bg-accent-amber/10 p-2 text-accent-amber transition-colors hover:bg-accent-amber/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Refresh next best action"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <p className="text-text-primary text-lg font-medium mb-5 leading-snug">
          {actionData?.action ?? 'Browse a challenge that expands your current stack.'}
        </p>

        <p className="text-text-secondary text-sm mb-5 italic">
          {actionData?.reasoning ?? 'This recommendation is tuned to your current XP momentum.'}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge variant="green">+{actionData?.xpGain ?? 250} XP</Badge>
          {actionData?.rankUnlock && (
            <span className="text-accent-purple text-sm font-medium flex items-center gap-1">
              <ArrowRight size={14} /> Unlocks {actionData.rankUnlock}
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
