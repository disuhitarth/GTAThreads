# Instructions for AI assistants (Cursor / Claude Code / Copilot / etc.)

Read this before making any changes. This file is the source of truth for project state.

## Project Status

**Phase 1 (Launch Readiness) — Done.** ✅ Shopify (Storefront + Admin), ✅ Groq, ✅ OG image assets.
**Phases 3 (Fluid UX) — Done.** Search, wishlist, accounts, password reset, GiftFinder, mobile fixes.
**Phase 4 (Scale/Polish) — Done.** Performance, a11y, testing, multi-currency, extra polish.

Remaining (needs human with API keys):
- NEEDS HUMAN: Sentry DSN for error monitoring (see SETUP.md)
- NEEDS HUMAN: Shopify Admin API token for admin dashboard and newsletter
- NEEDS HUMAN: Google Places API key + Place ID for reviews
- NEEDS HUMAN: Judge.me API credentials for product reviews
- NEEDS HUMAN (future): Tracking API key (AfterShip/Shippo/EasyPost)

## Stack
- **TanStack Start v1** (React 19, Vite 7) — SSR + file-based routing.
- **Tailwind CSS v4** via `src/styles.css` (no `tailwind.config.js`).
- **bun** as package manager (or npm/pnpm — all work). Use `bun install` / `bun run dev`.
- **Zustand** for cart, wishlist, auth, currency, recently viewed — all persisted to localStorage with SSR-safe guards.
- **TanStack Query** for all Shopify data fetching.
- **Shopify Storefront API** (headless) — only source of truth for products, cart, checkout.
- **AI SDK** (`ai` + `@ai-sdk/openai-compatible`) for Care chatbot via Groq (free, Llama 3.3 70B).
- **Sentry** wired (DSN needed from human).
- **Playwright** (5 E2E smoke tests), **Vitest + RTL** (6 unit tests).

## Hard rules
1. **Routing is file-based** under `src/routes/`. Never edit `src/routeTree.gen.ts` — it's auto-generated. Flat dot-separated naming: `journal.$slug.tsx` → `/journal/:slug`.
2. **No mock products.** All product data must come from Shopify via `src/lib/shopify.ts`. Show "No products found" rather than placeholders.
3. **No manual checkout URLs.** Cart goes through the Storefront API mutations in `src/lib/shopify.ts` + `src/stores/cartStore.ts`. The `checkoutUrl` returned by `cartCreate` is the only valid checkout entry point. Always include `?channel=online_store` (already handled) and open with `window.open(url, '_blank')`.
4. **Server logic split:**
   - App-internal RPC → `createServerFn` in `src/lib/*.functions.ts` (callable via `useServerFn`).
   - Raw HTTP (webhooks, public APIs) → `src/routes/api/*.ts` server routes.
   - Anything reading `process.env.*` or external secrets must live server-side.
5. **All env vars go through `src/lib/env.ts`** — do not hardcode. Add new vars to both `src/lib/env.ts` and `.env.example`.
6. **SEO conventions are already established.** Every route's `head()` sets a unique `title`, `description`, canonical, OG + Twitter tags. Dynamic routes pull from loader data. Keep this pattern when adding routes. `og:image` belongs on leaf routes only.
7. **Design tokens only.** Use semantic Tailwind classes (`bg-background`, `text-bloom`, `font-display`). Don't introduce raw `text-white` / hex colors. Tokens are defined in `src/styles.css`.
8. **Always add explicit `component:` property** to route definitions. Don't rely on default export auto-detection.
9. **Zustand persist stores must use SSR-safe storage**: `createJSONStorage(() => typeof window !== "undefined" ? localStorage : undefined!)`. Already done in all 5 stores.

## File map

| Path | Purpose |
|---|---|
| `src/routes/__root.tsx` | Root layout, global meta, JSON-LD, CookieConsent |
| `src/routes/index.tsx` | Homepage (hero, featured, GiftFinder, journal, marquee, brand-story, lookbook, reviews, etc.) |
| `src/routes/shop.tsx` | Full catalog with sort/filter (collection, size, price, sort) |
| `src/routes/product.$handle.tsx` | PDP + JSON-LD + image zoom + share + recently viewed + related products |
| `src/routes/collections.$handle.tsx` | Collection listing |
| `src/routes/occasions/$slug.tsx` | Occasion landing pages |
| `src/routes/wishlist.tsx` | Saved items |
| `src/routes/account.tsx` | Customer dashboard with order history |
| `src/routes/login.tsx` | Customer login |
| `src/routes/register.tsx` | Customer registration |
| `src/routes/reset-password.tsx` | Password reset |
| `src/routes/custom-orders.tsx` | 8-step wizard (mailto: submission) |
| `src/routes/care.tsx` | Care instructions |
| `src/routes/shipping-returns.tsx` | Shipping & returns |
| `src/routes/size-guide.tsx` | Sizing tables |
| `src/routes/lookbook.tsx` | Editorial lookbook |
| `src/routes/gift-finder.tsx` | Standalone /gift-finder |
| `src/routes/about.tsx` | Brand story |
| `src/routes/privacy.tsx` | Privacy Policy |
| `src/routes/terms.tsx` | Terms of Service |
| `src/routes/journal.index.tsx` | Blog listing |
| `src/routes/journal.$slug.tsx` | Blog post |
| `src/routes/category.index.tsx` | Category listing |
| `src/routes/category.$slug.tsx` | Category detail |
| `src/routes/occasions.index.tsx` | Occasion listing |
| `src/routes/sitemap[.]xml.ts` | Dynamic sitemap |
| `src/routes/api/chat.ts` | Chatbot streaming via Groq |
| `src/routes/admin.tsx` | Admin layout shell (Phase 2) |
| `src/routes/admin.index.tsx` | Admin dashboard (Phase 2) |
| `src/routes/admin.products.tsx` | Admin product listing (Phase 2) |
| `src/routes/admin.orders.tsx` | Admin order listing (Phase 2) |
| `src/lib/shopify.ts` | All Storefront API queries + cart mutations + customer auth |
| `src/lib/env.ts` | Centralized env var access |
| `src/lib/admin-api.functions.ts` | Admin server functions (Phase 2) |
| `src/lib/newsletter.functions.ts` | Shopify Admin API newsletter subscription |
| `src/lib/reviews.functions.ts` | Google Places API review fetching |
| `src/lib/tracking.functions.ts` | **STUB** — shipment tracking lookup |
| `src/lib/lovable-error-reporting.ts` | Sentry error reporting (console fallback without DSN) |
| `src/lib/useHydrated.ts` | SSR-safe hydration guard hook |
| `src/stores/cartStore.ts` | Zustand cart, persisted, synced with Shopify |
| `src/stores/wishlistStore.ts` | Zustand wishlist, persisted |
| `src/stores/authStore.ts` | Zustand auth, persisted (accessToken only) |
| `src/stores/currencyStore.ts` | CAD/USD currency switcher |
| `src/stores/recentlyViewedStore.ts` | Recently viewed products |
| `src/components/ProductCard.tsx` | Product card with quick-add, wishlist, badges, image hover |
| `src/components/PriceDisplay.tsx` | Multi-currency price rendering |
| `src/components/Header.tsx` | Site header with search, nav, cart icon |
| `src/components/CartDrawer.tsx` | Slide-out cart with line items, quantity controls, checkout |
| `src/components/CookieConsent.tsx` | GDPR/CCPA cookie consent banner |
| `src/components/CareChat.tsx` | Groq-powered chatbot |

## Environment variables
See `.env.example` and `SETUP.md`. Missing vars fall back to dev defaults gracefully.

## Open follow-ups
- **Phase 2 — Admin Control**: Wire up `SHOPIFY_ADMIN_TOKEN` env var → product CRUD, order management via Admin REST API
- **Real tracking API**: implement `lookupTracking` and surface as a tool for the chatbot
- **OG/PNG conversion**: `public/og-default.png` is now a proper 1200×630 PNG (converted from SVG)
- **Reviews**: Google Places reviews are wired but need API key; Judge.me needs credentials
- **Custom orders email**: replace mailto: with structured email via Resend or Shopify Admin API
- **Abandoned cart recovery**: Shopify automation or custom email flow

## Things NOT to do
- Don't convert to a Shopify Liquid theme.
- Don't add `react-router-dom` — TanStack Router only.
- Don't create `src/pages/` (Next.js convention).
- Don't add `public/_redirects` — TanStack Start handles routing on every host.
- Don't edit `src/routeTree.gen.ts` — it's auto-generated.

## Local commands
```bash
bun install
cp .env.example .env
bun dev               # http://localhost:8080
bun run build
bun run lint
```
