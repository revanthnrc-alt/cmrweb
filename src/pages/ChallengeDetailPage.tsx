import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Clock, Users, CheckCircle2, ChevronDown, ChevronUp, FileText, Code2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { GlassCard } from '../components/ui/GlassCard';
import { SubmissionForm } from '../components/challenges/SubmissionForm';
import { ChallengeLeaderboard } from '../components/challenges/ChallengeLeaderboard';

// MOCK DATA
const MOCK_CHALLENGE = {
  id: 'c1',
  title: 'Build a Distributed Cache',
  category: 'Backend',
  difficulty: 'Hard',
  xpReward: 500,
  timeLimit: '48 Hours',
  participants: 12,
  description: `
In this challenge, you will build a distributed LRU cache from scratch. This is a common system design interview question and a critical component of modern backend architecture.

Your cache must support concurrent reads and writes, handle node failures gracefully, and implement a consistent hashing algorithm for data distribution.
  `,
  requirements: [
    'Implement an LRU eviction policy',
    'Support concurrent access using appropriate locks/mutexes',
    'Implement consistent hashing for node distribution',
    'Provide a gRPC or REST API for GET/SET/DELETE operations',
    'Include comprehensive unit tests (min 80% coverage)'
  ],
  hints: [
    'Start by building a thread-safe local LRU cache before adding networking.',
    'Consider using a ring buffer or similar structure for consistent hashing.',
    'Go channels or Rust async/await are great for handling concurrent requests.'
  ]
};

export const ChallengeDetailPage = () => {
  const { id } = useParams();
  const [hintsOpen, setHintsOpen] = useState(false);

  // In a real app, fetch challenge by ID. Using mock for now.
  const challenge = MOCK_CHALLENGE;

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <Link to="/challenges" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-8 font-medium">
        <ChevronLeft size={18} /> Back to Challenges
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="purple">{challenge.category}</Badge>
              <Badge variant="cyan">{challenge.difficulty}</Badge>
              <Badge variant="green">+{challenge.xpReward} XP</Badge>
            </div>
            <h1 className="font-space text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
              {challenge.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-text-secondary border-y border-border-subtle py-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-text-muted" />
                <span>Time Limit: <strong className="text-text-primary">{challenge.timeLimit}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-text-muted" />
                <span><strong className="text-text-primary">{challenge.participants}</strong> Builders Attempting</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-space text-2xl font-bold text-text-primary flex items-center gap-2">
              <FileText size={24} className="text-accent-cyan" /> The Problem
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
              {/* Using pre-styled divs instead of react-markdown for simplicity, but simulating markdown rendering */}
              {challenge.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-space text-2xl font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 size={24} className="text-accent-green" /> Requirements
            </h2>
            <ul className="space-y-3">
              {challenge.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary bg-bg-surface/50 p-3 rounded-lg border border-border-subtle">
                  <CheckCircle2 size={18} className="text-accent-green shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => setHintsOpen(!hintsOpen)}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-bg-surface border border-border-subtle hover:border-accent-amber/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 font-space font-bold text-accent-amber">
                <Code2 size={20} /> Resources & Hints
              </div>
              {hintsOpen ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
            </button>
            
            <motion.div
              initial={false}
              animate={{ height: hintsOpen ? 'auto' : 0, opacity: hintsOpen ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 rounded-lg bg-accent-amber/5 border border-accent-amber/20 space-y-3">
                {challenge.hints.map((hint, i) => (
                  <div key={i} className="flex gap-3 text-sm text-text-secondary">
                    <span className="font-bold text-accent-amber">💡</span>
                    <p>{hint}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Form & Leaderboard */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <SubmissionForm />
            <ChallengeLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};
