import React from 'react';
import { motion } from 'framer-motion';

export function PageLoader({ message = 'Loading NexusClub...' }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0A0F] px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute left-[18%] top-[20%] h-72 w-72 rounded-full bg-accent-cyan/15 blur-[120px]" />
      <div className="absolute right-[14%] top-[30%] h-80 w-80 rounded-full bg-accent-purple/12 blur-[120px]" />
      <div className="absolute bottom-[12%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-amber/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border-subtle bg-bg-card/85 px-8 py-10 text-center shadow-2xl backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="font-space text-4xl font-bold tracking-[0.24em] text-text-primary">
            NE<span className="text-accent-cyan">X</span>US
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="mx-auto mb-4 h-1.5 w-full origin-left rounded-full bg-gradient-to-r from-accent-cyan via-accent-amber to-accent-purple"
        />

        <p className="text-sm font-medium text-text-secondary">{message}</p>
      </div>
    </div>
  );
}

export default PageLoader;
