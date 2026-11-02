"use client";

import React, { useState } from "react";
import {
  Users,
  CalendarCheck,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Monitor,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Grassroots Event Creation",
    description:
      "Host local social welfare events in minutes. From blanket distribution in Mohammadpur to tree plantation drives in Uttara, publish your initiative with future scheduling and direct community reach.",
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
  const [activeMockup, setActiveMockup] = useState<"window" | "browser">("window");

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
            <span className="text-rotate duration-6000 text-emerald-600 dark:text-emerald-400">
              <span>
                <span>Volunteers</span>
                <span>Organizers</span>
                <span>Changemakers</span>
              </span>
            </span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
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
                className="card card-border rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="card-body p-7">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="card-title text-lg font-bold text-slate-900 dark:text-white mb-2">
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

        {/* Interactive Mockup Showcase: DaisyUI Window Mockup & DaisyUI Browser Mockup */}
        <div className="mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="badge badge-success badge-sm font-bold uppercase tracking-wider">
                Platform Interface Demos
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Experience CareSphere on Any System
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Switch between the desktop operations window and the cloud browser application.
              </p>
            </div>

            {/* DaisyUI Tabs for switching views */}
            <div className="tabs tabs-box bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setActiveMockup("window")}
                className={`tab tab-sm font-semibold rounded-xl transition-all ${activeMockup === "window"
                    ? "tab-active !bg-emerald-600 !text-white shadow-md shadow-emerald-600/30 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                <Monitor className="w-3.5 h-3.5 mr-1.5" />
                <span>Window Mockup</span>
              </button>
              <button
                onClick={() => setActiveMockup("browser")}
                className={`tab tab-sm font-semibold rounded-xl transition-all ${activeMockup === "browser"
                    ? "tab-active !bg-emerald-600 !text-white shadow-md shadow-emerald-600/30 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                <span>Browser Mockup</span>
              </button>
            </div>
          </div>

          {/* View 1: DaisyUI Window Mockup (OS Window with border and base-100 background) */}
          {activeMockup === "window" && (
            <div className="mockup-window border border-base-300 bg-base-100 w-full shadow-2xl animate-in fade-in duration-300">
              <div className="border-t border-base-300 p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider">
                        CareSphere OS Dispatch v2.4
                      </span>
                      <span className="badge badge-outline badge-sm text-xs font-mono">
                        node-dhaka-01:ready
                      </span>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Volunteer Coordination Operations Center
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Desktop command console showing real-time emergency relief logistics, volunteer status, and resource allocation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="status status-success status-xs animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Telemetry Synchronized
                    </span>
                  </div>
                </div>

                {/* 3 Metric cards in Window Mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-base-200 border border-base-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Winter Clothing Drive</span>
                      <span className="badge badge-xs badge-success font-semibold">Active</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Mirpur 10, Dhaka</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-600">48 Volunteers Dispatched</span>
                      <span className="text-slate-400">96% Quota</span>
                    </div>
                    <progress className="progress progress-primary w-full h-1.5" value="96" max="100"></progress>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-200 border border-base-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dhanmondi Lake Clean-Up</span>
                      <span className="badge badge-xs badge-teal font-semibold">Full</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Dhanmondi 8/A</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-teal-600">65 Volunteers Dispatched</span>
                      <span className="text-slate-400">100% Quota</span>
                    </div>
                    <progress className="progress progress-teal w-full h-1.5" value="100" max="100"></progress>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-200 border border-base-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Child Health & Vision</span>
                      <span className="badge badge-xs badge-error font-semibold">Urgent</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Lalbagh, Old Dhaka</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-rose-600">32 Volunteers Dispatched</span>
                      <span className="text-slate-400">64% Quota</span>
                    </div>
                    <progress className="progress progress-error w-full h-1.5" value="64" max="100"></progress>
                  </div>
                </div>

                {/* Console Command Prompt inside Window Mockup */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 overflow-x-auto shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>Terminal: caresphere-worker-daemon</span>
                    <span className="text-emerald-400">● LIVE FEED</span>
                  </div>
                  <p className="text-slate-400">[2026-11-01 22:05:12] <span className="text-emerald-400">SYNC:</span> 128 volunteer check-ins verified across 8 zones.</p>
                  <p className="text-slate-400">[2026-11-01 22:06:44] <span className="text-teal-400">LOGISTICS:</span> 500 blankets dispatched to Mirpur field station.</p>
                  <p className="text-slate-400">[2026-11-01 22:07:01] <span className="text-sky-400">DISPATCH:</span> Medical team arrived at Lalbagh Community Clinic.</p>
                </div>
              </div>
            </div>
          )}

          {/* View 2: DaisyUI Browser Mockup (Web application window with URL bar) */}
          {activeMockup === "browser" && (
            <div className="mockup-browser border border-base-300 bg-base-100 w-full shadow-2xl animate-in fade-in duration-300">
              <div className="mockup-browser-toolbar">
                <div className="input">https://caresphere.community/portal/live-dashboard</div>
              </div>
              <div className="p-6 sm:p-10 border-t border-base-300 bg-slate-50/60 dark:bg-slate-950/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="badge badge-success badge-sm font-bold uppercase tracking-wider">
                      Live Web Portal Preview
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Grassroots Coordination In Action
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Real-time synchronization between event creators, neighborhood volunteers, and relief distribution points.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="status status-success status-xs animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      4 Active Drives in Progress
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Winter Aid Drive</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Mirpur 10, Dhaka</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-600">48 Volunteers</span>
                      <span className="badge badge-xs badge-success">96% Quota</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Dhanmondi Lake Clean-Up</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Dhanmondi 8/A</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-teal-600">65 Volunteers</span>
                      <span className="badge badge-xs badge-teal">Full</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Child Health & Vision</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">Lalbagh, Old Dhaka</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-rose-600">32 Volunteers</span>
                      <span className="badge badge-xs badge-error">Urgent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
