import { API_URL } from "../auth/authContext";

/** Resolve CMS media paths against the backend that serves uploaded files. */
export const resolveCmsImage = (value: unknown): string | null => {
  if (typeof value !== "string") return null;

  const path = value.trim();
  if (!path) return null;
  if (/^(?:https?:|data:|blob:|\/\/)/i.test(path)) return path;

  // Vercel serves files committed under `public/uploads` from the site origin.
  // CMS may store the same path with or without the `public/` filesystem prefix.
  const backendPath = path.replace(/^\/+/, "").replace(/^public\//i, "");
  if (/^uploads(?:\/|$)/i.test(backendPath)) return `/${backendPath}`;
  if (/^(?:storage|media)(?:\/|$)/i.test(backendPath)) return `${API_URL}/${backendPath}`;

  // Keep site-owned assets such as `/images-webp/...` on the frontend origin.
  return path;
};
