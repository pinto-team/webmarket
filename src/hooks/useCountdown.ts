import { useState, useEffect, useRef } from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive || seconds <= 0) return;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        setSeconds((prev) => Math.max(0, prev - Math.floor(delta / 1000)));
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, seconds]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        setIsActive(true);
        lastTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return { seconds, isExpired: seconds <= 0 };
};
