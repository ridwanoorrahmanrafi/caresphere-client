import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Users, CalendarHeart } from "lucide-react";

export default function Banner() {
  return (
    <section className="hero relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Decorative gradient glow backgrounds (Royal Indigo & Electric Violet) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Content Container */}
      <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Community-Driven Social Development Platform</span>
            </div>

            {/* Main Heading with Text Rotate Component */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Turn Empathy into{" "}
              <span className="text-rotate duration-6000 align-baseline">
                <span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500">
                    Action.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500">
                    Impact.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500">
                    Change.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-500 to-amber-500">
                    Hope.
                  </span>
                </span>
              </span>{" "}
              Unite for Your Community.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover, organize, and join impactful grassroots social service events in your neighborhood—from
              winter clothes and blanket distributions in Mirpur and Mohammadpur to city greening and youth medical camps.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/upcoming-events"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 ring-1 ring-white/15"
              >
                <span>Explore Upcoming Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/create-event"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all"
              >
                <CalendarHeart className="w-4 h-4 text-indigo-500" />
                <span>Host an Event</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">100%</p>
                <p className="text-xs text-slate-500 font-medium">Verified Causes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">12,500+</p>
                <p className="text-xs text-slate-500 font-medium">Volunteers Joined</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">350+</p>
                <p className="text-xs text-slate-500 font-medium">Drives Completed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image with Glass Card Overlay */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                  alt="Community Volunteers Distributing Winter Aid"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-600/90 text-white backdrop-blur-md shadow-sm mb-2 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Featured Cause</span>
                  </span>
                  <p className="text-base sm:text-lg font-bold leading-tight drop-shadow-sm text-white">
                    Winter Clothes Distribution for Underprivileged Children
                  </p>
                  <p className="text-xs text-slate-200 mt-1 flex items-center gap-1">
                    <span>Mirpur 10, Dhaka</span> • <span>Upcoming Community Drive</span>
                  </p>
                </div>
              </div>

              {/* Floating Badge 1: Community Verified */}
              <div className="absolute -top-4 left-3 sm:-left-4 p-2.5 sm:p-3 rounded-2xl glass border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">100% Verified</p>
                  <p className="text-[10px] text-slate-500">Zero Intermediaries</p>
                </div>
              </div>

              {/* Floating Badge 2: Direct Impact */}
              <div className="absolute -bottom-4 right-3 sm:-right-4 p-2.5 sm:p-3 rounded-2xl glass border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Join as Volunteer</p>
                  <p className="text-[10px] text-slate-500">1-Click RSVP Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
