import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Database, Layout, Brain, Zap, Filter, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/cn';

// MOCK DATA
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'UI/UX' | 'Full-Stack' | 'Backend' | 'Algorithms' | 'AI/ML';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  participants: number;
  timeLimit: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Build a Distributed Cache', description: 'Implement a distributed LRU cache in Go or Rust with gRPC communication.', category: 'Backend', difficulty: 'Hard', xpReward: 500, participants: 12, timeLimit: '48h', status: 'Not Started' },
  { id: 'c2', title: 'React Performance Audit', description: 'Optimize a provided React codebase to achieve 100 on Lighthouse.', category: 'Full-Stack', difficulty: 'Medium', xpReward: 250, participants: 45, timeLimit: '24h', status: 'In Progress' },
  { id: 'c3', title: 'Design System Setup', description: 'Create a comprehensive Figma design system with tokens and components.', category: 'UI/UX', difficulty: 'Medium', xpReward: 200, participants: 28, timeLimit: '24h', status: 'Completed' },
  { id: 'c4', title: 'Implement OAuth2 Flow', description: 'Build a secure OAuth2 authentication flow from scratch without libraries.', category: 'Backend', difficulty: 'Hard', xpReward: 450, participants: 8, timeLimit: '72h', status: 'Not Started' },
  { id: 'c5', title: 'CSS Grid Layouts', description: 'Recreate 5 complex magazine layouts using only CSS Grid.', category: 'UI/UX', difficulty: 'Easy', xpReward: 100, participants: 89, timeLimit: '12h', status: 'Not Started' },
  { id: 'c6', title: 'Neural Network from Scratch', description: 'Build a simple feedforward neural network using only NumPy.', category: 'AI/ML', difficulty: 'Hard', xpReward: 600, participants: 15, timeLimit: '72h', status: 'Not Started' },
  { id: 'c7', title: 'Two Sum & Variants', description: 'Solve the classic Two Sum problem and its 3 variants optimally.', category: 'Algorithms', difficulty: 'Easy', xpReward: 50, participants: 120, timeLimit: '4h', status: 'Completed' },
  { id: 'c8', title: 'RAG Chatbot', description: 'Build a Retrieval-Augmented Generation chatbot using LangChain.', category: 'AI/ML', difficulty: 'Medium', xpReward: 300, participants: 34, timeLimit: '48h', status: 'Not Started' },
];

const MOCK_GROQ_RECS = [
  { id: 'c2', title: 'React Performance Audit', reason: "You've done 2 UI/UX challenges — try Full-Stack to diversify your Skill Graph.", xpReward: 250 },
  { id: 'c8', title: 'RAG Chatbot', reason: "Based on your recent Python commits, this AI/ML challenge is a perfect next step.", xpReward: 300 },
  { id: 'c1', title: 'Build a Distributed Cache', reason: "You're close to 'Expert' rank. This high-XP backend challenge will get you there.", xpReward: 500 },
];

const CATEGORIES = ['All', 'UI/UX', 'Full-Stack', 'Backend', 'Algorithms', 'AI/ML'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
type SortOption = 'Latest' | 'Most XP' | 'Fewest Submissions';

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category) {
    case 'UI/UX': return <Layout className={className} />;
    case 'Full-Stack': return <Layout className={className} />;
    case 'Backend': return <Database className={className} />;
    case 'AI/ML': return <Brain className={className} />;
    case 'Algorithms': return <Code2 className={className} />;
    default: return <Code2 className={className} />;
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

  const filteredChallenges = useMemo(() => {
    let result = MOCK_CHALLENGES.filter(c => {
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchesDifficulty = activeDifficulty === 'All' || c.difficulty === activeDifficulty;
      return matchesCategory && matchesDifficulty;
    });

    result.sort((a, b) => {
      if (sortBy === 'Most XP') return b.xpReward - a.xpReward;
      if (sortBy === 'Fewest Submissions') return a.participants - b.participants;
      return 0; // Latest is default mock order
    });

    return result;
  }, [activeCategory, activeDifficulty, sortBy]);

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12 space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          Engineering <span className="text-accent-cyan">Challenges</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Take on real-world problems, submit your solutions, and climb the global leaderboard.
        </p>
      </div>

      {/* Groq AI Recommendations Strip */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-accent-amber" size={20} />
          <h2 className="font-space text-2xl font-bold text-text-primary">AI Recommended for You</h2>
          <span className="text-xs text-text-muted ml-2 border border-border-subtle px-2 py-0.5 rounded-full">Powered by Groq</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_GROQ_RECS.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-6 border-accent-amber/30 bg-accent-amber/5 h-full flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                
                <h3 className="font-space font-bold text-xl text-text-primary mb-3 group-hover:text-accent-amber transition-colors">
                  {rec.title}
                </h3>
                <p className="text-text-secondary text-sm mb-6 flex-grow">
                  <span className="font-medium text-accent-amber block mb-1">Why for you:</span>
                  {rec.reason}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="green">+{rec.xpReward} XP</Badge>
                  <Link to={`/challenges/${rec.id}`} className="text-accent-amber font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Try This <ArrowRight size={16} />
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-border-subtle">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeCategory === cat 
                  ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan"
                  : "bg-bg-surface border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-muted"
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
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d} Difficulty</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-bg-base border border-border-subtle rounded-lg py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent-cyan"
            >
              {(['Latest', 'Most XP', 'Fewest Submissions'] as SortOption[]).map(s => <option key={s} value={s}>Sort: {s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              layout
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard hover className="h-full flex flex-col p-6 relative overflow-hidden group">
                {/* Status Indicator */}
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
                    to={`/challenges/${challenge.id}`}
                    className={cn(
                      "px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2",
                      challenge.status === 'Completed' 
                        ? "bg-bg-surface text-text-muted hover:text-text-primary border border-border-subtle" 
                        : "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20"
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
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-20 text-text-muted">
          No challenges found matching your criteria.
        </div>
      )}
    </div>
  );
};
