"use client";

import React from "react";
import {
  Users,
  CalendarCheck,
  ShieldCheck,
  HeartPulse,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Grassroots Event Creation",
    description:
      "Host local social welfare events in minutes. From blanket distribution in Mohammadpur to tree plantation drives in Uttara, publish your initiative with direct community reach.",
  },
  {
    icon: CalendarCheck,
    title: "Instant 1-Click RSVP",
    description:
      "Empowering volunteers to commit their time with a single tap. Your RSVP is securely linked to your profile so organizers can prepare accurate logistical arrangements.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Transparent Management",
    description:
      "Organizers maintain complete ownership of their created initiatives. Update schedules or manage participant lists securely with JWT-verified authorization.",
  },
  {
    icon: HeartPulse,
    title: "Tracked Real-Time Impact",
    description:
      "Keep track of every event you join under your personal Joined Events dashboard. Build your volunteer portfolio and see your contributions turn into smiles.",
  },
];

export default function Features() {
  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Users className="w-3.5 h-3.5" />
            <span>Why Choose CareSphere</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed for Passionate{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Community Changemakers
            </span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Every feature on CareSphere is built to eliminate friction between having good intentions
            and making tangible social impact on the ground.
          </p>
        </div>

        {/* 4 Equal Height & Width Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-7">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
