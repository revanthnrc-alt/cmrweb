import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Globe, Check, X, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

// MOCK DATA
const MOCK_PENDING = [
  { id: 's1', user: 'Arjun S.', avatar: 'AS', challenge: 'Build a Distributed Cache', category: 'Backend', time: '2 hours ago', github: 'github.com/arjun/cache', live: 'cache-demo.vercel.app', rank: 'Expert', xp: 12500 },
  { id: 's2', user: 'Priya M.', avatar: 'PM', challenge: 'React Performance Audit', category: 'Full-Stack', time: '5 hours ago', github: 'github.com/priya/react-perf', live: 'perf-audit.netlify.app', rank: 'Pro', xp: 8200 },
  { id: 's3', user: 'Rahul T.', avatar: 'RT', challenge: 'Design System Setup', category: 'UI/UX', time: '1 day ago', github: 'github.com/rahul/design', live: 'figma.com/file/xyz', rank: 'Intermediate', xp: 4500 },
];

export const SubmissionReview = () => {
  const [pending, setPending] = useState(MOCK_PENDING);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_PENDING[0]?.id || null);
  const [score, setScore] = useState<number | ''>(100);
  const [feedback, setFeedback] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const selected = pending.find(s => s.id === selectedId);

  const handleAction = (action: 'approve' | 'reject') => {
    if (!selected) return;
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setPending(prev => prev.filter(s => s.id !== selected.id));
      setSelectedId(pending.find(s => s.id !== selected.id)?.id || null);
      setScore(100);
      setFeedback('');
      setIsProcessing(false);
    }, 800);
  };

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted">
        <Check size={48} className="mb-4 text-accent-green opacity-50" />
        <p className="text-lg">All caught up! No pending submissions.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left Panel: List */}
      <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {pending.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedId(sub.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedId === sub.id 
                ? 'bg-bg-surface border-accent-cyan shadow-[0_0_15px_rgba(0,217,255,0.1)]' 
                : 'bg-bg-card border-border-subtle hover:border-text-muted'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                  {sub.avatar}
                </div>
                <span className="font-medium text-text-primary">{sub.user}</span>
              </div>
              <span className="text-xs font-bold bg-accent-amber/20 text-accent-amber px-2 py-1 rounded-md">PENDING</span>
            </div>
            <h4 className="font-space font-bold text-text-primary truncate">{sub.challenge}</h4>
            <p className="text-xs text-text-muted mt-1">{sub.time}</p>
          </button>
        ))}
      </div>

      {/* Right Panel: Details */}
      <div className="lg:col-span-7 h-full">
        {selected ? (
          <GlassCard className="h-full flex flex-col p-6">
            <div className="flex justify-between items-start border-b border-border-subtle pb-6 mb-6">
              <div>
                <h2 className="font-space text-2xl font-bold text-text-primary mb-1">{selected.challenge}</h2>
                <span className="text-sm text-text-secondary">{selected.category}</span>
              </div>
              <div className="text-right">
                <div className="font-medium text-text-primary">{selected.user}</div>
                <div className="text-sm text-text-muted">{selected.rank} • {selected.xp} XP</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <a href={`https://${selected.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-text-muted transition-colors text-text-primary">
                <Github size={20} /> {selected.github}
              </a>
              <a href={`https://${selected.live}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-text-muted transition-colors text-text-primary">
                <Globe size={20} /> {selected.live}
              </a>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Score (0-100)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full max-w-[150px] bg-bg-base border border-border-subtle rounded-lg py-2 px-4 text-text-primary focus:outline-none focus:border-accent-cyan"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Feedback (Optional)</label>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Feedback for the member..."
                  className="w-full h-32 bg-bg-base border border-border-subtle rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:border-accent-cyan resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 pt-6 border-t border-border-subtle">
              <button 
                onClick={() => handleAction('approve')}
                disabled={isProcessing || score === '' || score < 0 || score > 100}
                className="flex-1 py-3 rounded-md bg-accent-green/10 text-accent-green font-bold border border-accent-green/20 hover:bg-accent-green/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Approve + Award XP</>}
              </button>
              <button 
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
                className="flex-1 py-3 rounded-md bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <X size={18} /> Reject
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted bg-bg-card rounded-xl border border-border-subtle">
            Select a submission to review
          </div>
        )}
      </div>
    </div>
  );
};
