"use client";

import { useState, useEffect } from "react";

export const useOrderTimer = (expiresAt: Date | string | null) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const expiration = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;

    const updateTimer = () => {
      const now = new Date().getTime();
      const remaining = expiration.getTime() - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);
      } else {
        setTimeRemaining(remaining);
        setIsExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return { timeRemaining, isExpired, minutes, seconds, formatted };
};
