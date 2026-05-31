'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

/**
 * useCountUp - Animates a number from 0 to target over a duration.
 * Handles commas, decimals, and suffixes like "M", "%", "+".
 */
export function useCountUp(
  target: number | string,
  duration = 1000,
  startOnMount = true
): { displayValue: string; start: () => void } {
  const [displayValue, setDisplayValue] = useState('0');
  const hasStarted = useRef(false);

  // Parse the target value
  const parseTarget = useCallback((val: number | string): { num: number; prefix: string; suffix: string } => {
    if (typeof val === 'number') return { num: val, prefix: '', suffix: '' };
    const str = val.toString();
    // Match prefix, number part (with commas/decimals), suffix
    const match = str.match(/^([^0-9.]*)([\d,.]+)([^0-9.]*)$/);
    if (match) {
      const numStr = match[2].replace(/,/g, '');
      const num = parseFloat(numStr);
      return { num: isNaN(num) ? 0 : num, prefix: match[1], suffix: match[3] };
    }
    return { num: 0, prefix: '', suffix: str };
  }, []);

  const start = useCallback(() => {
    const { num, prefix, suffix } = parseTarget(target);
    if (num === 0) {
      setDisplayValue(target.toString());
      return;
    }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * num);

      // Format with commas
      const formatted = current.toLocaleString();
      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration, parseTarget]);

  useEffect(() => {
    if (startOnMount && !hasStarted.current) {
      hasStarted.current = true;
      // Delay slightly for visual effect
      const timer = setTimeout(start, 300);
      return () => clearTimeout(timer);
    }
  }, [startOnMount, start]);

  return { displayValue, start };
}

/**
 * useTilt3D - Returns event handlers for 3D tilt + spotlight effect on cards.
 */
export function useTilt3D(maxTilt = 12) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltStyle({
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out',
      });

      // Spotlight follows mouse
      setSpotlightStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.25) 0%, transparent 60%)`,
        transition: 'opacity 0.3s ease',
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
    setSpotlightStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease',
    });
  }, []);

  return { cardRef, tiltStyle, spotlightStyle, handleMouseMove, handleMouseLeave };
}

/**
 * useRipple - Creates a material-design-style ripple effect.
 * Returns click handler + ripple elements state.
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const rippleId = useRef(0);

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);
  }, []);

  return { ripples, createRipple };
}
