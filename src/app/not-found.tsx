import React from "react";
import Link from "next/link";
import { Compass, Home, Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full text-center space-y-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Icon & Status */}
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/30">
            <Compass className="w-10 h-10 animate-spin [animation-duration:12s]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>CareSphere Navigation Dispatch</span>
          </div>
        </div>

        {/* 404 Typography */}
        <div className="space-y-3">
          <h1 className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
            4<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">0</span>4
          </h1>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Looks like you wandered into unmapped territory. Even changemakers take a wrong turn sometimes.
            Let&apos;s get you back to discovering and organizing community events!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 ring-1 ring-white/15"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/upcoming-events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Helpful links footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <span>•</span>
          <Link href="/upcoming-events" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Upcoming Events
          </Link>
          <span>•</span>
          <Link href="/create-event" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Host Event
          </Link>
        </div>
      </div>
    </div>
  );
}

