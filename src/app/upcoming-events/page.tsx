"use client";

import React, { useEffect, useState, useRef } from "react";
import EventCard from "../../components/EventCard";
import SkeletonCard from "../../components/SkeletonCard";
import { SocialEvent } from "../../types";
import { Search, Filter, Calendar, Sparkles, Frown } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const CATEGORIES = [
  "All",
  "Donation Drive",
  "Clean-up",
  "Plantation",
  "Healthcare",
  "Education",
  "Food Relief",
];

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const EVENTS_PER_PAGE = 6;
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }
      if (selectedCategory && selectedCategory !== "All") {
        params.append("type", selectedCategory);
      }

      const res = await fetch(`${API_BASE_URL}/events/upcoming?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        // Double defense-in-depth: Ensure passed dates never appear
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const upcomingOnly = data.events.filter((e: SocialEvent) => {
          const eventTime = new Date(e.eventDate).getTime();
          return isNaN(eventTime) || eventTime >= now.getTime();
        });
        setEvents(upcomingOnly);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to load upcoming events:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* DaisyUI Hero Component with Overlay Image */}
      <div
        className="hero min-h-[20rem] rounded-3xl overflow-hidden relative shadow-xl border border-slate-200/80 dark:border-slate-800"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80)",
        }}
      >
        <div className="hero-overlay bg-slate-950/75 backdrop-blur-[1px]"></div>
        <div className="hero-content text-center text-white py-10 px-6">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <div className="status-ping-wrapper">
                <div aria-label="live opportunities" className="status status-xs status-success animate-ping"></div>
                <div aria-label="live opportunities" className="status status-xs status-success"></div>
              </div>
              <span>Active Grassroots Opportunities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              Upcoming Community Events
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
              Explore upcoming social service initiatives happening in your neighborhood. Discover verified drives, join active volunteer rosters, and drive positive local change.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* DaisyUI Join Component: Grouping Search Input, Category Select, and Search Button */}
        <div className="join join-vertical sm:join-horizontal w-full shadow-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grow">
            <label className="input input-lg input-ghost join-item w-full flex items-center border-none bg-transparent focus-within:outline-none">
              <Search className="w-5 h-5 opacity-60 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, keyword, or location (e.g. Mirpur, Clean-up)..."
                className="grow text-sm pl-2.5 bg-transparent focus:outline-none text-slate-900 dark:text-white"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 pointer-events-none text-slate-400">
                  <kbd className="kbd kbd-xs">Ctrl</kbd>
                  <span className="text-[10px]">+</span>
                  <kbd className="kbd kbd-xs">K</kbd>
                </div>
              )}
            </label>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-lg join-item bg-slate-50 dark:bg-slate-800/80 border-0 sm:border-l border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer focus:outline-none"
            aria-label="Filter events by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => fetchEvents()}
            className="join-item px-7 py-3 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Quick Category Tabs Bar with Smooth Horizontal Scrolling */}
        <div className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 px-2 text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Category:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg shrink-0 transition-colors cursor-pointer"
              title="Reset Filter"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Events Grid / Skeletons */}
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 py-4">
            <span className="loading loading-dots loading-md text-primary" />
            <span className="skeleton skeleton-text text-sm font-semibold">
              Filtering community events...
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* DaisyUI Pagination Component (using join & join-item btn) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {Math.min(startIndex + EVENTS_PER_PAGE, events.length)}
                </span>{" "}
                of <span className="font-bold text-slate-900 dark:text-white">{events.length}</span> events
              </p>

              <div className="join">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(p - 1, 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="join-item btn btn-sm btn-outline disabled:opacity-40"
                  title="Previous Page"
                >
                  «
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`join-item btn btn-sm ${
                      currentPage === pageNumber ? "btn-active !bg-emerald-600 !text-white !border-emerald-600" : "btn-outline"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="join-item btn btn-sm btn-outline disabled:opacity-40"
                  title="Next Page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div role="alert" className="alert alert-info alert-outline alert-vertical max-w-xl mx-auto py-12 px-6 shadow-sm">
          <Frown className="w-10 h-10 text-sky-500 mx-auto" />
          <div>
            <h3 className="text-xl font-bold">No Upcoming Events Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "All"
                ? "We couldn't find any events matching your criteria. Try adjusting your search query or category filter."
                : "There are no upcoming future events scheduled right now. Check back soon!"}
            </p>
          </div>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="btn btn-sm btn-primary inline-flex items-center gap-1.5 mt-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
