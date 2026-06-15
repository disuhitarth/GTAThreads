# Instructions for AI assistants (Cursor / Claude Code / Copilot / etc.)

Read this before making any changes. This file is the source of truth for project state.

## Project Status

**Phase 1 (Launch Readiness) — In progress.** ✅ Shopify (Storefront + Admin), ✅ Groq, ✅ OG image assets created.
Remaining (needs human with API keys):
- NEEDS HUMAN: Sentry DSN for error monitoring (see SETUP.md)
- NEEDS HUMAN (future): Google Business Profile → Place ID for Google reviews
- Code changes complete: legal pages, cookie consent, CSP headers, Groq gateway, Shopify Admin newsletter, mailto: custom orders, Sentry wiring, type cleanup, skeletons, error boundaries, OG/favicon assets

## Stack
- **TanStack Start v1** (React 19, Vite 7) — SSR + file-based routing.
- **Tailwind CSS v4** via `src/styles.css` (no `tailwind.config.js`).
- **bun** as package manager. Use `bun add` / `bun remove`, not npm/yarn.
- **Zustand** for cart state (`src/stores/cartStore.ts`), **TanStack Query** for data fetching.
- **Shopify Storefront API** (headless) is the only source of truth for products, cart, and checkout.
- **AI SDK** (`ai` + `@ai-sdk/openai-compatible`) for the Care chatbot via Groq (free, Llama 3.3 70B).

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

## File map

| Path | Purpose |
|---|---|
| `src/routes/__root.tsx` | Root layout, global meta, JSON-LD, includes CookieConsent |
| `src/routes/privacy.tsx` | Privacy Policy page |
| `src/routes/terms.tsx` | Terms of Service page |
| `src/routes/product.$handle.tsx` | Product detail + Product JSON-LD + BreadcrumbList |
| `src/routes/sitemap[.]xml.ts` | Dynamic sitemap (includes /privacy and /terms) |
| `src/routes/custom-orders.tsx` | 8-step wizard — submits via mailto: directly (zero setup) |
| `src/routes/api/chat.ts` | Care chatbot streaming via Groq (llama-3.3-70b-versatile) |
| `src/lib/shopify.ts` | All Storefront API queries + cart mutations (no more `any` types) |
| `src/lib/env.ts` | Centralized env var access |
| `src/lib/ai-gateway.server.ts` | Groq OpenAI-compatible provider |
| `src/lib/orders.functions.ts` | (Unused — mailto: used directly from form; file kept as upgrade reference) |
| `src/lib/newsletter.functions.ts` | Shopify Admin API — creates customer with email + accepts_marketing |
| `src/lib/reviews.functions.ts` | Google Places API review fetching |
| `src/lib/tracking.functions.ts` | **STUB** — shipment tracking lookup |
| `src/lib/lovable-error-reporting.ts` | Sentry error reporting (or console fallback) |
| `src/stores/cartStore.ts` | Zustand cart, persisted, synced with Shopify |
| `src/components/CookieConsent.tsx` | GDPR/CCPA cookie consent banner |
| `SETUP.md` | Step-by-step human setup guide (API keys, accounts, domain) |

## Environment variables
See `.env.example` and `SETUP.md`. Missing vars fall back to dev defaults gracefully.

## Open follow-ups (Phase 2+)
- **Phase 2 — Admin Control**: Shopify custom app → Admin API token → product CRUD, order management, admin panel
- **Phase 3 — Fluid UX**: Search bar, order confirmation page, customer accounts (Shopify PKCE), wishlist, page transitions, mobile audit, abandoned cart recovery
- **Phase 4 — Scale**: Performance optimization, testing, multi-currency, accessibility audit
- **Real tracking API**: implement `lookupTracking` and surface as a tool for the chatbot
- **OG image**: SVGs created at `src/assets/og-default.svg`. Must be converted to PNG at `public/og-default.png` for production (see SETUP.md).
- **Favicon set**: SVG favicon created at `public/favicon.svg` and `public/apple-touch-icon.svg`. Add `public/favicon.ico` and `public/apple-touch-icon.png` for older browsers if needed.
- **Reviews**: Judge.me free plan installed + Google Places API key for Google reviews
- **Custom orders email upgrade**: replace mailto: with structured email via Resend or Shopify Admin API

## Things NOT to do
- Don't convert to a Shopify Liquid theme.
- Don't add `react-router-dom` — TanStack Router only.
- Don't create `src/pages/` (Next.js convention).
- Don't add `public/_redirects` — TanStack Start handles routing on every host.

## Local commands
```bash
bun install
cp .env.example .env
bun dev               # http://localhost:8080
bun run build
bun run lint
```
