import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "My account – GTA Threads" },
      { name: "description", content: "Your GTA Threads account." },
      { property: "og:title", content: "My account – GTA Threads" },
      { name: "twitter:title", content: "My account – GTA Threads" },
    ],
  }),
});

function OrderStatus({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted-foreground">—</span>;
  const colors: Record<string, string> = {
    PAID: "text-green-600 dark:text-green-400",
    PARTIALLY_REFUNDED: "text-amber-500",
    REFUNDED: "text-red-500",
    PENDING: "text-amber-500",
    FULFILLED: "text-green-600 dark:text-green-400",
    UNFULFILLED: "text-muted-foreground",
    PARTIALLY_FULFILLED: "text-amber-500",
    ON_HOLD: "text-amber-500",
  };
  return (
    <span className={colors[status] ?? "text-muted-foreground"}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

export default function AccountPage() {
  const customer = useAuthStore((s) => s.customer);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) navigate({ to: "/login" });
  }, [accessToken, navigate]);

  if (!customer) {
    return (
      <section className="grid min-h-screen place-items-center bg-background px-5 pt-24 sm:px-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </section>
    );
  }

  return (
    <section className="bg-background px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-5xl italic tracking-tight sm:text-6xl">
              Hello, {customer.firstName ?? "there"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate({ to: "/" });
            }}
            className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.22em] hover:border-red-500 hover:text-red-500"
          >
            Sign out
          </button>
        </div>

        {customer.defaultAddress && (
          <div className="mt-8 rounded-2xl border border-border p-5">
            <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Shipping address</h2>
            <p className="mt-2 text-sm">
              {customer.defaultAddress.address1}
              {customer.defaultAddress.city && <>, {customer.defaultAddress.city}</>}
              {customer.defaultAddress.province && <>, {customer.defaultAddress.province}</>}
              {customer.defaultAddress.country && <>, {customer.defaultAddress.country}</>}
              {customer.defaultAddress.zip && <br />}
              {customer.defaultAddress.zip}
            </p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Order history</h2>
          {customer.orders.length === 0 ? (
            <div className="mt-6 grid place-items-center gap-4 rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <Link
                to="/shop"
                className="rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border p-5 transition-colors hover:border-bloom/40"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{order.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.processedAt).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-bloom">
                        {new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: order.totalPrice.currencyCode,
                          maximumFractionDigits: 0,
                        }).format(Number(order.totalPrice.amount))}
                      </p>
                      <div className="mt-1 flex gap-2 text-[10px] uppercase tracking-widest">
                        <OrderStatus status={order.financialStatus} />
                        <span aria-hidden>·</span>
                        <OrderStatus status={order.fulfillmentStatus} />
                      </div>
                    </div>
                  </div>
                  {order.lineItems.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.lineItems.slice(0, 3).map((li, i) => (
                        <span key={i} className="rounded-full bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                          {li.quantity}x {li.title}
                        </span>
                      ))}
                      {order.lineItems.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{order.lineItems.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
