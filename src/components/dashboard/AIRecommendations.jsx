import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAction, useQuery } from 'convex/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { api } from '../../../convex/_generated/api';

const PRIORITY_STYLES = {
  high: 'bg-red-500/10 text-red-300 border border-red-500/20',
  medium: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20',
  low: 'bg-white/5 text-text-secondary border border-border-subtle',
};

export const AIRecommendations = ({ userId }) => {
  const navigate = useNavigate();
  const cachedRecommendations = useQuery(
    api.groq.getCachedRecommendations,
    userId ? { userId } : 'skip'
  );
  const generateSkillRecommendations = useAction(api.groq.generateSkillRecommendations);
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (cachedRecommendations) {
      setRecommendations(cachedRecommendations);
      setError(null);
      hasRequestedRef.current = false;
      return;
    }

    if (cachedRecommendations !== null || !userId || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    setIsGenerating(true);
    setError(null);

    generateSkillRecommendations({ userId })
      .then((result) => {
        setRecommendations(result ?? []);
      })
      .catch((err) => {
        console.error('Failed to generate AI recommendations', err);
        setError('AI recommendations unavailable — browse challenges below');
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [cachedRecommendations, generateSkillRecommendations, userId]);

  const handleRetry = async () => {
    if (!userId || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateSkillRecommendations({ userId });
      setRecommendations(result ?? []);
    } catch (err) {
      console.error('Failed to retry AI recommendations', err);
      setError('AI recommendations unavailable — browse challenges below');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!userId) {
    return null;
  }

  const visibleRecommendations =
    cachedRecommendations ??
    recommendations ??
    [];

  const isLoading =
    (cachedRecommendations === undefined && visibleRecommendations.length === 0) ||
    (isGenerating && visibleRecommendations.length === 0);

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-accent-amber" size={20} />
        <h2 className="font-space text-2xl font-bold text-text-primary">AI Recommended for You</h2>
        <span className="text-xs text-text-muted ml-2 border border-border-subtle px-2 py-0.5 rounded-full">Powered by Groq</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">🤖 AI is analyzing your profile...</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white/5 rounded-lg h-24" />
            ))}
          </div>
        </div>
      ) : error && visibleRecommendations.length === 0 ? (
        <GlassCard className="p-6 border-accent-amber/20 bg-accent-amber/5">
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent-amber/10 text-accent-amber font-medium border border-accent-amber/20 hover:bg-accent-amber/20 transition-colors"
          >
            Retry
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleRecommendations.slice(0, 3).map((rec, i) => (
            <motion.div
              key={rec.challengeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 border-accent-amber/30 bg-accent-amber/5 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-space font-bold text-xl text-text-primary group-hover:text-accent-amber transition-colors">
                    {rec.title}
                  </h3>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs uppercase tracking-[0.05em] font-semibold ${PRIORITY_STYLES[rec.priority] ?? PRIORITY_STYLES.low}`}>
                    {rec.priority}
                  </span>
                </div>

                <p className="text-text-secondary text-sm mb-6 flex-grow italic">
                  <span className="not-italic font-medium text-accent-amber block mb-1">Why for you:</span>
                  {rec.reason}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="green">+{rec.xpReward} XP</Badge>
                  <button
                    onClick={() => navigate(`/challenges/${rec.challengeId}`)}
                    className="text-accent-amber font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Try This Challenge <ArrowRight size={16} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
