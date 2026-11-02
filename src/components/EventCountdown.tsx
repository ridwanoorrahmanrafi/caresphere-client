"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface EventCountdownProps {
  targetDate: string | Date;
  title?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculateTimeLeft(target: string | Date): TimeLeft {
  const difference = new Date(target).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isPast: false,
  };
}

export default function EventCountdown({
  targetDate,
  title = "Initiative Starts In",
}: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse h-28" />
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
          This initiative has commenced or concluded!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          <span>{title}</span>
        </div>
      )}

      {/* DaisyUI Countdown in Boxes with Labels Under */}
      <div className="grid grid-flow-col gap-2.5 sm:gap-3 text-center auto-cols-fr">
        {/* Days */}
        <div className="flex flex-col p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black countdown text-emerald-600 dark:text-emerald-400 justify-center">
            <span
              style={{ "--value": Math.min(99, timeLeft.days) } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.days}`}
            >
              {timeLeft.days}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
            days
          </span>
        </div>

        {/* Hours */}
        <div className="flex flex-col p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black countdown text-emerald-600 dark:text-emerald-400 justify-center">
            <span
              style={{ "--value": timeLeft.hours } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.hours}`}
            >
              {timeLeft.hours}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
            hours
          </span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black countdown text-emerald-600 dark:text-emerald-400 justify-center">
            <span
              style={{ "--value": timeLeft.minutes } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.minutes}`}
            >
              {timeLeft.minutes}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
            min
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black countdown text-emerald-600 dark:text-emerald-400 justify-center">
            <span
              style={{ "--value": timeLeft.seconds } as React.CSSProperties}
              aria-live="polite"
              aria-label={`${timeLeft.seconds}`}
            >
              {timeLeft.seconds}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
            sec
          </span>
        </div>
      </div>
    </div>
  );
}

