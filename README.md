# GTA Threads — Headless Shopify Storefront

A TanStack Start storefront for [GTA Threads](https://www.etsy.com/ca/shop/giftedthreads25), a Toronto embroidery studio. Headless: this app is the frontend, Shopify is the backend (products, cart, checkout). Includes a Care chatbot powered by an OpenAI-compatible AI endpoint.

## Stack

- **TanStack Start v1** (React 19, Vite 7, SSR)
- **Tailwind CSS v4** (no config file — tokens in `src/styles.css`)
- **Shopify Storefront API** for products + cart + checkout
- **Zustand** for cart state, **TanStack Query** for data
- **AI SDK** for the Care chatbot

## Quick start

```bash
bun install
cp .env.example .env   # fill in your Shopify creds + site URL
bun dev                # http://localhost:8080
```

Without `.env` the app falls back to the Lovable preview store so the build still runs — but use real values before deploying.

## Configuring Shopify

The site reads products and creates checkouts via Shopify's Storefront API.

1. **Shopify Admin → Settings → Apps and sales channels → Develop apps → Create an app**
2. **Configure Storefront API scopes**:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
3. **Install app → API credentials → copy the Storefront API access token.**
4. Set in `.env`:
   ```
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_TOKEN=<token from step 3>
   ```

### Importing products

A starter `products.csv` (Shopify format) is in the repo. Shopify Admin → **Products → Import** → upload it. Once products exist in Shopify, they appear here automatically — no rebuild needed.

## Chatbot AI key

The chatbot (`src/routes/api/chat.ts`) calls an OpenAI-compatible endpoint configured in `src/lib/ai-gateway.server.ts`. Three options:

### Option A — Keep Lovable AI Gateway (zero code change)

Copy `LOVABLE_API_KEY` from Lovable (Project → Settings → Secrets) into your host's env.

### Option B — OpenAI direct

```bash
bun add @ai-sdk/openai
```
Edit `src/lib/ai-gateway.server.ts`:
```ts
import { createOpenAI } from "@ai-sdk/openai";
export const createAiProvider = (apiKey: string) => createOpenAI({ apiKey });
```
Set `OPENAI_API_KEY` in `.env`, and update `src/routes/api/chat.ts` to use a model like `gpt-4o-mini`.

### Option C — Anthropic direct

```bash
bun add @ai-sdk/anthropic
```
```ts
import { createAnthropic } from "@ai-sdk/anthropic";
export const createAiProvider = (apiKey: string) => createAnthropic({ apiKey });
```
Set `ANTHROPIC_API_KEY`. Use a model like `claude-3-5-haiku-latest`.

## Deploy

### Netlify (primary)

1. Push the repo to GitHub/GitLab.
2. Add the TanStack Start Netlify adapter:
   ```bash
   bun add -d @netlify/vite-plugin-tanstack-start
   ```
   Wire it into `vite.config.ts` per [TanStack hosting → Netlify](https://tanstack.com/start/latest/docs/framework/react/hosting#netlify).
3. In Netlify → **Site settings → Environment variables**, add everything from `.env.example`.
4. `netlify.toml` (already in repo) handles build command + Node version.
5. Connect the repo and deploy.

### Vercel

```bash
bun add -d @vercel/vite-plugin-tanstack-start
```
Add the adapter to `vite.config.ts` ([docs](https://tanstack.com/start/latest/docs/framework/react/hosting#vercel)), import the repo on Vercel, add env vars.

### Cloudflare Pages / Workers

What Lovable runs by default. Build command `bun run build`, output `dist`, enable `nodejs_compat`, add env vars.

### Generic notes
- TanStack Start handles SSR + SPA fallback on every host — no `_redirects` / `vercel.json` rewrites needed.
- `public/robots.txt` has a hardcoded `Sitemap:` URL. After deploy, edit it to point at your production domain (or remove the line — crawlers auto-discover `/sitemap.xml`).
- `/sitemap.xml` is dynamic — reads `VITE_SITE_URL` and includes all Shopify products on every request.

## Where things live

```
src/
├── routes/                       file-based routes
│   ├── __root.tsx                layout + global SEO + JSON-LD
│   ├── index.tsx                 home
│   ├── shop.tsx                  product grid
│   ├── product.$handle.tsx       product detail
│   ├── category.*.tsx            category pages
│   ├── occasions.*.tsx           occasion pages
│   ├── journal.*.tsx             blog
│   ├── sitemap[.]xml.ts          dynamic sitemap
│   └── api/chat.ts               chatbot stream endpoint
├── lib/
│   ├── env.ts                    centralized env access
│   ├── shopify.ts                Storefront API + cart mutations
│   ├── ai-gateway.server.ts      AI provider config
│   ├── tracking.functions.ts     STUB
│   └── newsletter.functions.ts   STUB
├── stores/cartStore.ts           Zustand cart, persisted, Shopify-synced
├── components/                   UI
└── styles.css                    Tailwind v4 tokens
```

## Handoff to the next AI assistant

See [`AGENTS.md`](./AGENTS.md) — conventions, hard rules, file map, open follow-ups.

## License

Private — all rights reserved.
