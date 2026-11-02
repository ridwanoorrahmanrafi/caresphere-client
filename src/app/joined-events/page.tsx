"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { JoinedEvent } from "../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Home,
  CalendarCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Trash2,
  CalendarDays,
  ArrowRight,
  Tag,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

export default function JoinedEventsPage() {
  const { user, authFetch } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedType, setSelectedType] = useState<string>("All");

  const availableTypes = Array.from(new Set(joinedEvents.map((j) => j.eventType))).filter(Boolean);
  const filteredJoinedEvents =
    selectedType === "All"
      ? joinedEvents
      : joinedEvents.filter((j) => j.eventType === selectedType);

  const fetchJoinedEvents = async () => {
    try {
      setLoading(true);
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
        {/* Breadcrumbs */}
        <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
          <ul>
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <li className="font-semibold text-slate-900 dark:text-white">Joined Events</li>
          </ul>
        </div>

        {/* Page Header with List / Grid Switcher & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Volunteer Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Events You Have Joined
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing all volunteer commitments sorted by upcoming event date
            </p>
          </div>

          {joinedEvents.length > 0 && (
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              {availableTypes.length > 1 && (
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="select select-sm select-bordered rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                >
                  <option value="All">All Categories</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Next Immediate Drive Highlight Card */}
        {!loading && joinedEvents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent border border-indigo-500/20 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <span className="badge badge-sm badge-primary font-bold uppercase tracking-wider">
                Immediate Next Drive
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {joinedEvents[0]?.eventTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled for {new Date(joinedEvents[0]?.eventDate).toLocaleDateString()} at{" "}
                {joinedEvents[0]?.eventLocation}
              </p>
            </div>

            <Link
              href={`/events/${joinedEvents[0]?.eventId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-sm shadow-indigo-500/20 shrink-0"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Joined Events List / Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 py-6">
              <span className="loading loading-ring loading-md text-primary" />
              <span className="skeleton skeleton-text text-sm font-semibold">
                Retrieving your joined volunteer initiatives...
              </span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : joinedEvents.length > 0 ? (
          viewMode === "list" ? (
            /* List View */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
                <span>My Volunteer Commitments ({filteredJoinedEvents.length})</span>
                <span className="text-[11px] font-normal normal-case text-slate-500">
                  Sorted by upcoming event date
                </span>
              </div>

              {filteredJoinedEvents.map((joined) => (
                <div
                  key={joined._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 gap-4 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={joined.thumbnail}
                      alt={joined.eventTitle}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="badge badge-xs badge-soft badge-primary font-bold">
                          {joined.eventType}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          {joined.eventDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {joined.eventTitle}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{joined.eventLocation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/events/${joined.eventId}`}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                      title="View Event Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleCancelRsvp(joined.eventId, joined.eventTitle)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Cancel RSVP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Card Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJoinedEvents.map((joined) => (
                <div
                  key={joined._id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
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
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 backdrop-blur-md shadow-sm border border-white/20">
                          <Tag className="w-3 h-3" />
                          {joined.eventType}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-indigo-700 dark:text-indigo-300 backdrop-blur-md shadow-sm border border-white/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Confirmed</span>
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
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
                  <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                    <Link
                      href={`/events/${joined.eventId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>View Event</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleCancelRsvp(joined.eventId, joined.eventTitle)}
                      className="p-2 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Cancel RSVP"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
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
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5"
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