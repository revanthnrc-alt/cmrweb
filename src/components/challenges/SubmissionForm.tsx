import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../ui/GlassCard';

export const SubmissionForm = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // MOCK: duplicate check

  const isGithubValid = githubUrl === '' || (githubUrl.startsWith('https://') && githubUrl.includes('github.com'));
  const isLiveValid = liveUrl === '' || liveUrl.startsWith('https://');
  const isValid = githubUrl !== '' && liveUrl !== '' && isGithubValid && isLiveValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    // MOCK: simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setHasSubmitted(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D9FF', '#F59E0B', '#A855F7']
      });
    }, 1500);
  };

  if (hasSubmitted && !isSuccess) {
    return (
      <GlassCard className="p-6 border-accent-cyan/50 bg-accent-cyan/5">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="text-accent-cyan" size={24} />
          <h3 className="font-space font-bold text-lg text-text-primary">You already submitted this challenge</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <Github size={16} />
            <a href="#" className="text-accent-cyan hover:underline truncate">github.com/arjun/solution</a>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Globe size={16} />
            <a href="#" className="text-accent-cyan hover:underline truncate">solution-demo.vercel.app</a>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GlassCard className="p-8 text-center border-accent-green/50 bg-accent-green/5 space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 size={32} />
          </motion.div>
          <h3 className="font-space font-bold text-2xl text-text-primary">Submission Received!</h3>
          <p className="text-text-secondary">Your solution is now pending review by the club leads. You'll be notified once XP is awarded.</p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <GlassCard className="p-6 border-accent-cyan/30 shadow-[0_0_15px_rgba(0,217,255,0.05)]">
      <h3 className="font-space font-bold text-xl text-text-primary mb-6">Submit Solution</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
            <Github size={16} /> GitHub Repository URL
          </label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            className={`w-full bg-bg-base border rounded-lg py-2.5 px-4 text-text-primary focus:outline-none transition-colors ${
              !isGithubValid ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-cyan'
            }`}
          />
          {!isGithubValid && (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> Must be a valid GitHub URL starting with https://
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
            <Globe size={16} /> Live Demo URL
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://your-demo.vercel.app"
            className={`w-full bg-bg-base border rounded-lg py-2.5 px-4 text-text-primary focus:outline-none transition-colors ${
              !isLiveValid ? 'border-red-500/50 focus:border-red-500' : 'border-border-subtle focus:border-accent-cyan'
            }`}
          />
          {!isLiveValid && (
            <p className="text-red-400 text-xs flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> Must be a valid URL starting with https://
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-3 rounded-md bg-accent-cyan text-bg-base font-bold hover:bg-accent-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Solution'
          )}
        </button>
      </form>
    </GlassCard>
  );
};
