import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL } from "@/lib/env";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Grain } from "@/components/Grain";
import { FlowerCursor } from "@/components/FlowerCursor";
import { CareChat } from "@/components/CareChat";
import { CookieConsent } from "@/components/CookieConsent";
import { Toaster } from "@/components/ui/sonner";
import { useCartSync } from "@/hooks/useCartSync";
import { fetchCollections } from "@/lib/shopify";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl italic text-bloom">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page wandered off into the garden.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          Back home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl italic">A loose thread.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Let's try that again.</p>
        {error.message && (
          <p className="mt-4 rounded-xl border border-dashed border-border bg-card p-3 text-xs text-muted-foreground/80 max-w-sm mx-auto break-words text-left font-mono">
            {error.message}
          </p>
        )}
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GTA Threads — Gifts, stitched with love" },
      {
        name: "description",
        content:
          "Hand-embroidered sweatshirts, tees, totes and baby pieces for Valentine's, Mother's Day, baby, Christmas and birthdays. Made in Toronto.",
      },
      { name: "author", content: "GTA Threads" },
      { name: "theme-color", content: "#FFF7F3" },
      { property: "og:site_name", content: "GTA Threads" },
      { property: "og:locale", content: "en_CA" },
      { property: "og:title", content: "GTA Threads — Gifts, stitched with love" },
      {
        property: "og:description",
        content:
          "Custom embroidered gifts from a small Toronto studio. For her, for him, for the babies, for every celebration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GTA Threads — Gifts, stitched with love" },
      {
        name: "twitter:description",
        content: "Custom embroidered gifts from a small Toronto studio.",
      },
      { property: "og:image", content: `${SITE_URL}/og-default.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE_URL}/og-default.png` },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@400;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "GTA Threads",
          url: SITE_URL,
          description:
            "A small embroidery studio in Toronto making hand-stitched gifts for every occasion.",
          areaServed: "Greater Toronto Area",
          sameAs: [
            "https://www.instagram.com/gta_threads/",
            "https://www.etsy.com/ca/shop/giftedthreads25",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "GTA Threads",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/shop?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["collections"],
      queryFn: () => fetchCollections(50),
      staleTime: 1000 * 60 * 5,
    });
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

function AppShell() {
  useCartSync();
  return (
    <div className="relative min-h-screen bg-background">
      <Grain />
      <FlowerCursor />
      <Header />
      <main className="animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CareChat />
      <CookieConsent />
      <Toaster position="top-center" />
    </div>
  );
}
