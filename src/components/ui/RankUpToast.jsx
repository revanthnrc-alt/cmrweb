import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import { RankBadge } from '../profile/RankBadge';

export function RankUpToast({ newRank, open, onClose }) {
  useEffect(() => {
    if (!open || !newRank) return;

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#00D9FF', '#F59E0B', '#A855F7', '#10B981'],
    });

    const timeout = window.setTimeout(() => {
      onClose?.();
    }, 4000);

    return () => clearTimeout(timeout);
  }, [newRank, onClose, open]);

  return (
    <AnimatePresence>
      {open && newRank && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-[#0A0A0F]/82 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.05, 1], opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="w-full max-w-xl rounded-3xl border border-accent-amber/30 bg-bg-card/95 p-8 text-center shadow-2xl"
          >
            <div className="mb-4 font-space text-4xl font-bold text-accent-amber sm:text-5xl">
              🎉 RANK UP!
            </div>
            <p className="mb-6 text-lg text-text-secondary">You are now {newRank}</p>
            <div className="mx-auto flex max-w-xs justify-center">
              <RankBadge rank={newRank} xp={0} nextRankXP={0} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default RankUpToast;
