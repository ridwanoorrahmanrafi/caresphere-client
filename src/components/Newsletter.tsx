"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to CareSphere updates!");
    setEmail("");
  };

  return (
    <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-950 via-indigo-950/70 to-slate-900 p-8 sm:p-14 text-white shadow-2xl border border-indigo-800/40">
          {/* Subtle background glow circle */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto border border-indigo-400/30">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Stay Informed on Upcoming Social Drives
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Get weekly roundups of volunteer opportunities, flood & cold wave relief calls, and
              community impact stories directly in your inbox. No spam, ever.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <span>You are subscribed to the CareSphere weekly newsletter!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 dark:bg-black/30 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors backdrop-blur-md"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-slate-400 pt-2">
              Join 8,400+ changemakers who receive our community updates every Friday.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
