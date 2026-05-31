'use client';

import { useEffect, useRef, useId } from 'react';

/**
 * parseTarget - Extract numeric value, prefix and suffix from a target string.
 */
function parseTarget(target: string | number) {
  if (typeof target === 'number') return { num: target, prefix: '', suffix: '' };
  const str = target.toString();
  const match = str.match(/^([^0-9.]*)([\d,.]+)([^0-9.]*)$/);
  if (match) {
    const numStr = match[2].replace(/,/g, '');
    const num = parseFloat(numStr);
    return { num: isNaN(num) ? 0 : num, prefix: match[1], suffix: match[3] };
  }
  return { num: 0, prefix: '', suffix: str };
}

/**
 * AnimatedCounter - Displays an animated counting number from 0 to target.
 * Uses requestAnimationFrame for smooth animation.
 */
export function AnimatedCounter({
  target,
  duration = 1000,
  className = '',
}: {
  target: string | number;
  duration?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(() => target.toString());
  const hasStarted = useRef(false);
  const frameRef = useRef<number>(0);

  // Start the animation on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const { num, prefix, suffix } = parseTarget(target);

    if (num === 0) {
      // Already initialized to target.toString()
      return;
    }

    const startCounting = () => {
      const startTime = performance.now();
      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * num);
        setDisplayValue(`${prefix}${current.toLocaleString()}${suffix}`);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const timer = setTimeout(startCounting, 200);
    return () => {
      clearTimeout(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return <span className={className}>{displayValue}</span>;
}

import { useState } from 'react';

/**
 * useCountUp hook for programmatic use.
 */
export function useCountUp(
  target: string | number,
  duration = 1000,
  startOnMount = true
): string {
  const [displayValue, setDisplayValue] = useState(() => target.toString());
  const hasStarted = useRef(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!startOnMount || hasStarted.current) return;
    hasStarted.current = true;

    const { num, prefix, suffix } = parseTarget(target);

    if (num === 0) {
      return;
    }

    const startCounting = () => {
      const startTime = performance.now();
      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * num);
        setDisplayValue(`${prefix}${current.toLocaleString()}${suffix}`);
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        }
      };
      frameRef.current = requestAnimationFrame(tick);
    };

    const timer = setTimeout(startCounting, 200);
    return () => {
      clearTimeout(timer);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [startOnMount, target, duration]);

  return displayValue;
}
