/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, ExternalLink, AlertCircle, Search } from "lucide-react";
import { fetchAdminProducts } from "@/lib/admin-api.functions";
import { useState } from "react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchAdminProducts(),
  });

  const products = data?.products ?? [];
  const filtered = search
    ? products.filter((p: any) => p.title.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 && "s"} total
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-transparent py-3 pl-11 pr-4 text-sm focus:border-bloom focus:outline-none"
        />
      </div>

      {isLoading && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      )}

      {data && !data.ok && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {data.error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {filtered.map((product: any) => (
          <div
            key={product.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 transition-colors hover:border-bloom/30"
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
              {product.images?.[0]?.src ? (
                <img src={product.images[0].src} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                  —
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.title}</p>
              <p className="text-xs text-muted-foreground">
                ${product.variants?.[0]?.price || "—"} · {product.status} ·{" "}
                {product.product_type || "uncategorized"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  product.status === "active"
                    ? "bg-green-100 text-green-700"
                    : product.status === "draft"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {product.status}
              </span>
              <a
                href={`https://${process.env.VITE_SHOPIFY_STORE_DOMAIN || "gtathreads-store.myshopify.com"}/admin/products/${product.id.split("/").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-2 text-muted-foreground hover:text-bloom"
                title="Open in Shopify Admin"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-script text-xl text-bloom">no products match</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
