/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { fetchAdminProducts, fetchAdminOrders } from "@/lib/admin-api.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-bloom/30"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-bloom/10 text-bloom">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Link>
  );
}

function AdminDashboard() {
  const productsQuery = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => fetchAdminProducts(),
  });

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchAdminOrders(),
  });

  const products = productsQuery.data?.products ?? [];
  const orders = ordersQuery.data?.orders ?? [];
  const totalRevenue = orders.reduce(
    (sum: number, o: any) => sum + parseFloat(o.total_price || "0"),
    0,
  );
  const pendingOrders = orders.filter(
    (o: any) => o.financial_status !== "paid" || o.fulfillment_status !== "fulfilled",
  );

  return (
    <div>
      <h1 className="font-display text-3xl italic">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Studio overview at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Package} label="Products" value={products.length} href="/admin/products" />
        <StatCard icon={ShoppingCart} label="Orders" value={orders.length} href="/admin/orders" />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={`$${totalRevenue.toFixed(0)}`}
          href="/admin/orders"
        />
      </div>

      {productsQuery.isLoading && (
        <div className="mt-8 animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-secondary" />
          <div className="h-32 rounded-2xl bg-secondary" />
        </div>
      )}

      {productsQuery.data && !productsQuery.data.ok && (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {productsQuery.data.error || "Failed to load data"}
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-display text-xl italic">Pending attention</h2>
        {pendingOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">All caught up — no pending orders.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pendingOrders.slice(0, 5).map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card/40 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium">#{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.created_at?.slice(0, 10)} · ${order.total_price} · {order.email}
                  </p>
                </div>
                <span className="rounded-full bg-amber/20 px-3 py-1 text-xs text-amber-700">
                  {order.financial_status} / {order.fulfillment_status || "unfulfilled"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
