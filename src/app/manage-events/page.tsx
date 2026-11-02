"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { SocialEvent } from "../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Home,
  ListOrdered,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  ExternalLink,
  PlusCircle,
  X,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { compressImage } from "@/utils/imageCompression";

const EVENT_TYPES = [
  "Donation Drive",
  "Clean-up",
  "Plantation",
  "Healthcare",
  "Education",
  "Food Relief",
  "Disaster Relief",
  "Other",
];

export default function ManageEventsPage() {
  const { user, authFetch } = useAuth();

  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [minDate, setMinDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilterType, setSelectedFilterType] = useState("All");
  const EVENTS_PER_PAGE = 5;

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<SocialEvent | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState(EVENT_TYPES[0]);
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [updating, setUpdating] = useState(false);

  const filteredEvents =
    selectedFilterType === "All"
      ? events
      : events.filter((e) => e.eventType === selectedFilterType);

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  const fetchManagedEvents = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE_URL}/events/manage`);
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error loading managed events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchManagedEvents();
    }
  }, [user]);

  // Open Update Modal
  const openEditModal = (event: SocialEvent) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditType(event.eventType);
    setEditThumbnail(event.thumbnail);
    setEditLocation(event.location);
    setEditDate(event.eventDate);
  };

  // Close Update Modal
  const closeEditModal = () => {
    setEditingEvent(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editingEvent) {
        closeEditModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingEvent]);

  // Handle Update Submit
  const handleEditThumbnailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }
    try {
      const compressedDataUrl = await compressImage(file, 1200, 800, 0.82);
      setEditThumbnail(compressedDataUrl);
      toast.success("Updated banner image loaded and optimized!");
    } catch {
      toast.error("Failed to process image file.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    // Strict future date validation
    const selectedTime = new Date(editDate).getTime();
    const now = new Date().getTime();
    if (selectedTime <= now) {
      toast.error("Event date must be in the future. Past dates cannot be set.");
      return;
    }

    try {
      setUpdating(true);
      const res = await authFetch(`${API_BASE_URL}/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          eventType: editType,
          thumbnail: editThumbnail.trim(),
          location: editLocation.trim(),
          eventDate: editDate,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Event updated successfully!");
        closeEditModal();
        fetchManagedEvents();
      } else {
        toast.error(data.message || "Failed to update event.");
      }
    } catch {
      toast.error("Failed to update event.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete with SweetAlert2 confirmation
  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Cancel",
      background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
    });

    if (result.isConfirmed) {
      try {
        const res = await authFetch(`${API_BASE_URL}/events/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success(data.message || "Event deleted successfully!");
          setEvents((prev) => prev.filter((e) => e._id !== id));
        } else {
          toast.error(data.message || "Failed to delete event.");
        }
      } catch {
        toast.error("Failed to delete event.");
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
                className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </li>
            <li className="font-semibold text-slate-900 dark:text-white">Manage Events</li>
          </ul>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Organizer Management</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Manage Your Events
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Viewing initiatives created under your account ({user?.email})
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={selectedFilterType}
              onChange={(e) => {
                setSelectedFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-sm select-bordered rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <option value="All">All Categories</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 py-6">
              <span className="loading loading-bars loading-md text-primary" />
              <span className="skeleton skeleton-text text-sm font-semibold">
                Loading your managed events...
              </span>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {/* Clean Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Hosted Events
                  </p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {events.length}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Active campaigns organized</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Categories Covered
                  </p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {new Set(events.map((e) => e.eventType)).size}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Distinct welfare sectors</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Clean Table Container */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {/* Mobile Card View (Visible on screens < md) */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedEvents.map((event) => (
                  <div key={event._id} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="badge badge-xs badge-soft badge-primary font-semibold">
                            {event.eventType}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {event.eventDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {event.title}
                        </h4>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{event.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline py-1.5 px-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public View</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(event)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id, event.title)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (Hidden on screens < md) */}
              <div className="overflow-x-auto hidden md:block">
                <table className="table table-zebra table-md w-full">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Scheduled Date</th>
                      <th>Location</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                              <img
                                src={event.thumbnail}
                                alt={event.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80";
                                }}
                              />
                            </div>
                            <div className="max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {event.title}
                              </p>
                              <Link
                                href={`/events/${event._id}`}
                                className="link link-primary link-hover text-xs inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>Public Page</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap">
                          <span className="badge badge-sm badge-soft badge-primary font-semibold">
                            {event.eventType}
                          </span>
                        </td>

                        <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{event.eventDate}</span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 max-w-xs truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </td>

                        <td className="text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(event)}
                              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                              title="Edit Event"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id, event.title)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {startIndex + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {filteredEvents.length}
                      </span>{" "}
                      events
                    </p>

                    <div className="join">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="join-item btn btn-xs sm:btn-sm btn-outline disabled:opacity-40"
                        title="Previous Page"
                      >
                        «
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`join-item btn btn-xs sm:btn-sm ${
                            currentPage === pageNumber
                              ? "btn-active !bg-emerald-600 !text-white !border-emerald-600"
                              : "btn-outline"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="join-item btn btn-xs sm:btn-sm btn-outline disabled:opacity-40"
                        title="Next Page"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Clean Empty State */
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-xl mx-auto space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Events Created Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                You haven&apos;t created any social service events under this account yet. Host an
                initiative today to mobilize volunteers across Bangladesh!
              </p>
            </div>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        )}

        {/* Update Modal */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Update Event Data
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
                    Press <kbd className="kbd kbd-xs">ESC</kbd> to close
                  </span>
                </div>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      minLength={5}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input input-sm input-bordered w-full rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Event Type */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Event Type *
                      </label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        className="select select-sm select-bordered w-full rounded-xl"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Event Date */}
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Event Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="input input-sm input-bordered w-full rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        minLength={3}
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="input input-sm input-bordered w-full rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Thumbnail Image *
                      </label>
                      <div className="space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditThumbnailFileChange}
                          className="file-input file-input-bordered file-input-xs sm:file-input-sm w-full rounded-xl"
                        />
                        <input
                          type="url"
                          value={editThumbnail}
                          onChange={(e) => setEditThumbnail(e.target.value)}
                          placeholder="Or paste banner image URL"
                          className="input input-xs sm:input-sm input-bordered w-full rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Event Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="textarea textarea-sm textarea-bordered w-full rounded-xl resize-y"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 transition-colors shadow-md shadow-emerald-500/20"
                  >
                    {updating ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}