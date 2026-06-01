'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * parseTarget - Extract numeric value, prefix and suffix from a target string.
 * Handles decimal numbers correctly (e.g., "4.8" stays as "4.8", not "48").
 */
function parseTarget(target: string | number) {
  if (typeof target === 'number') return { num: target, prefix: '', suffix: '', decimals: 0 };
  const str = target.toString();
  const match = str.match(/^([^0-9.]*)([\d,.]+)([^0-9.]*)$/);
  if (match) {
    const numStr = match[2].replace(/,/g, '');
    const num = parseFloat(numStr);
    const hasDecimal = numStr.includes('.');
    const decimals = hasDecimal ? (numStr.split('.')[1] || '').length : 0;
    return { num: isNaN(num) ? 0 : num, prefix: match[1], suffix: match[3], decimals };
  }
  return { num: 0, prefix: '', suffix: str, decimals: 0 };
}

/**
 * formatNumber - Comma format numbers > 1000, preserve decimals.
 */
function formatNumber(num: number, decimals: number): string {
  if (decimals > 0) {
    const parts = num.toFixed(decimals).split('.');
    parts[0] = Number(parts[0]).toLocaleString('en-US');
    return parts.join('.');
  }
  return num.toLocaleString('en-US');
}

/**
 * AnimatedCounter - Displays an animated counting number from 0 to target.
 * Uses requestAnimationFrame for smooth animation.
 * Supports comma formatting for numbers > 1000 and decimal preservation.
 */
export function AnimatedCounter({
  target,
  duration = 1000,
  className = '',
  startOnView = false,
  isInView = true,
}: {
  target: string | number;
  duration?: number;
  className?: string;
  /** If true, waits for isInView=true before starting */
  startOnView?: boolean;
  /** Current inView state from parent useInView hook */
  isInView?: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(() => target.toString());
  const hasStarted = useRef(false);
  const frameRef = useRef<number>(0);

  // Start the animation when conditions are met
  useEffect(() => {
    if (startOnView && !isInView) return;
    if (hasStarted.current) return;
    hasStarted.current = true;

    const { num, prefix, suffix, decimals } = parseTarget(target);

    if (num === 0) {
      return;
    }

    const startCounting = () => {
      const startTime = performance.now();
      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        let current: number;
        if (decimals > 0) {
          current = parseFloat((eased * num).toFixed(decimals));
        } else {
          current = Math.round(eased * num);
        }

        setDisplayValue(`${prefix}${formatNumber(current, decimals)}${suffix}`);
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
  }, [target, duration, startOnView, isInView]);

  return <span className={className}>{displayValue}</span>;
}

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

    const { num, prefix, suffix, decimals } = parseTarget(target);

    if (num === 0) {
      return;
    }

    const startCounting = () => {
      const startTime = performance.now();
      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        let current: number;
        if (decimals > 0) {
          current = parseFloat((eased * num).toFixed(decimals));
        } else {
          current = Math.round(eased * num);
        }

        setDisplayValue(`${prefix}${formatNumber(current, decimals)}${suffix}`);
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
