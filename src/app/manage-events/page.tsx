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
  Layers,
  Sparkles,
  Filter,
} from "lucide-react";
import { API_BASE_URL } from "@/config/api";

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

  const filteredEvents = selectedFilterType === "All"
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
  const handleEditThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setEditThumbnail(reader.result);
        toast.success("Updated banner image loaded!");
      }
    };
    reader.readAsDataURL(file);
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
      {/* DaisyUI Drawer Component for Organizer Tools & Navigation */}
      <div className="drawer">
        <input id="organizer-tools-drawer" type="checkbox" className="drawer-toggle" />

        {/* DaisyUI Drawer Content: Primary Manage Events View */}
        <div className="drawer-content py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* DaisyUI Breadcrumbs */}
          <div className="breadcrumbs text-sm text-slate-500 dark:text-slate-400">
            <ul>
              <li>
                <Link href="/" className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li className="font-semibold text-slate-900 dark:text-white">
                Manage Events
              </li>
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
                You can only view, edit, and delete events created by your account ({user?.email})
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              {/* DaisyUI Drawer Button Trigger */}
              <label
                htmlFor="organizer-tools-drawer"
                className="btn btn-outline btn-sm drawer-button flex items-center gap-1.5 rounded-xl cursor-pointer"
              >
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>Organizer Tools</span>
              </label>

              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            </div>
          </div>

        {/* DaisyUI Alert Component: Security Perimeter Notice */}
        <div role="alert" className="alert alert-info alert-soft alert-vertical sm:alert-horizontal shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6 text-sky-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-800 dark:text-sky-300">
              Organizer Security Perimeter
            </h4>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              You are signed in as <span className="font-semibold text-slate-900 dark:text-white">{user?.email}</span>. You have verified rights to view, edit, and manage your hosted initiatives.
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="badge badge-sm badge-success font-semibold">Active</span>
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
              <div
                key={i}
                className="skeleton h-24 w-full rounded-2xl"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {/* DaisyUI Stat Primitives: Organizer Activity Overview */}
            <div className="stats stats-vertical sm:stats-horizontal shadow-sm w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
              <div className="stat py-4 px-6">
                <div className="stat-figure text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-7 h-7 opacity-80" />
                </div>
                <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Hosted Events
                </div>
                <div className="stat-value text-2xl font-black text-slate-900 dark:text-white">
                  {events.length}
                </div>
                <div className="stat-desc text-xs text-slate-500">
                  Active campaigns organized
                </div>
                <progress
                  className="progress progress-primary w-full h-1.5 mt-2"
                  value={Math.min(100, events.length * 20)}
                  max="100"
                ></progress>
              </div>

              <div className="stat py-4 px-6">
                <div className="stat-figure">
                  <div
                    className="radial-progress text-secondary font-bold text-[10px]"
                    style={{
                      "--value": Math.min(100, Math.round((new Set(events.map((e) => e.eventType)).size / 8) * 100)),
                      "--size": "2.75rem",
                      "--thickness": "3px",
                    } as React.CSSProperties}
                    role="progressbar"
                    aria-valuenow={Math.min(100, Math.round((new Set(events.map((e) => e.eventType)).size / 8) * 100))}
                  >
                    {Math.min(100, Math.round((new Set(events.map((e) => e.eventType)).size / 8) * 100))}%
                  </div>
                </div>
                <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">
                  Categories Covered
                </div>
                <div className="stat-value text-2xl font-black text-slate-900 dark:text-white">
                  {new Set(events.map((e) => e.eventType)).size}
                </div>
                <div className="stat-desc text-xs text-slate-500">
                  Unique welfare sectors
                </div>
                <progress
                  className="progress progress-secondary w-full h-1.5 mt-2"
                  value={Math.min(100, Math.round((new Set(events.map((e) => e.eventType)).size / 8) * 100))}
                  max="100"
                ></progress>
              </div>

              <div className="stat py-4 px-6">
                <div className="stat-figure">
                  <div
                    className="radial-progress text-success font-bold text-[10px]"
                    style={{
                      "--value": 100,
                      "--size": "2.75rem",
                      "--thickness": "3px",
                    } as React.CSSProperties}
                    role="progressbar"
                    aria-valuenow={100}
                  >
                    100%
                  </div>
                </div>
                <div className="stat-title text-xs font-bold uppercase tracking-wider text-slate-400">
                  Organizer Status
                </div>
                <div className="stat-value text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span className="status status-sm status-success"></span>
                  <span>Verified</span>
                </div>
                <div className="stat-desc text-xs text-slate-500">
                  Full CRUD permissions enabled
                </div>
                <progress
                  className="progress progress-success w-full h-1.5 mt-2"
                  value="100"
                  max="100"
                ></progress>
              </div>
            </div>

            {/* DaisyUI Filter Component (without HTML Form using .filter-reset) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Filter by Category:
                </span>
              </div>

              <div className="filter flex-wrap">
                <input
                  className="btn filter-reset btn-xs sm:btn-sm"
                  type="radio"
                  name="manage-events-filter"
                  aria-label="All"
                  checked={selectedFilterType === "All"}
                  onChange={() => {
                    setSelectedFilterType("All");
                    setCurrentPage(1);
                  }}
                />
                {EVENT_TYPES.map((type) => (
                  <input
                    key={type}
                    className="btn btn-xs sm:btn-sm btn-outline text-xs"
                    type="radio"
                    name="manage-events-filter"
                    checked={selectedFilterType === type}
                    onChange={() => {
                      setSelectedFilterType(type);
                      setCurrentPage(1);
                    }}
                    aria-label={type}
                  />
                ))}
              </div>
            </div>

            {/* DaisyUI Window Mockup Component: Organizer Management Console Window */}
            <div className="mockup-window border border-base-300 bg-base-100 shadow-xl overflow-hidden">
              {/* Mobile Card View (Visible on screens < md) */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 border-t border-base-300">
                {paginatedEvents.map((event) => (
                  <div key={event._id} className="p-4 space-y-3 bg-white dark:bg-slate-900">
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
              <div className="border-t border-base-300 overflow-x-auto hidden md:block">
                <table className="table table-zebra table-md w-full">
                  <thead className="bg-slate-50/80 dark:bg-slate-850/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="w-12">
                        <label className="cursor-pointer flex items-center">
                          <input type="checkbox" className="checkbox checkbox-primary checkbox-xs" title="Select all" />
                        </label>
                      </th>
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
                        className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td>
                          <label className="cursor-pointer flex items-center">
                            <input type="checkbox" className="checkbox checkbox-primary checkbox-xs" />
                          </label>
                        </td>
                        {/* Event thumbnail + title with DaisyUI Avatar */}
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
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

                        {/* Event Type with DaisyUI Badge */}
                        <td className="whitespace-nowrap">
                          <span className="badge badge-sm badge-soft badge-primary font-semibold">
                            {event.eventType}
                          </span>
                        </td>

                        {/* Scheduled Date */}
                        <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{event.eventDate}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="whitespace-nowrap text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5 max-w-xs truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </td>

                        {/* Actions: Update & Delete */}
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
                  <tfoot className="bg-slate-50/60 dark:bg-slate-850/60 text-xs font-bold uppercase tracking-wider text-slate-400 border-t border-slate-200 dark:border-slate-800">
                    <tr>
                      <th>
                        <label className="cursor-pointer flex items-center">
                          <input type="checkbox" className="checkbox checkbox-primary checkbox-xs" />
                        </label>
                      </th>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Scheduled Date</th>
                      <th>Location</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </tfoot>
                </table>

                {/* DaisyUI Pagination for Manage Events (using join & join-item btn) */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing <span className="font-bold text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)}
                      </span>{" "}
                      of <span className="font-bold text-slate-900 dark:text-white">{filteredEvents.length}</span> events
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
                            currentPage === pageNumber ? "btn-active !bg-emerald-600 !text-white !border-emerald-600" : "btn-outline"
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
          /* DaisyUI Window Mockup: Empty State OS Window */
          <div className="mockup-window border border-base-300 bg-base-100 max-w-xl mx-auto shadow-sm">
            <div className="grid place-content-center border-t border-base-300 p-8 sm:p-12 text-center space-y-4">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Events Created Yet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  You haven&apos;t created any social service events under this account yet. Host an initiative
                  today to mobilize volunteers across Bangladesh!
                </p>
              </div>
              <Link
                href="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 mx-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Event</span>
              </Link>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Update Event Data</h2>
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
                <fieldset className="fieldset bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 gap-3.5">
                  <legend className="fieldset-legend text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Event Details
                  </legend>

                  {/* Title with DaisyUI Floating Label */}
                  <div className="space-y-1">
                    <label className="floating-label">
                      <span>Event Title *</span>
                      <input
                        type="text"
                        required
                        minLength={5}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input input-sm input-primary validator w-full"
                      />
                    </label>
                    <p className="validator-hint hidden">Event title must be at least 5 characters</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* DaisyUI Label for Select Component */}
                    <div className="space-y-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Event Type *
                      </span>
                      <label className="select select-sm select-primary w-full">
                        <span className="label font-semibold">Type</span>
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value)}
                          className="cursor-pointer"
                        >
                          {EVENT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {/* DaisyUI Label for Date Input Component */}
                    <div className="space-y-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Event Date *
                      </span>
                      <label className="input input-sm input-primary w-full">
                        <span className="label font-semibold">Date</span>
                        <input
                          type="date"
                          required
                          min={minDate}
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="floating-label">
                        <span>Location *</span>
                        <input
                          type="text"
                          required
                          minLength={3}
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="input input-sm input-primary validator w-full"
                        />
                      </label>
                      <p className="validator-hint hidden">Please enter a valid location</p>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        Thumbnail Image *
                      </span>
                      <div className="space-y-1.5">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditThumbnailFileChange}
                          className="file-input file-input-primary file-input-xs sm:file-input-sm w-full"
                        />
                        <label className="input input-xs sm:input-sm input-primary w-full flex items-center gap-2">
                          <input
                            type="url"
                            value={editThumbnail}
                            onChange={(e) => setEditThumbnail(e.target.value)}
                            placeholder="Or paste banner image URL"
                            className="grow"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Description with DaisyUI Floating Label */}
                  <div className="space-y-1">
                    <label className="floating-label">
                      <span>Event Description *</span>
                      <textarea
                        required
                        rows={4}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="textarea textarea-sm textarea-primary w-full resize-y"
                      />
                    </label>
                  </div>

                  <p className="label text-[11px] text-slate-500 dark:text-slate-400">
                    Modifications will be immediately reflected in the public event feed and volunteer registrations.
                  </p>
                </fieldset>

                {/* DaisyUI Divider Component */}
                <div className="divider my-1"></div>

                <div className="flex items-center justify-end gap-3 pt-1">
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
                {updating && (
                  <div className="pt-2">
                    <progress className="progress progress-primary w-full h-1.5"></progress>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>

      {/* DaisyUI Drawer Side */}
      <div className="drawer-side z-1002">
        <label htmlFor="organizer-tools-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="p-6 w-80 min-h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Organizer Tools</h3>
                  <p className="text-[11px] text-slate-400">Quick Filters & Dashboard</p>
                </div>
              </div>
              <label
                htmlFor="organizer-tools-drawer"
                className="btn btn-ghost btn-circle btn-xs cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </label>
            </div>

            {/* Quick Category Filter List */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Filter by Category
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedFilterType("All");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedFilterType === "All"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>All Events</span>
                  <span className="badge badge-xs badge-neutral">{events.length}</span>
                </button>
                {EVENT_TYPES.map((t) => {
                  const count = events.filter((e) => e.eventType === t).length;
                  return (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedFilterType(t);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedFilterType === t
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{t}</span>
                      {count > 0 && (
                        <span className="badge badge-xs badge-primary">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Menu */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Actions
              </p>
              <ul className="menu menu-sm bg-slate-50 dark:bg-slate-800/40 rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-800">
                <li>
                  <Link href="/create-event">
                    <PlusCircle className="w-4 h-4 text-emerald-500" />
                    <span>Host New Event</span>
                  </Link>
                </li>
                <li>
                  <Link href="/joined-events">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Joined Events</span>
                  </Link>
                </li>
                <li>
                  <Link href="/upcoming-events">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Public Calendar</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label
              htmlFor="organizer-tools-drawer"
              className="btn btn-sm btn-outline w-full cursor-pointer"
            >
              Close Drawer
            </label>
          </div>
        </aside>
      </div>
      </div>
    </ProtectedRoute>
  );
}
