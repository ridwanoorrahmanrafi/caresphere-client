/**
 * CareSphere API Configuration
 *
 * In development: defaults to http://localhost:5000/api
 * In production / Vercel: defaults to https://caresphere-server.vercel.app/api
 * Can be overridden via NEXT_PUBLIC_API_URL environment variable on Vercel
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://caresphere-server.vercel.app/api"
    : process.env.NODE_ENV === "production"
    ? "https://caresphere-server.vercel.app/api"
    : "http://localhost:5000/api");

