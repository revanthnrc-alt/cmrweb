import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/src/lib/cn';

/**
 * @typedef {Object} AnimatedCounterProps
 * @property {number} value - Target value to count up to
 * @property {number} [duration=2000] - Animation duration in ms
 * @property {string} [prefix] - Text to show before the number
 * @property {string} [suffix] - Text to show after the number
 * @property {string} [className] - Additional classes
 */
export interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Animated counter component that counts up when in view
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(easeOut * value));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isVisible]);

  return (
    <span
      ref={counterRef}
      className={cn('font-space text-4xl font-bold text-text-primary', className)}
    >
      {prefix}
      {count}
      {suffix}
    </span>
  );
};
