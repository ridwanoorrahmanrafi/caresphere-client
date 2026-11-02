"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  HeartHandshake,
  Sun,
  Moon,
  PlusCircle,
  CalendarCheck,
  ListOrdered,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Calendar,
  Sparkles,
  TreePine,
  ArrowRight,
  ChevronDown,
  Home,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megamenuOpen, setMegamenuOpen] = useState(false);
  const [mobileInitiativesOpen, setMobileInitiativesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const megamenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (megamenuRef.current && !megamenuRef.current.contains(event.target as Node)) {
        setMegamenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMegamenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu and megamenu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setMegamenuOpen(false);
    setMobileInitiativesOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors">
      {/* DaisyUI Drawer Component for Mobile Navigation */}
      <div className="drawer">
        <input
          id="care-mobile-drawer"
          type="checkbox"
          className="drawer-toggle md:hidden"
          checked={mobileMenuOpen}
          onChange={(e) => setMobileMenuOpen(e.target.checked)}
        />

        {/* DaisyUI Drawer Content: Navbar Banner & Elements */}
        <div className="drawer-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* DaisyUI Navbar Component */}
            <div className="navbar min-h-20 p-0">
          {/* DaisyUI Navbar Start: App Logo / Name */}
          <div className="navbar-start">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl py-1 px-1"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  Care<span className="text-emerald-600 dark:text-emerald-400">Sphere</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600/80 dark:text-emerald-400/80 -mt-1 hidden sm:block">
                  Community Impact Platform
                </span>
              </div>
            </Link>
          </div>

          {/* DaisyUI Navbar Center: Desktop Navigation Links */}
          <div className="navbar-center hidden md:inline-flex">
            <nav className="flex items-center gap-1.5 lg:gap-2">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/")
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                Home
              </Link>

              <Link
                href="/upcoming-events"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/upcoming-events")
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Upcoming Events</span>
              </Link>

              <Link
                href="/create-event"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive("/create-event")
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host Event</span>
              </Link>

              {user && (
                <>
                  <Link
                    href="/manage-events"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive("/manage-events")
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                    <span>Manage Events</span>
                  </Link>
                  <Link
                    href="/joined-events"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive("/joined-events")
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Joined Events</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* DaisyUI Navbar End: Actions (Theme, Auth, Mobile) */}
          <div className="navbar-end gap-3 sm:gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
            {/* DaisyUI Theme Controller using swap-rotate */}
            <label
              className="swap swap-rotate p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-within:ring-2 focus-within:ring-emerald-500 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <input
                type="checkbox"
                value="dark"
                className="theme-controller"
                checked={mounted ? theme === "dark" : false}
                onChange={toggleTheme}
                aria-label="Toggle Theme"
              />
              <Moon className="swap-off w-5 h-5 text-slate-700 dark:text-slate-200" />
              <Sun className="swap-on w-5 h-5 text-amber-400" />
            </label>

            {/* Conditional Auth Section */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm shadow-emerald-500/20"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile Picture with Tooltip & Dropdown (DaisyUI Dropdown Component) */}
                <div
                  className={`dropdown dropdown-end relative ${dropdownOpen ? "dropdown-open" : ""}`}
                  ref={dropdownRef}
                >
                  <button
                    tabIndex={0}
                    role="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-emerald-500/80 transition-all focus:outline-none"
                    title={user.name || "User Profile"} // Hovering over profile picture shows user's display name
                  >
                    {/* DaisyUI Avatar with DaisyUI Indicator Component */}
                    <div className="avatar indicator">
                      <span className="indicator-item status status-success status-xs"></span>
                      <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                        <img
                          src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu (DaisyUI dropdown-content menu) */}
                  {dropdownOpen && (
                    <ul
                      tabIndex={-1}
                      className="dropdown-content menu menu-md menu-vertical absolute right-0 mt-3 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      {/* User Header with DaisyUI Status & Menu Title */}
                      <li className="menu-title px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] text-slate-400 font-medium normal-case">Signed in as</span>
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 normal-case">
                            <span aria-label="online" className="status status-xs status-success" />
                            <span>Online</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate normal-case">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate normal-case font-normal">
                          {user.email}
                        </p>
                      </li>

                      {/* Section Title */}
                      <li className="menu-title text-[10px] uppercase font-bold text-slate-400 mt-1">
                        Account Management
                      </li>

                      {/* Dropdown Items (Private Routes) */}
                      <li>
                        <Link
                          href="/create-event"
                          className={isActive("/create-event") ? "menu-active" : ""}
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-500" />
                          <span>Create Event</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/manage-events"
                          className={isActive("/manage-events") ? "menu-active" : ""}
                        >
                          <ListOrdered className="w-4 h-4 text-emerald-500" />
                          <span>Manage Events</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/joined-events"
                          className={isActive("/joined-events") ? "menu-active" : ""}
                        >
                          <CalendarCheck className="w-4 h-4 text-emerald-500" />
                          <span>Joined Events</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          className={isActive("/profile") ? "menu-active" : ""}
                        >
                          <UserIcon className="w-4 h-4 text-emerald-500" />
                          <span>My Profile</span>
                        </Link>
                      </li>

                      {/* Divider */}
                      <li />

                      {/* Logout option in dropdown */}
                      <li>
                        <button
                          onClick={logout}
                          className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>

                {/* Explicit Logout Button on Navbar */}
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile DaisyUI Theme Controller */}
            <label
              className="swap swap-rotate p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Toggle Theme"
            >
              <input
                type="checkbox"
                className="theme-controller"
                checked={mounted ? theme === "dark" : false}
                onChange={toggleTheme}
                aria-label="Toggle Theme"
              />
              <Moon className="swap-off w-5 h-5 text-slate-700 dark:text-slate-200" />
              <Sun className="swap-on w-5 h-5 text-amber-400" />
            </label>
            {/* Mobile DaisyUI Drawer Button */}
            <label
              htmlFor="care-mobile-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </label>
          </div>
        </div>
      </div>
      </div>
      </div>

      {/* DaisyUI Drawer Side */}
      <div className="drawer-side md:hidden z-1002">
        <label
          htmlFor="care-mobile-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></label>
        <aside className="p-5 w-72 sm:w-80 min-h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Care<span className="text-emerald-700 dark:text-emerald-400">Sphere</span>
                </span>
              </Link>
              <label
                htmlFor="care-mobile-drawer"
                className="btn btn-ghost btn-circle btn-sm cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5 text-slate-500" />
              </label>
            </div>

            {/* Navigation Links */}
            <ul className="menu menu-vertical p-0 gap-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-semibold ${isActive("/") ? "menu-active" : ""}`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/upcoming-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-semibold ${isActive("/upcoming-events") ? "menu-active" : ""}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Events</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-semibold ${isActive("/create-event") ? "menu-active" : ""}`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Host an Event</span>
                </Link>
              </li>
            </ul>

            {/* User Details & Portal Links */}
            {user ? (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <div className="avatar avatar-online">
                    <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500/80">
                      <img
                        src={user.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                <ul className="menu menu-vertical p-0 gap-1 text-sm">
                  <li>
                    <Link href="/create-event" onClick={() => setMobileMenuOpen(false)}>
                      <PlusCircle className="w-4 h-4 text-emerald-500" />
                      <span>Create Event</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/manage-events" onClick={() => setMobileMenuOpen(false)}>
                      <ListOrdered className="w-4 h-4 text-emerald-500" />
                      <span>Manage Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/joined-events" onClick={() => setMobileMenuOpen(false)}>
                      <CalendarCheck className="w-4 h-4 text-emerald-500" />
                      <span>Joined Events</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <UserIcon className="w-4 h-4 text-emerald-500" />
                      <span>My Profile</span>
                    </Link>
                  </li>
                </ul>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
      </div>
    </header>
  );
}
