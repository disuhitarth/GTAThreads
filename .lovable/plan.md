## Goal

Make this project clean to download, drop into your own repo, point at your real Shopify store, and deploy on Netlify (with notes for Vercel + Cloudflare). No behavior changes to what works today — just remove hardcoded values, document the handoff, and add a few finishing touches so the next AI/dev can continue cleanly.

---

## 1. Environment variables (remove hardcoded values)

Today these are hardcoded in source. Move them to `import.meta.env.VITE_*` so you swap them by editing `.env`, not code.

| Variable | Replaces | Used in |
|---|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | `xv5ybs-3a.myshopify.com` | `src/lib/shopify.ts` |
| `VITE_SHOPIFY_STOREFRONT_TOKEN` | `c1c4c55e1584601def5b8658914473da` | `src/lib/shopify.ts` |
| `VITE_SHOPIFY_API_VERSION` | `2025-07` (default) | `src/lib/shopify.ts` |
| `VITE_SITE_URL` | `https://gta-threads-showcase.lovable.app` | `__root.tsx`, `sitemap[.]xml.ts`, `product.$handle.tsx`, `journal.$slug.tsx`, etc. |
| `LOVABLE_API_KEY` (server) | currently auto-injected by Lovable | `src/lib/ai-gateway.server.ts` (chatbot) |

Add `.env.example` with all keys + comments, and a small `src/lib/env.ts` helper that reads + validates them with friendly errors if missing.

## 2. Documentation — `README.md` (rewritten)

Sections:
1. **What this is** — TanStack Start storefront, headless Shopify, Lovable AI chatbot.
2. **Local setup** — `bun install`, copy `.env.example` → `.env`, fill in, `bun dev`.
3. **Shopify wiring** — where to get the Storefront API token (Admin → Settings → Apps → Develop apps → Storefront API), required scopes (`unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`), how to import `products.csv`.
4. **Chatbot AI key** — two options:
   - Keep using Lovable AI Gateway (copy `LOVABLE_API_KEY` from project secrets into your host's env).
   - Swap to OpenAI/Anthropic direct: which file to edit (`src/lib/ai-gateway.server.ts`), drop-in snippet for each.
5. **Deploy — Netlify (primary)** — `@netlify/vite-plugin-tanstack-start` adapter, build command, env vars, `netlify.toml` example.
6. **Deploy — Vercel** — Vercel adapter notes.
7. **Deploy — Cloudflare Pages/Workers** — current Lovable runtime, nodejs_compat flag.
8. **Where things live** — short map of `src/routes`, `src/lib/shopify.ts`, `src/stores/cartStore.ts`, `src/routes/api/chat.ts`.
9. **Handoff notes for the next AI/dev** — see section 4.

## 3. Polish features to add before handoff

Small, high-value items that finish what we started:

- **Branded OG share image** (1200×630) — generate one default image referenced from `__root.tsx` so social previews look real.
- **`favicon.ico` + `apple-touch-icon.png`** generated from your bloom mark.
- **404 page polish** — already have notFoundComponents, but a single branded `__root` notFoundComponent so unmatched URLs look intentional.
- **Tracking-API stub** — placeholder server function `src/lib/tracking.functions.ts` with a TODO interface, so when you add your tracking API later it slots straight into the chatbot context. The chatbot prompt already mentions order/tracking — this just wires the seam.
- **Newsletter form** — point the existing newsletter UI at a stub server function with TODOs for Klaviyo/Mailchimp/Resend.
- **Robots & sitemap sanity** — confirm `robots.txt` references `${VITE_SITE_URL}/sitemap.xml` (currently hardcoded).

## 4. `AGENTS.md` — instructions for the next AI

A short file at repo root telling the next assistant (Cursor / Claude Code / etc.):
- Stack: TanStack Start v1, Vite 7, Tailwind v4, bun.
- Routing: file-based in `src/routes/`, never edit `routeTree.gen.ts`.
- Data: Shopify Storefront API only; never mock products.
- Cart: must go through `cartStore` + Storefront cart mutations, never manual checkout URLs.
- Server logic: `createServerFn` in `*.functions.ts`, raw HTTP in `src/routes/api/`.
- Env var conventions (table above).
- Open follow-ups: real tracking API, newsletter provider, real product CSV import, review collection.

## 5. Out of scope (call out explicitly so expectations are set)

- Not converting to a Shopify Liquid theme.
- Not building Hydrogen/Oxygen version.
- Not migrating chatbot off Lovable AI Gateway — documenting how to, not doing it.
- Not setting up your Netlify project — providing the config, you connect the repo.

---

## Technical details

**Files edited**
- `src/lib/shopify.ts` — read `import.meta.env.VITE_SHOPIFY_*` with fallbacks.
- `src/lib/env.ts` *(new)* — typed env access + missing-var warnings.
- `src/routes/__root.tsx` — use `VITE_SITE_URL` for canonical/OG.
- `src/routes/sitemap[.]xml.ts` — use `VITE_SITE_URL`.
- `src/routes/product.$handle.tsx`, `src/routes/journal.$slug.tsx` — replace `SITE` constant.
- `public/robots.txt` — sitemap URL via build-time substitution or doc note.
- `.env.example` *(new)*, `README.md` *(rewritten)*, `AGENTS.md` *(new)*, `netlify.toml` *(new)*.
- `src/lib/tracking.functions.ts` *(new, stub)*.
- `src/lib/newsletter.functions.ts` *(new, stub)*.
- `src/assets/og-default.jpg` *(new, generated 1200×630)*.
- `public/favicon.ico`, `public/apple-touch-icon.png` *(new)*.

**Not touched**: cart logic, product rendering, SEO JSON-LD structure, chatbot UI, route tree, design tokens.

**Verification after build mode**: load the site with current Lovable env, confirm products still load, cart still works, sitemap still renders, chatbot still answers.
