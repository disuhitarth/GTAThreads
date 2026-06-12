# Instructions for AI assistants (Cursor / Claude Code / Copilot / etc.)

This codebase was bootstrapped on Lovable and is now maintained offline. Read this before making changes.

## Stack
- **TanStack Start v1** (React 19, Vite 7) — SSR + file-based routing.
- **Tailwind CSS v4** via `src/styles.css` (no `tailwind.config.js`).
- **bun** as package manager. Use `bun add` / `bun remove`, not npm/yarn.
- **Zustand** for cart state (`src/stores/cartStore.ts`), **TanStack Query** for data fetching.
- **Shopify Storefront API** (headless) is the only source of truth for products, cart, and checkout.
- **AI SDK** (`ai` + `@ai-sdk/openai-compatible`) for the Care chatbot.

## Hard rules
1. **Routing is file-based** under `src/routes/`. Never edit `src/routeTree.gen.ts` — it's auto-generated. Flat dot-separated naming: `journal.$slug.tsx` → `/journal/:slug`.
2. **No mock products.** All product data must come from Shopify via `src/lib/shopify.ts`. Show "No products found" rather than placeholders.
3. **No manual checkout URLs.** Cart goes through the Storefront API mutations in `src/lib/shopify.ts` + `src/stores/cartStore.ts`. The `checkoutUrl` returned by `cartCreate` is the only valid checkout entry point. Always include `?channel=online_store` (already handled) and open with `window.open(url, '_blank')`.
4. **Server logic split:**
   - App-internal RPC → `createServerFn` in `src/lib/*.functions.ts` (callable via `useServerFn`).
   - Raw HTTP (webhooks, public APIs) → `src/routes/api/*.ts` server routes.
   - Anything reading `process.env.*` or external secrets must live server-side.
5. **All env vars go through `src/lib/env.ts`** — do not hardcode the Shopify domain, token, or site URL. Add new vars to both `src/lib/env.ts` and `.env.example`.
6. **SEO conventions are already established.** Every route's `head()` sets a unique `title`, `description`, canonical, OG + Twitter tags. Dynamic routes pull from loader data. Keep this pattern when adding routes. `og:image` belongs on leaf routes only.
7. **Design tokens only.** Use semantic Tailwind classes (`bg-background`, `text-bloom`, `font-display`). Don't introduce raw `text-white` / hex colors. Tokens are defined in `src/styles.css`.

## File map
| Path | Purpose |
|---|---|
| `src/routes/__root.tsx` | Root layout, global meta, JSON-LD Organization + WebSite |
| `src/routes/product.$handle.tsx` | Product detail + Product JSON-LD + BreadcrumbList |
| `src/routes/sitemap[.]xml.ts` | Dynamic sitemap (static + categories + occasions + posts + Shopify products) |
| `src/routes/api/chat.ts` | Care chatbot streaming endpoint |
| `src/lib/shopify.ts` | All Storefront API queries + cart mutations |
| `src/lib/env.ts` | Centralized env var access |
| `src/lib/ai-gateway.server.ts` | OpenAI-compatible provider config |
| `src/lib/tracking.functions.ts` | **STUB** — shipment tracking lookup |
| `src/lib/newsletter.functions.ts` | **STUB** — email capture |
| `src/stores/cartStore.ts` | Zustand cart, persisted, synced with Shopify |

## Environment variables
See `.env.example`. The codebase falls back to the original Lovable preview values if vars are absent (so the build doesn't crash before you've filled `.env`), but **production deploys must set all of them**.

## Open follow-ups
- **Real tracking API**: implement `lookupTracking` and expose it as a tool from `src/routes/api/chat.ts`.
- **Real newsletter provider**: implement `subscribeToNewsletter` (already wired into the Newsletter UI).
- **Reviews**: integrate Judge.me / Stamped / Yotpo — NEVER fabricate reviews.
- **OG share image**: 1200×630 JPG at `src/assets/og-default.jpg`, reference from `__root.tsx`.
- **Favicon set**: replace default favicon and add `apple-touch-icon.png` in `public/`.

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
