import type { Metadata } from "next";
import React, { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CareSphere | Community Social Development Events Platform",
  description:
    "A community-driven event management platform where citizens create, join, and track social service and volunteer events in their local area.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "14px",
                  background: "#1e293b",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 500,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                },
              }}
            />
            <Suspense fallback={<div className="h-20 w-full glass border-b border-slate-200 dark:border-slate-800" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
