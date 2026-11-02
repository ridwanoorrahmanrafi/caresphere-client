import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Users, CalendarHeart } from "lucide-react";

export default function Banner() {
  return (
    <section className="hero relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* DaisyUI Hero Content Container */}
      <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Community-Driven Social Development Platform</span>
            </div>

            {/* Main Heading with DaisyUI Text Rotate Component */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Turn Empathy into{" "}
              <span className="text-rotate duration-6000 align-baseline">
                <span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                    Action.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                    Impact.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
                    Change.
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Explore Upcoming Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/create-event"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <CalendarHeart className="w-4 h-4 text-emerald-500" />
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

          {/* Right Column: Visual Composition with floating cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* DaisyUI Stack Component: Stacked Community Initiative Cards */}
              <div className="stack stack-bottom w-full cursor-pointer">
                {/* Main Visual Image with DaisyUI Hover 3D & Aura Highlight */}
                <div className="hover-3d aura aura-glow rounded-3xl w-full">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
                      alt="Community Volunteers Distributing Winter Aid"
                      className="w-full h-80 sm:h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="badge badge-xs badge-success uppercase tracking-wider mb-1 font-bold">
                        Featured Initiative
                      </span>
                      <p className="text-base font-bold leading-tight drop-shadow-sm">
                        Winter Clothes Distribution for Underprivileged Children
                      </p>
                      <p className="text-xs text-slate-200 mt-1 flex items-center gap-1">
                        <span>Mirpur 10, Dhaka</span> • <span>Upcoming This Weekend</span>
                      </p>
                    </div>
                  </div>
                  {/* 8 hover zones needed for DaisyUI 3D effect */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                {/* Stack Card 2: Secondary initiative background card */}
                <div className="rounded-3xl border border-emerald-300/80 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 shadow-xl h-80 sm:h-96 flex items-end p-5">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    🌲 Urban Afforestation & Clean-up Drive
                  </span>
                </div>

                {/* Stack Card 3: Tertiary initiative background card */}
                <div className="rounded-3xl border border-teal-300/80 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 shadow-lg h-80 sm:h-96 flex items-end p-5">
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-300">
                    🩺 Free Child Health Checkup Camp
                  </span>
                </div>
              </div>

              {/* Floating Badge 1: Community Verified */}
              <div className="absolute -top-4 -left-4 sm:-left-6 p-3 rounded-2xl glass border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3 animate-bounce [animation-duration:4s]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">100% Transparent</p>
                  <p className="text-[11px] text-slate-500">Zero Intermediaries</p>
                </div>
              </div>

              {/* Floating Badge 2: Direct Impact */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 p-3 rounded-2xl glass border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Join as Volunteer</p>
                  <p className="text-[11px] text-slate-500">1-Click RSVP Tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
