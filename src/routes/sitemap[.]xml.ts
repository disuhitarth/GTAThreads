import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";
import { OCCASIONS } from "@/lib/occasions";
import { POSTS } from "@/components/sections/JournalTeaser";
import { fetchProducts } from "@/lib/shopify";
import { SITE_URL } from "@/lib/env";

const BASE_URL = SITE_URL;

interface Entry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

const STATIC: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/category", changefreq: "weekly", priority: "0.7" },
  { path: "/occasions", changefreq: "weekly", priority: "0.7" },
  { path: "/lookbook", changefreq: "monthly", priority: "0.6" },
  { path: "/gift-finder", changefreq: "monthly", priority: "0.6" },
  { path: "/journal", changefreq: "weekly", priority: "0.6" },
  { path: "/about", changefreq: "yearly", priority: "0.5" },
  { path: "/custom-orders", changefreq: "monthly", priority: "0.6" },
  { path: "/size-guide", changefreq: "yearly", priority: "0.4" },
  { path: "/care", changefreq: "yearly", priority: "0.4" },
  { path: "/shipping-returns", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [...STATIC];
        for (const c of CATEGORIES)
          entries.push({ path: `/category/${c.slug}`, changefreq: "weekly", priority: "0.8" });
        for (const o of OCCASIONS)
          entries.push({ path: `/occasions/${o.slug}`, changefreq: "weekly", priority: "0.8" });
        for (const p of POSTS)
          entries.push({ path: `/journal/${p.slug}`, changefreq: "monthly", priority: "0.5" });
        try {
          const products = await fetchProducts(100);
          for (const p of products)
            entries.push({
              path: `/product/${p.node.handle}`,
              changefreq: "weekly",
              priority: "0.7",
            });
        } catch {
          // If Shopify is unreachable, ship the static + content portion.
        }

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${escape(BASE_URL + e.path)}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls +
          `\n</urlset>\n`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=600",
          },
        });
      },
    },
  },
});

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
