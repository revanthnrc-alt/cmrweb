import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/cn';

/**
 * @typedef {Object} GlassCardProps
 * @property {React.ReactNode} children - Card content
 * @property {string} [className] - Additional classes
 * @property {boolean} [glow=false] - Whether to show cyan glow
 * @property {boolean} [hover=false] - Whether to enable hover effects
 */
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
}

/**
 * Glassmorphism card component
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = false,
  hover = false,
}) => {
  const baseClasses = cn(
    'bg-bg-card border border-border-subtle rounded-lg backdrop-blur-[12px]',
    glow && 'shadow-[var(--glow-cyan)]',
    hover && 'transition-colors duration-300',
    className
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.01, borderColor: 'var(--border-accent)' }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClasses}>{children}</div>;
};
