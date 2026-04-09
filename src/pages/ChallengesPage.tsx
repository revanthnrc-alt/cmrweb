import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'convex/react';
import { Code2, Database, Layout, Brain, Zap, Filter, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AIRecommendations } from '../components/dashboard/AIRecommendations';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { api } from '../../convex/_generated/api';

const CATEGORIES = ['All', 'UI/UX', 'Full-Stack', 'Backend', 'Algorithms', 'AI/ML'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
type SortOption = 'Latest' | 'Most XP' | 'Fewest Submissions';

const CategoryIcon = ({ category, className, size }: { category: string; className?: string; size?: number }) => {
  switch (category) {
    case 'UI/UX': return <Layout className={className} size={size} />;
    case 'Full-Stack': return <Layout className={className} size={size} />;
    case 'Backend': return <Database className={className} size={size} />;
    case 'AI/ML': return <Brain className={className} size={size} />;
    case 'Algorithms': return <Code2 className={className} size={size} />;
    default: return <Code2 className={className} size={size} />;
  }
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  switch (difficulty) {
    case 'Easy': return <Badge variant="green">Easy</Badge>;
    case 'Medium': return <Badge variant="amber">Medium</Badge>;
    case 'Hard': return <Badge variant="cyan">Hard</Badge>;
    default: return <Badge variant="gray">{difficulty}</Badge>;
  }
};

export const ChallengesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Latest');
  const { user: currentUser } = useCurrentUser();
  const challenges = useQuery(api.challenges.getAllChallenges);

  const filteredChallenges = useMemo(() => {
    if (!challenges) return [];

    const result = challenges
      .filter((challenge) => activeCategory === 'All' || challenge.category === activeCategory)
      .filter((challenge) => activeDifficulty === 'All' || challenge.difficulty === activeDifficulty)
      .map((challenge) => ({
        ...challenge,
        participants: 0,
        timeLimit: `${challenge.timeLimitDays}d`,
        status: 'Not Started' as const,
      }));

    result.sort((a, b) => {
      if (sortBy === 'Most XP') return b.xpReward - a.xpReward;
      if (sortBy === 'Fewest Submissions') return a.participants - b.participants;
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [activeCategory, activeDifficulty, challenges, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12 space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          Engineering <span className="text-accent-cyan">Challenges</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Take on real-world problems, submit your solutions, and climb the global leaderboard.
        </p>
      </div>

      <AIRecommendations userId={currentUser?._id} />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-border-subtle">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                activeCategory === cat
                  ? 'bg-accent-cyan/10 border-accent-cyan text-accent-cyan'
                  : 'bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-muted" />
            <select
              value={activeDifficulty}
              onChange={(e) => setActiveDifficulty(e.target.value)}
              className="bg-bg-base border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              {DIFFICULTIES.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty} Difficulty</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-bg-base border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              {(['Latest', 'Most XP', 'Fewest Submissions'] as SortOption[]).map((option) => <option key={option} value={option}>Sort: {option}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges === undefined
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-white/5 rounded-lg h-24" />
            ))
          : (
            <AnimatePresence mode="popLayout">
              {filteredChallenges.map((challenge) => (
                <motion.div
                  layout
                  key={String(challenge._id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard hover className="h-full flex flex-col p-6 relative overflow-hidden group">
                    {challenge.status === 'Completed' && (
                      <div className="absolute top-0 right-0 bg-accent-green text-bg-base text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <CheckCircle2 size={12} /> Completed
                      </div>
                    )}
                    {challenge.status === 'In Progress' && (
                      <div className="absolute top-0 right-0 bg-accent-amber text-bg-base text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                        <Zap size={12} /> In Progress
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary group-hover:text-accent-cyan group-hover:border-accent-cyan/50 transition-colors">
                          <CategoryIcon category={challenge.category} size={20} />
                        </div>
                        <Badge variant={
                          challenge.category === 'UI/UX' ? 'purple' :
                            challenge.category === 'Backend' ? 'amber' :
                              challenge.category === 'AI/ML' ? 'cyan' : 'gray'
                        }>
                          {challenge.category}
                        </Badge>
                      </div>
                      <DifficultyBadge difficulty={challenge.difficulty} />
                    </div>

                    <h3 className="font-space text-2xl font-bold text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
                      {challenge.title}
                    </h3>

                    <p className="text-text-secondary text-sm mb-6 flex-grow line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-text-muted uppercase font-medium">Reward</span>
                          <span className="text-accent-green font-space font-bold">+{challenge.xpReward} XP</span>
                        </div>
                        <div className="flex flex-col border-l border-border-subtle pl-4">
                          <span className="text-xs text-text-muted uppercase font-medium">Time</span>
                          <span className="text-text-primary font-medium">{challenge.timeLimit}</span>
                        </div>
                        <div className="flex flex-col border-l border-border-subtle pl-4 hidden sm:flex">
                          <span className="text-xs text-text-muted uppercase font-medium">Subs</span>
                          <span className="text-text-primary font-medium">{challenge.participants}</span>
                        </div>
                      </div>

                      <Link
                        to={`/challenges/${String(challenge._id)}`}
                        className={cn(
                          'px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2',
                          challenge.status === 'Completed'
                            ? 'bg-bg-surface text-text-muted hover:text-text-primary border border-border-subtle'
                            : 'bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20'
                        )}
                      >
                        {challenge.status === 'Completed' ? 'Review' : 'Solve Challenge'}
                        {challenge.status !== 'Completed' && <ArrowRight size={16} />}
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
      </div>

      {challenges !== undefined && filteredChallenges.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No challenges found matching your criteria.
        </div>
      )}
    </div>
  );
};
