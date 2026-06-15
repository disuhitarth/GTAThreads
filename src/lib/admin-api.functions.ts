import { createServerFn } from "@tanstack/react-start";

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || !input || !("password" in input)) {
      throw new Error("Invalid input");
    }
    return { password: String((input as { password: string }).password) };
  })
  .handler(async ({ data }) => {
    const real = process.env.ADMIN_PASSWORD;
    if (!real) {
      console.warn("[admin] ADMIN_PASSWORD not set in environment");
      return { ok: false };
    }
    return { ok: data.password === real };
  });

export const fetchAdminProducts = createServerFn({ method: "GET" }).handler(async () => {
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const version = process.env.VITE_SHOPIFY_API_VERSION || "2026-04";

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
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const version = process.env.VITE_SHOPIFY_API_VERSION || "2026-04";

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
