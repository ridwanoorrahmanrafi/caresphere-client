"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { JoinedEvent } from "../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  CalendarCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
  CalendarDays,
  ArrowRight,
  Tag,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function JoinedEventsPage() {
  const { user, authFetch } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
      // Requirement: Show all events joined by the logged-in user, sorted by event date
      const res = await authFetch(`${API_BASE_URL}/events/joined`);
      const data = await res.json();
      if (data.success && Array.isArray(data.joinedEvents)) {
        setJoinedEvents(data.joinedEvents);
      } else {
        setJoinedEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch joined events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoinedEvents();
    }
  }, [user]);

  const handleCancelRsvp = async (eventId: string, title: string) => {
    const result = await Swal.fire({
      title: "Cancel RSVP?",
      text: `Do you want to withdraw your attendance for "${title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Cancel RSVP",
      cancelButtonText: "Keep RSVP",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
    });

    if (result.isConfirmed) {
      try {
        const res = await authFetch(`${API_BASE_URL}/events/${eventId}/leave`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success(data.message || "RSVP cancelled.");
          setJoinedEvents((prev) => prev.filter((e) => e.eventId !== eventId));
        } else {
          toast.error(data.message || "Could not cancel RSVP.");
        }
      } catch {
        toast.error("Failed to cancel RSVP.");
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Volunteer Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Events You Have Joined
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing all volunteer commitments sorted by upcoming event date
          </p>
        </div>

        {/* Joined Events List / Cards */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 w-full rounded-2xl skeleton-shimmer bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : joinedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedEvents.map((joined) => (
              <div
                key={joined._id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={joined.thumbnail}
                      alt={joined.eventTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 backdrop-blur-md shadow-sm border border-white/20">
                        <Tag className="w-3 h-3" />
                        {joined.eventType}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{joined.eventDate}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                      {joined.eventTitle}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{joined.eventLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/events/${joined.eventId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View Event Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleCancelRsvp(joined.eventId, joined.eventTitle)}
                    className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                    title="Cancel RSVP"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-xl mx-auto space-y-4">
            <CalendarDays className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Joined Events Yet
            </h3>
            <p className="text-sm text-slate-500">
              You haven&apos;t joined any social development events yet. Browse upcoming events and
              RSVP to participate!
            </p>
            <Link
              href="/upcoming-events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
