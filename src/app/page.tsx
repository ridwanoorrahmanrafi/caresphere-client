"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Banner from "../components/Banner";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";
import Newsletter from "../components/Newsletter";
import ImpactStats from "../components/ImpactStats";
import EventCard from "../components/EventCard";
import SkeletonCard from "../components/SkeletonCard";
import { SocialEvent } from "../types";
import { Calendar, ArrowRight, HeartHandshake } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentEvents(isInitial = false) {
      try {
        if (isInitial) setLoading(true);
        // Requirement: Show 6 recent upcoming events using .limit() operator of MongoDB
        const res = await fetch(`${API_BASE_URL}/events/upcoming?limit=6`);
        const data = await res.json();
        if (data.success && Array.isArray(data.events)) {
          setRecentEvents(data.events);
          setError(null);
        } else if (isInitial) {
          setError(data.message || "Failed to load events");
        }
      } catch (err: any) {
        if (isInitial) {
          console.warn("Could not fetch events from server:", err.message);
          setError("Connecting to server...");
        }
      } finally {
        if (isInitial) setLoading(false);
      }
    }

    fetchRecentEvents(true);

    // Real-time synchronization poll every 5 seconds
    const interval = setInterval(() => {
      fetchRecentEvents(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* 1. Banner Section */}
      <Banner />

      {/* 2. Impact Statistics (Extra WOW Section) */}
      <ImpactStats />

      {/* 3. Recent Upcoming Events Section (Dynamic - MongoDB .limit(6)) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming Initiatives</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Recent Upcoming Events
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Join active community drives happening soon in your area. Grab your gloves, share your
              warmth, or lend a helping hand.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group shrink-0"
          >
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Server Notice Alert */}
        {error && !loading && (
          <div role="alert" className="alert alert-warning alert-soft alert-vertical sm:alert-horizontal mb-6 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs">
              <span className="font-bold">Server Notice:</span> {error}
            </div>
          </div>
        )}

        {/* 2 or 3 Column Responsive Grid */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 py-4">
              <span className="loading loading-infinity loading-lg text-indigo-600" />
              <span className="skeleton skeleton-text text-sm font-semibold">
                Fetching latest community initiatives...
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : recentEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              No Upcoming Events Found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Be the first community leader to host a social development event in your area!
            </p>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              Create an Event Now
            </Link>
          </div>
        )}
      </section>

      {/* 4. Feature Section */}
      <Features />

      {/* 5. Gallery Section */}
      <Gallery />

      {/* 6. FAQ Section */}
      <FAQ />

      {/* 7. Newsletter Section */}
      <Newsletter />
    </div>
  );
}
