# GTA Threads — Setup Guide

## Prerequisites

| Account | Free? | Why needed |
|---------|-------|------------|
| [Shopify](https://shopify.com) (existing) | Paid plan | Products, cart, checkout, payments |
| [Netlify](https://netlify.com) | Free tier | Hosting + deploy |
| [Groq](https://console.groq.com) | Free tier | AI chatbot (no credit card) |
| | | |
| [Sentry](https://sentry.io) | Free tier (5k events/mo) | Error monitoring |
| [Judge.me](https://judge.me) | Free forever | Product reviews |
| [Judge.me Shopify App](https://apps.shopify.com/judgeme) | Free | Collect & display reviews |

---

## 1. Shopify API Keys

### 1A. Storefront API Token (READ + CART)

This is the main token the frontend uses. It's public-safe (browser can see it).

1. Go to your Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**
2. Click **Create an app** → name it `GTA Threads Storefront`
3. Go to the **API credentials** tab
4. Under **Storefront API integration**, click **Configure**
5. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
6. Click **Save**
7. Copy the **Storefront API access token** (starts with `atkn_...`)

### 1B. Admin API Token (for admin panel — Phase 2)

For Phase 2 (product management, orders), you need an Admin API token:

1. Same app in **Develop apps** → pick your app → **API credentials**
2. Under **Admin API integration**, click **Configure**
3. Select scopes (start minimal):
   - `read_products`, `write_products`
   - `read_inventory`, `write_inventory`
   - `read_orders`, `write_orders`
4. Click **Save** → copy the **Admin API access token**

### 1C. Google Place ID (for Google Reviews)

1. Go to the [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business name
3. Copy the Place ID
4. Get a [Google Places API key](https://console.cloud.google.com/apis/credentials) (free — $200/mo credit)

---

## 2. Groq API Key (Chatbot — Free)

1. Visit [console.groq.com](https://console.groq.com) → **Sign up** (Google/GitHub — no credit card)
2. Go to **API Keys** in the left sidebar
3. Click **Create API Key**
4. Copy the key (starts with `gsk_...`)

Model used: `llama-3.3-70b-versatile` (free tier: 30 req/min, 14,400 req/day — plenty for a chatbot)

---

## 2A. Shopify Admin API Token (for Newsletter)

Newsletter signups create a customer record in Shopify Admin → Customers.

1. Shopify Admin → **Settings** → **Apps and sales channels** → **Develop apps**
2. If you already created an app (`GTA Threads Storefront`), select it; otherwise create one
3. **API credentials** tab → under **Admin API integration**, click **Configure**
4. Add scope: `write_customers`
5. Click **Save** → copy the **Admin API access token**
6. Add to `.env`: `SHOPIFY_ADMIN_TOKEN=shpat_...`

Now subscribers will appear under **Shopify Admin → Customers** with the "newsletter" tag and "Accepts marketing" checked. The store owner can export or send campaigns from Shopify Email.

---



## 5. Sentry (Error Monitoring — Free Tier)

1. Visit [sentry.io](https://sentry.io) → Sign up
2. Create a new project → choose **React** (or **JavaScript**)
3. Copy the **DSN** (looks like `https://xxx@xxx.ingest.sentry.io/xxx`)

---

## 6. Judge.me (Reviews — Free)

1. Install [Judge.me from Shopify App Store](https://apps.shopify.com/judgeme) (free)
2. Configure widget settings in Shopify Admin → Judge.me
3. Copy your **Judge.me API token** and **API secret** from Judge.me settings → API
4. Free plan features: unlimited review requests, star ratings widget, review widget, Google Shopping sync, CSV import

For Google Reviews sync:
- Use the Google Places API (already stubbed in `src/lib/reviews.functions.ts`)
- Get a [Google Places API key](https://console.cloud.google.com/apis/credentials)
- Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` in `.env`

---

## 7. Netlify (Hosting)

1. `VITE_SITE_URL` — set to `https://gtathreads.netlify.app` (or your custom domain)
2. Deploy: `git push` to your repo → Netlify auto-deploys
3. For custom domain: Netlify → Site settings → Domain management → Add custom domain
4. Environment variables: Netlify → Site settings → Build & deploy → Environment → Add all vars from `.env`

---

## 8. Environment Variables

Copy `.env.example` to `.env` and fill in:

```
# Required (site won't work without these)
VITE_SHOPIFY_STORE_DOMAIN=gtathreads-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=atkn_...           # From section 1A
VITE_SHOPIFY_API_VERSION=2026-04
VITE_SITE_URL=https://gtathreads.netlify.app
GROQ_API_KEY=gsk_...                              # From section 2

# Integrations (stubs fall back gracefully if missing)
SHOPIFY_ADMIN_TOKEN=shpat_...                     # From section 2A — newsletter + admin

SENTRY_DSN=https://...@...ingest.sentry.io/...    # From section 5
JUDGEME_API_TOKEN=...                             # From section 6
JUDGEME_API_SECRET=...                            # From section 6
GOOGLE_PLACES_API_KEY=...                         # From section 1C
GOOGLE_PLACE_ID=...                               # From section 1C
TRACKING_API_KEY=...                              # Optional — shipping tracking
TRACKING_API_BASE_URL=...                         # Optional — shipping tracking
```

---

## 9. Custom Domain (Later)

When the client provides a domain:

1. Netlify → Site settings → Domain management → Add custom domain
2. Update DNS A/AAAA records at the domain registrar to point to Netlify
3. Update `VITE_SITE_URL` in Netlify env vars
4. Update the domain in Resend for email sending
5. Update canonical URLs will auto-update via the env var

---

## 10. Future Upgrade: Resend (Structured Order Emails)

Currently the custom order form uses **mailto:** — clicking submit opens the customer's email client with the brief pre-filled. Zero setup, works today.

If you later want the brief delivered as a **structured HTML email** without relying on the customer's email client:

1. Go to [resend.com](https://resend.com) → Sign up (free tier: 100 emails/day)
2. Go to **API Keys** → **Create API Key** → copy key (starts with `re_...`)
3. Go to **Domains** → **Add Domain** → add your sending domain (e.g., `gtathreads.netlify.app`)
4. Follow DNS verification steps (add TXT record at your DNS provider)
5. Add to `.env`:
   ```
   RESEND_API_KEY=re_your_key_here
   RESEND_TO_EMAIL=hello@gtathreads.com
   RESEND_FROM_EMAIL=orders@your-domain.com
   ```
6. Re-enable the server function in `src/lib/orders.functions.ts` (uncomment the handler)
7. Update `src/routes/custom-orders.tsx` to call `submitCustomOrder` server function instead of mailto:

---

## 11. Professional Email

Currently using `gtathreads@gmail.com` for admin contact. When ready:

1. Set up a professional email (e.g., `hello@gtathreads.com` via Google Workspace, Zoho, or MXRoute)
2. Update the email in:
   - `src/routes/custom-orders.tsx` (mailto: link)
   - `.env` (mailto: address in custom orders form)
   - Shopify Email sender settings
   - Privacy Policy contact info

---

## 11. Local Development

```bash
# Install dependencies
bun install

# Copy env file
cp .env.example .env

# Fill in your .env values (see section 8)

# Run dev server
bun dev              # → http://localhost:8080

# Build for production
bun run build

# Lint
bun run lint
```

---

## 12. Production Deploy

```bash
# Push to your git repo — Netlify auto-deploys from the connected branch
git push

# Or deploy manually
bun run build
# Upload dist/ to Netlify or use Netlify CLI
```

---

## 9. Image Assets (Branding)

### OG Default Image
Social platforms share this when no specific product image is available.

1. A design SVG is at `src/assets/og-default.svg` (1200×630)
2. Convert it to PNG:
   - **Quick**: Open `src/assets/og-default.svg` in Chrome/Safari → right-click → "Save as..." → `public/og-default.png`
   - **Or use**: [convertio.co](https://convertio.co/svg-png/) or `rsvg-convert src/assets/og-default.svg > public/og-default.png`
3. **Replace** with a real studio photo (flat lay of embroidered piece + thread + scissors) when available

### Favicon
- `public/favicon.svg` — works in all modern browsers (Chrome, Firefox, Safari 16.4+)
- `public/apple-touch-icon.svg` — iOS Safari pinned tab icon
- For older browsers, convert to PNG/ICO:
  - Convert `public/favicon.svg` to `public/favicon.ico` / `public/apple-touch-icon.png` using [realfavicongenerator.net](https://realfavicongenerator.net)

---

## Account Checklist

- [ ] Shopify Storefront API token generated and in `.env`
- [ ] Groq account created → API key in `.env`
- [ ] Shopify Admin API token created → `write_customers` scope → in `.env`

- [x] Sentry project created → DSN in `.env`
- [ ] Judge.me installed on Shopify → API credentials in `.env`
- [x] Google Places API key created → in `.env`
- [ ] Google Business Profile created → Place ID → in `.env` (future)
- [ ] Netlify site configured → env vars set
- [ ] OG default image: convert `src/assets/og-default.svg` → `public/og-default.png`
- [ ] `bun dev` runs without errors
- [ ] `bun run build` succeeds
