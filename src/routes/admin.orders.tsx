/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ExternalLink, Search } from "lucide-react";
import { fetchAdminOrders } from "@/lib/admin-api.functions";
import { useState } from "react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  authorized: "bg-blue-100 text-blue-700",
  partially_paid: "bg-indigo-100 text-indigo-700",
  paid: "bg-green-100 text-green-700",
  partially_refunded: "bg-orange-100 text-orange-700",
  refunded: "bg-red-100 text-red-700",
  voided: "bg-gray-100 text-gray-500",
  fulfilled: "bg-green-100 text-green-700",
  unfulfilled: "bg-amber-100 text-amber-700",
  partial: "bg-indigo-100 text-indigo-700",
};

function AdminOrders() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchAdminOrders(),
  });

  const orders = data?.orders ?? [];
  const filtered = search
    ? orders.filter(
        (o: any) =>
          String(o.order_number).includes(search) ||
          (o.email || "").toLowerCase().includes(search.toLowerCase()) ||
          (o.name || "").toLowerCase().includes(search.toLowerCase()),
      )
    : orders;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length} order{orders.length !== 1 && "s"} total
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by order #, email, or name..."
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
        {filtered.map((order: any) => (
          <div
            key={order.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card/40 px-5 py-4 transition-colors hover:border-bloom/30"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">#{order.order_number}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {order.email} · {order.shipping_address?.city || "—"} ·{" "}
                {order.shipping_address?.province || "—"}
              </p>
              {order.note && (
                <p className="mt-1 truncate text-xs italic text-muted-foreground">"{order.note}"</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">${order.total_price}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[order.financial_status] || "bg-gray-100 text-gray-500"
                  }`}
                >
                  {order.financial_status}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[order.fulfillment_status || "unfulfilled"] ||
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {order.fulfillment_status || "?"}
                </span>
              </div>
            </div>
            <a
              href={`https://${process.env.VITE_SHOPIFY_STORE_DOMAIN || "gtathreads-store.myshopify.com"}/admin/orders/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl p-2 text-muted-foreground hover:text-bloom"
              title="Open in Shopify Admin"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ))}
        {filtered.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-script text-xl text-bloom">no orders match</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
