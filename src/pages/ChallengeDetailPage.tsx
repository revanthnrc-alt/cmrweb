import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import type { Id } from '../../convex/_generated/dataModel';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Users, CheckCircle2, ChevronDown, ChevronUp, FileText, Code2, Github, Globe, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '../components/ui/Badge';
import { GlassCard } from '../components/ui/GlassCard';
import { ChallengeLeaderboard } from '../components/challenges/ChallengeLeaderboard';
import { useToast } from '../components/ui/Toast';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { api } from '../../convex/_generated/api';

export const ChallengeDetailPage = () => {
  const { id } = useParams();
  const challengeId = id as Id<'challenges'> | undefined;
  const { user: currentUser } = useCurrentUser();
  const [hintsOpen, setHintsOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const challenge = useQuery(api.challenges.getChallengeById, challengeId ? { challengeId } : 'skip');
  const leaderboard = useQuery(api.challenges.getChallengeLeaderboard, challengeId ? { challengeId } : 'skip');
  const existingSubmission = useQuery(
    api.submissions.getUserSubmissionForChallenge,
    currentUser && challengeId
      ? { userId: currentUser._id, challengeId }
      : 'skip'
  );
  const submitSolution = useMutation(api.submissions.submitSolution);

  const participantCount = leaderboard?.length ?? 0;
  const timeLimit = challenge ? `${challenge.timeLimitDays} Days` : '--';

  const isGithubValid = githubUrl === '' || (githubUrl.startsWith('https://') && githubUrl.includes('github.com'));
  const isLiveValid = liveUrl === '' || liveUrl.startsWith('https://');
  const isValid = githubUrl !== '' && liveUrl !== '' && isGithubValid && isLiveValid;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser || !challengeId || !isValid) return;

    setIsSubmitting(true);
    setError('');

    try {
      await submitSolution({
        userId: currentUser._id,
        challengeId,
        githubUrl,
        liveUrl,
      });
      setSubmitSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D9FF', '#F59E0B', '#A855F7'],
      });
      showToast('Submission received and sent for review', 'success');
    } catch (err: any) {
      if (err?.message?.includes('Already submitted')) {
        setError('You already submitted this challenge');
        showToast('You already submitted this challenge', 'warning');
      } else {
        setError('Submission failed — please try again');
        showToast('Submission failed — please try again', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resourceList = useMemo(() => challenge?.resources ?? [], [challenge]);

  if (challenge === undefined || leaderboard === undefined || (currentUser && existingSubmission === undefined)) {
    return (
      <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse bg-white/5 rounded-lg h-24" />
      </div>
    );
  }

  if (challenge === null) {
    return (
      <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <div className="text-center py-24 text-text-muted">Challenge not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
      <Link to="/challenges" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan transition-colors mb-8 font-medium">
        <ChevronLeft size={18} /> Back to Challenges
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
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
                <span>Time Limit: <strong className="text-text-primary">{timeLimit}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-text-muted" />
                <span><strong className="text-text-primary">{participantCount}</strong> Builders Attempting</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-space text-2xl font-bold text-text-primary flex items-center gap-2">
              <FileText size={24} className="text-accent-cyan" /> The Problem
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
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
              {challenge.requirements.map((requirement, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary bg-bg-surface/50 p-3 rounded-lg border border-border-subtle">
                  <CheckCircle2 size={18} className="text-accent-green shrink-0 mt-0.5" />
                  <span>{requirement}</span>
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
                {resourceList.length > 0 ? resourceList.map((resource, i) => (
                  <div key={i} className="flex gap-3 text-sm text-text-secondary">
                    <span className="font-bold text-accent-amber">💡</span>
                    <p>{resource}</p>
                  </div>
                )) : (
                  <div className="flex gap-3 text-sm text-text-secondary">
                    <span className="font-bold text-accent-amber">💡</span>
                    <p>Start small, ship the core path first, and document your tradeoffs clearly.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24">
            {existingSubmission ? (
              <GlassCard className="p-6 border-accent-cyan/50 bg-accent-cyan/5">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="text-accent-cyan" size={24} />
                  <h3 className="font-space font-bold text-lg text-text-primary">You already submitted this challenge</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Github size={16} />
                    <a href={existingSubmission.githubUrl} className="text-accent-cyan hover:underline truncate">{existingSubmission.githubUrl}</a>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Globe size={16} />
                    <a href={existingSubmission.liveUrl} className="text-accent-cyan hover:underline truncate">{existingSubmission.liveUrl}</a>
                  </div>
                  {existingSubmission.score !== undefined && (
                    <p className="text-text-primary font-medium">Score: {existingSubmission.score}</p>
                  )}
                </div>
              </GlassCard>
            ) : submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassCard className="p-8 text-center border-accent-green/50 bg-accent-green/5 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="font-space font-bold text-2xl text-text-primary">Submission Received!</h3>
                  <p className="text-text-secondary">Your solution is now pending review by the club leads. You'll be notified once XP is awarded.</p>
                </GlassCard>
              </motion.div>
            ) : (
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

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting || !currentUser}
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
            )}

            <ChallengeLeaderboard challengeId={challengeId} />
          </div>
        </div>
      </div>
    </div>
  );
};
