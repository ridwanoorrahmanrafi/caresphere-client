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
  const targetTime = new Date(target).getTime();
  if (isNaN(targetTime) || targetTime <= Date.now()) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const difference = targetTime - Date.now();

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
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center">
        <p className="text-sm font-bold text-indigo-800 dark:text-indigo-300">
          This initiative has commenced or concluded!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{title}</span>
        </div>
      )}

      {/* Countdown in Boxes with Labels Under */}
      <div className="grid grid-flow-col gap-2.5 sm:gap-3 text-center auto-cols-fr">
        {/* Days */}
        <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-none tracking-tight">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1.5">
            days
          </span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-none tracking-tight">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1.5">
            hours
          </span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-none tracking-tight">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1.5">
            min
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-inner">
          <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums leading-none tracking-tight">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-1.5">
            sec
          </span>
        </div>
      </div>
    </div>
  );
}
