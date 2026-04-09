import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Github, Globe, Check, X, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { RankUpToast } from '../ui/RankUpToast';
import { useToast } from '../ui/Toast';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { api } from '../../../convex/_generated/api';

export const SubmissionReview = () => {
  const pending = useQuery(api.submissions.getPendingSubmissions);
  const reviewSubmission = useMutation(api.submissions.reviewSubmission);
  const { user: currentUser } = useCurrentUser();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState<number | ''>(100);
  const [feedback, setFeedback] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [rankUp, setRankUp] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!pending?.length) {
      setSelectedId(null);
      return;
    }
    setSelectedId((current) => current ?? String(pending[0].submission._id));
  }, [pending]);

  const selectedSubmission = useMemo(
    () => pending?.find((entry) => String(entry.submission._id) === selectedId),
    [pending, selectedId],
  );

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedSubmission || !score || !currentUser) return;
    setIsReviewing(true);

    try {
      const result = await reviewSubmission({
        submissionId: selectedSubmission.submission._id,
        adminId: currentUser._id,
        score: parseInt(String(score), 10),
        feedback,
        status,
      });

      if (result.rankChanged) {
        setRankUp(result.newRank);
        showToast(`Approved! ${selectedSubmission.user?.name ?? 'Builder'} reached ${result.newRank}`, 'success');
      } else {
        showToast(status === 'approved'
          ? `Approved! +${selectedSubmission.challenge?.xpReward ?? 0} XP awarded`
          : 'Submission rejected', status === 'approved' ? 'success' : 'warning');
      }

      setSelectedId(null);
      setScore(100);
      setFeedback('');
    } catch (err: any) {
      showToast(err?.message ?? 'Review failed', 'error');
    } finally {
      setIsReviewing(false);
    }
  };

  if (pending === undefined) {
    return <div className="animate-pulse bg-white/5 rounded-lg h-24" />;
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-text-muted">
        <Check size={48} className="mb-4 text-accent-green opacity-50" />
        <p className="text-lg">All caught up! No pending submissions.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {pending.map((entry) => {
            const user = entry.user;
            const challenge = entry.challenge;
            return (
              <button
                key={String(entry.submission._id)}
                onClick={() => setSelectedId(String(entry.submission._id))}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedId === String(entry.submission._id)
                    ? 'bg-bg-surface border-accent-cyan shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                    : 'bg-bg-card border-border-subtle hover:border-text-muted'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bg-base border border-border-subtle flex items-center justify-center text-xs font-bold text-text-primary">
                      {user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() ?? 'NB'}
                    </div>
                    <span className="font-medium text-text-primary">{user?.name ?? 'Unknown User'}</span>
                  </div>
                  <span className="text-xs font-bold bg-accent-amber/20 text-accent-amber px-2 py-1 rounded-md">PENDING</span>
                </div>
                <h4 className="font-space font-bold text-text-primary truncate">{challenge?.title ?? 'Unknown Challenge'}</h4>
                <p className="text-xs text-text-muted mt-1">{new Date(entry.submission.submittedAt).toLocaleString()}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 h-full">
          {selectedSubmission ? (
            <GlassCard className="h-full flex flex-col p-6">
              <div className="flex justify-between items-start border-b border-border-subtle pb-6 mb-6">
                <div>
                  <h2 className="font-space text-2xl font-bold text-text-primary mb-1">{selectedSubmission.challenge?.title ?? 'Unknown Challenge'}</h2>
                  <span className="text-sm text-text-secondary">{selectedSubmission.challenge?.category ?? 'General'}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-text-primary">{selectedSubmission.user?.name ?? 'Unknown User'}</div>
                  <div className="text-sm text-text-muted">{selectedSubmission.user?.rank ?? 'Member'} • {selectedSubmission.user?.xp ?? 0} XP</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <a href={selectedSubmission.submission.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-text-muted transition-colors text-text-primary">
                  <Github size={20} /> {selectedSubmission.submission.githubUrl}
                </a>
                <a href={selectedSubmission.submission.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface border border-border-subtle hover:border-text-muted transition-colors text-text-primary">
                  <Globe size={20} /> {selectedSubmission.submission.liveUrl}
                </a>
              </div>

              <div className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
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
                  onClick={() => void handleReview('approved')}
                  disabled={isReviewing || score === '' || score < 0 || score > 100}
                  className="flex-1 py-3 rounded-md bg-accent-green/10 text-accent-green font-bold border border-accent-green/20 hover:bg-accent-green/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isReviewing ? <Loader2 size={18} className="animate-spin" /> : <><Check size={18} /> Approve + Award XP</>}
                </button>
                <button
                  onClick={() => void handleReview('rejected')}
                  disabled={isReviewing}
                  className="flex-1 py-3 rounded-md bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isReviewing ? <Loader2 size={18} className="animate-spin" /> : <><X size={18} /> Reject</>}
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
      <RankUpToast open={!!rankUp} newRank={rankUp} onClose={() => setRankUp(null)} />
    </>
  );
};
