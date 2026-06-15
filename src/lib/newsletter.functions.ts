import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ email: z.string().email() }).parse(input))
  .handler(async ({ data }) => {
    const token = process.env.SHOPIFY_ADMIN_TOKEN;
    const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
    const version = process.env.VITE_SHOPIFY_API_VERSION || "2026-07";

    if (!token || !domain) {
      console.warn(
        "[newsletter] Shopify Admin API not configured. Email captured locally:",
        data.email,
      );
      return { ok: true as const, provider: "local" as const };
    }

    try {
      const res = await fetch(`https://${domain}/admin/api/${version}/customers.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({
          customer: {
            email: data.email,
            accepts_marketing: true,
            tags: "newsletter",
            send_email_invite: false,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[newsletter] Shopify Admin error:", res.status, body);
        return { ok: false as const, error: "Failed to subscribe." };
      }

      return { ok: true as const, provider: "shopify" as const };
    } catch (e) {
      console.error("[newsletter] Shopify Admin exception:", e);
      return { ok: false as const, error: "Service unavailable." };
    }
  });
