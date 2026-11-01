"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { SocialEvent } from "../../types";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  ListOrdered,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  ExternalLink,
  PlusCircle,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

  // Handle Update Submit
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
              You can only view, edit, and delete events created by your account ({user?.email})
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20 shrink-0 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full rounded-2xl skeleton-shimmer bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-4 px-6">Event</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Scheduled Date</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Event thumbnail + title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=200&q=80";
                            }}
                          />
                          <div className="max-w-xs">
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {event.title}
                            </p>
                            <Link
                              href={`/events/${event._id}`}
                              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <span>Public Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {event.eventType}
                        </span>
                      </td>

                      {/* Scheduled Date */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{event.eventDate}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 max-w-xs truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </td>

                      {/* Actions: Update & Delete */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
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
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-xl mx-auto space-y-4">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Events Created Yet
            </h3>
            <p className="text-sm text-slate-500">
              You haven&apos;t created any social service events under this account. Host an initiative
              today to mobilize volunteers!
            </p>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
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
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Update Event Data</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Event Date (Future Date) *
                    </label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Thumbnail Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={editThumbnail}
                      onChange={(e) => setEditThumbnail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                        <Loader2 className="w-4 h-4 animate-spin" />
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
