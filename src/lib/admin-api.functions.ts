import { createServerFn } from "@tanstack/react-start";
import { ADMIN_PASSWORD, SHOPIFY_ADMIN_TOKEN, SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION } from "@/lib/env";

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || !input || !("password" in input)) {
      throw new Error("Invalid input");
    }
    return { password: String((input as { password: string }).password) };
  })
  .handler(async ({ data }) => {
    if (!ADMIN_PASSWORD) {
      console.warn("[admin] ADMIN_PASSWORD not set in environment");
      return { ok: false };
    }
    return { ok: data.password === ADMIN_PASSWORD };
  });

export const fetchAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  const token = SHOPIFY_ADMIN_TOKEN;
  const domain = SHOPIFY_STORE_DOMAIN;
  const version = SHOPIFY_API_VERSION;

  if (!token || !domain) {
    return { ok: false as const, error: "Admin API not configured", products: [] };
  }

  try {
    const res = await fetch(
      `https://${domain}/admin/api/${version}/products.json?limit=50&status=any`,
      {
        headers: { "X-Shopify-Access-Token": token },
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[admin] Shopify Admin error:", res.status, body);
      return { ok: false as const, error: "Failed to fetch products", products: [] };
    }
    const json = await res.json();
    return { ok: true as const, products: json.products };
  } catch (e) {
    console.error("[admin] Shopify Admin exception:", e);
    return { ok: false as const, error: "Service unavailable", products: [] };
  }
});

export const fetchAdminOrders = createServerFn({ method: "GET" }).handler(async () => {
  const token = SHOPIFY_ADMIN_TOKEN;
  const domain = SHOPIFY_STORE_DOMAIN;
  const version = SHOPIFY_API_VERSION;

  if (!token || !domain) {
    return { ok: false as const, error: "Admin API not configured", orders: [] };
  }

  try {
    const res = await fetch(
      `https://${domain}/admin/api/${version}/orders.json?limit=50&status=any`,
      {
        headers: { "X-Shopify-Access-Token": token },
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error("[admin] Orders error:", res.status, body);
      return { ok: false as const, error: "Failed to fetch orders", orders: [] };
    }
    const json = await res.json();
    return { ok: true as const, orders: json.orders };
  } catch (e) {
    console.error("[admin] Orders exception:", e);
    return { ok: false as const, error: "Service unavailable", orders: [] };
  }
});
