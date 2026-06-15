# Project Architecture & Vision: GTA Threads Studio

Welcome to the **GTA Threads** (Threads & Style Studio) codebase. This document outlines what has been built, the design philosophy, the underlying business goal, the long-term vision, and detailed extension opportunities for future developers or AI agents (LLMs).

---

## 1. What Has Been Done (Current State)

This project is a bespoke, headless storefront for **GTA Threads** (originally operating on Etsy as `giftedthreads25`), a Toronto-based custom hand-embroidery studio specializing in luxury custom-embroidered apparel (sweatshirts, tees, totes, and baby garments).

### Technical Stack
*   **Framework**: [TanStack Start v1](https://tanstack.com/start) (built on React 19 and Vite 7) providing full Server-Side Rendering (SSR) for search engine indexing, fast hydration, and type-safe file-based routing.
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) configured with custom OKLCH color palettes, custom utilities, and animations defined directly inside [src/styles.css](file:///Users/bolo/websites/GTATHREADSCUSTOM/Threads%20&%20Style%20Studio/src/styles.css) (no `tailwind.config.js` needed).
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) for client-side cart management ([src/stores/cartStore.ts](file:///Users/bolo/websites/GTATHREADSCUSTOM/Threads%20&%20Style%20Studio/src/stores/cartStore.ts)) persisted to `localStorage` and synchronized with Shopify's checkout engine.
*   **Backend Integration**: Headless [Shopify Storefront API](https://shopify.dev/docs/api/storefront) ([src/lib/shopify.ts](file:///Users/bolo/websites/GTATHREADSCUSTOM/Threads%20&%20Style%20Studio/src/lib/shopify.ts)) is the single source of truth for products, collections, cart mutation, and checkout redirects.
*   **AI Integration**: [Vercel AI SDK](https://sdk.ai.dev/) inside [src/routes/api/chat.ts](file:///Users/bolo/websites/GTATHREADSCUSTOM/Threads%20&%20Style%20Studio/src/routes/api/chat.ts) connected to a streaming OpenAI-compatible API gateway.

### Page and Route Map (`src/routes/`)
1.  **Homepage** (`index.tsx`): An immersive visual scroll experience combining hero headers, scrolling text marquees, value props, occasion collections, product grids, brand stories, interactive lookbooks, real customer reviews, and newsletter signups.
2.  **Shop Grid** (`shop.tsx`): Responsive product grid with client-side sorting (featured, price, newest) and tag filtering.
3.  **Product Detail** (`product.$handle.tsx`): Detailed product views with size selector, color selector, quantity picker, trust icons, dynamic breadcrumbs, and full SEO metadata schema injection.
4.  **Custom Orders** (`custom-orders.tsx`): An interactive, 8-step wizard that helps clients define their commission request (garment, occasion, quantities, budget, timeline, notes) and compile a detailed brief.
5.  **Care & Sizing Hubs** (`care.tsx`, `size-guide.tsx`): Dedicated brand pages containing structured guidelines for product care and fit.
6.  **Blog / Journal** (`journal.index.tsx`, `journal.$slug.tsx`): Informational dynamic routes to showcase embroidery processes, studio updates, and stories.
7.  **SEO & Sitemap** (`sitemap[.]xml.ts`): Automatically compiles static routes + Shopify product paths dynamically.

### Bespoke Component Highlights (`src/components/`)
*   `FlowerCursor.tsx`: Subtle, brand-aligned custom canvas cursor following the mouse with a fading floral petal trail.
*   `Grain.tsx`: Global high-frequency grain overlay filter giving the application a tactile, organic, textured paper finish.
*   `MagneticButton.tsx`: Framer-motion-inspired physics-based button pulling toward the cursor on hover.
*   `WaveDivider.tsx` / `FloralRing.tsx`: SVG divider ornaments that escape the rigid grid of standard SaaS layouts.
*   `CareChat.tsx`: Sliding bottom-right conversational widget streaming AI care & order advice.

---

## 2. The Reason & Thought Behind It

### Why Headless Shopify?
Traditional Shopify themes are heavily box-bound and often suffer from bloated template engines, leading to slow page loads and repetitive visual layouts. Because GTA Threads sells **artisanal, handcrafted goods**, the web experience must feel equally handcrafted:
*   **Bespoke Interactions**: Tailoring the Custom Orders wizard, mouse cursor blooms, and paper grains is difficult or impossible within standard Liquid liquid-templates.
*   **Performance**: Separating the store data (Shopify Storefront API) from the frontend allows us to compile static code, leverage React 19's fast runtime, and execute serverless routing, minimizing loading delays.
*   **Vendor Lock-In Avoidance**: The core business is anchored to Shopify's secure payments and inventory management, but the front-end remains entirely portable.

### Design Thought & Visual Identity
GTA Threads is an embroidery studio; thread is tactile, slow, and artistic. The styling choices reflect this:
*   **Typography**: Serif (`Fraunces`) for headers to reflect heritage and storytelling; cursive (`Caveat`) for personal annotations or flourishes ("with love"); modern sans-serif (`DM Sans`) for body copy to preserve legibility.
*   **Color Space**: Rooted in organic, soothing tones. We use HSL/OKLCH for soft blush paper (`--background` #FFF7F3), deep plum-black (`--foreground` #2A1A1F) for high contrast without harshness, and raspberry (`--accent` #C8447A) to draw the eye to core actions.

---

## 3. The Actual Goal & Vision

### The Goal
*   **Etsy Transition**: Move customers away from Etsy's fee structures (where GTA Threads operates as `giftedthreads25`) to a self-managed, high-margin, professional digital storefront.
*   **Zero-friction Retailing**: Keep storefront load times ultra-fast so checkout conversions increase.
*   **Automated Brief Ingestion**: Streamline the custom order request loop so the studio receives structured, high-quality project proposals via email instead of loose chat messages.

### The Vision
To create a digital **Atelier & Creative Studio** rather than a standard transactional grid. 
*   **Visual Storytelling**: The site should function as a digital gallery where customers explore how garments are designed, how they are hand-stitched, and how they wear over time.
*   **AI Stylist**: The care chatbot will expand to act as an on-demand custom design consultant, helping users brainstorm gift ideas, select sweatshirt thread colors, and draft text designs.

---

## 4. The Target

1.  **Audience**: Buyers looking for personalized, memorable, high-quality embroidery gifts (e.g., matching bridal sets, baby shower gifts, pet portraits, memorial embroidery) in the GTA and across North America.
2.  **Performance Index**: Maintain a **95+ Lighthouse Score** for Performance, SEO, and Accessibility by pre-rendering routes, optimizing images, and avoiding heavy JavaScript libraries.
3.  **Brand Perception**: Establish the brand as a premium alternative to cheap machine-embroidery shops by emphasizing human hand-stitching and high-end materials.

---

## 5. How to Make it a Complete Product (Launch Roadmap)

To deploy the site as a fully completed, live product, the following gaps must be closed:

- [ ] **Real Shopify Credentials**: Swap the fallback credentials in `.env` with the production Shopify Storefront API keys (`unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`).
- [ ] **Newsletter API Connection**: Replace the stub inside `src/lib/newsletter.functions.ts` with a real server-side connection to Mailchimp, Klaviyo, or another Email Service Provider.
- [ ] **Carrier Tracking Integration**: Implement the `lookupTracking` stub in `src/lib/tracking.functions.ts` and expose it to the AI chat tools.
- [ ] **Reviews Integration**: Connect Judge.me, Stamped.io, or Yotpo's storefront API to replace the static mocks in `src/components/sections/Reviews.tsx`.
- [ ] **Production Assets & OG Images**: Replace temporary illustrations with real photography of custom stitches. Upload a `1200x630` JPG at `src/assets/og-default.jpg` and setup standard favicons in `public/`.
- [ ] **Domain Setup**: Point Netlify or Vercel to `gtathreads.com` (or `gtathreads.ca`) and update `VITE_SITE_URL` in the environment configuration.

---

## 6. Ideas for Future LLMs & Developers (Extension Opportunities)

If another AI assistant or developer takes over this codebase, here are several high-impact ideas they can implement:

### A. The "Embroidery Preview Canvas" (Interactive Customizer)
Create a page (`/custom-orders/designer`) that lets customers choose a template product (e.g., Hoodie, Tee, Tote) and customizer options:
*   **Visual Board**: Use HTML5 Canvas or SVG layers to place text in various fonts (cursive, block, gothic) or upload PNG icons.
*   **Thread Color Mapping**: Let users select thread colors from the GTA Threads inventory (e.g., Gold, Rose, Olive) and preview them overlaid on the garment color.
*   **AI Prompt Stitch**: Integrate an image-to-line-art vector tool (using a model like Stable Diffusion + SVG outlines) that converts a photo of a pet or family member into a simplified embroidery line draft to preview.

### B. Chatbot Upgrades (Transactional Agent)
Right now, the chatbot answers care and generic questions. It can be upgraded to:
*   **Order Lookups**: By adding a secure tool in `src/routes/api/chat.ts` that queries Shopify's Customer/Order API, the user can type "Where is my order #1085?" and the bot can retrieve and state the live shipment stage.
*   **Gift Finder Assistant**: Link the chatbot directly to product inventory search. The user says: "I need a Mother's Day gift under $60", and the chatbot returns a list of matching products with links to add to cart directly.

### C. Live Commission Estimator
In the `custom-orders.tsx` flow, construct a real-time pricing calculator.
*   Calculate based on embroidery area (width x height), estimated stitch count (text length vs. art file upload), garment cost, and shipping rates.
*   Present the user with an instant estimated cost range before they submit the brief.

### D. Automated "Journal" Content Agent
Create an admin route `/admin/journal` or a separate developer task to:
*   Pull recent custom commissions.
*   Synthesize a blog post explaining the design steps, thread selections, and customer story using an LLM.
*   Save the post to a static markdown folder or a headless CMS (like Contentful or Shopify Blogs).
