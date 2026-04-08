import React from 'react';
import { cn } from '@/src/lib/cn';

/**
 * @typedef {'cyan' | 'amber' | 'purple' | 'green' | 'gray'} BadgeVariant
 * @typedef {'sm' | 'md'} BadgeSize
 * 
 * @typedef {Object} BadgeProps
 * @property {React.ReactNode} children - Badge content
 * @property {BadgeVariant} [variant='cyan'] - Color variant
 * @property {BadgeSize} [size='sm'] - Size variant
 * @property {string} [className] - Additional classes
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'purple' | 'green' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge component for tags and labels
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  className,
}) => {
  const variants = {
    cyan: 'bg-accent-cyan/10 text-accent-cyan',
    amber: 'bg-accent-amber/10 text-accent-amber',
    purple: 'bg-accent-purple/10 text-accent-purple',
    green: 'bg-accent-green/10 text-accent-green',
    gray: 'bg-text-muted/10 text-text-secondary',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full uppercase tracking-[0.05em] font-semibold',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
