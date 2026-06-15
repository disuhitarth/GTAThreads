/**
 * Centralized env access. Edit your `.env` (copy from `.env.example`) — do not
 * hardcode these values in source. Both browser and server code can import this.
 *
 * VITE_* vars are bundled into the client at build time and are public-safe
 * (Storefront API token is meant to be public). Server-only secrets like
 * GROQ_API_KEY are read from `process.env` inside server functions.
 */

const isServer = typeof window === "undefined";

function read(name: string, fallback: string): string {
  // `import.meta.env` is statically replaced by Vite at build time.
  const fromVite = (import.meta.env as Record<string, string | undefined>)[name];
  if (fromVite && fromVite.length > 0) return fromVite;
  if (isServer && typeof process !== "undefined") {
    const fromProcess = process.env?.[name];
    if (fromProcess && fromProcess.length > 0) return fromProcess;
  }
  return fallback;
}

export const SHOPIFY_STORE_DOMAIN = read(
  "VITE_SHOPIFY_STORE_DOMAIN",
  "gtathreads-store.myshopify.com",
);

export const SHOPIFY_STOREFRONT_TOKEN = read(
  "VITE_SHOPIFY_STOREFRONT_TOKEN",
  "c9c83a40f0d6dd0a7cbe2a85329f6413",
);

export const SHOPIFY_API_VERSION = read("VITE_SHOPIFY_API_VERSION", "2026-04");

/** Absolute origin used in canonical URLs, JSON-LD, sitemap, OG tags. No trailing slash. */
export const SITE_URL = read("VITE_SITE_URL", "https://gtathreads.netlify.app").replace(/\/$/, "");

export const ADMIN_PASSWORD = read("ADMIN_PASSWORD", "");
export const SHOPIFY_ADMIN_TOKEN = read("SHOPIFY_ADMIN_TOKEN", "");
