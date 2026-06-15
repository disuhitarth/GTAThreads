import { useState, type ReactNode } from "react";
import { createFileRoute, Link, Outlet, useRouter, useMatches } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Package, ShoppingCart, LayoutDashboard, LogOut, Shield } from "lucide-react";
import { verifyAdminPassword } from "@/lib/admin-api.functions";

const AUTH_KEY = "gta_admin_auth";

function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

function requireAuth() {
  if (!isAuthed()) {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-3xl italic">A loose thread.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          Retry
        </button>
      </div>
    </div>
  ),
});

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const verify = useServerFn(verifyAdminPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await verify({ data: { password } });
    if (result.ok) {
      sessionStorage.setItem(AUTH_KEY, "true");
      onLogin();
    } else {
      setError("Wrong password");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-bloom" />
          <h1 className="mt-4 font-display text-3xl italic">Studio admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin password to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            aria-label="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm focus:border-bloom focus:outline-none"
          />
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Enter
          </button>
        </form>
        <Link
          to="/"
          className="mt-6 block text-center text-xs text-muted-foreground hover:text-bloom"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
];

function AdminLayout() {
  const router = useRouter();
  const [authed, setAuthed] = useState(isAuthed);
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.routeId ?? "";

  if (!authed) {
    return (
      <LoginForm
        onLogin={() => {
          setAuthed(true);
          router.invalidate();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-card/40 p-6 sm:flex">
        <Link to="/admin" className="mb-8 flex items-center gap-3">
          <Shield className="h-6 w-6 text-bloom" />
          <span className="font-display text-lg italic">Admin</span>
        </Link>
        <nav aria-label="Admin" className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? currentPath === "/admin"
              : currentPath.startsWith("/admin" + item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-bloom/10 text-bloom font-medium"
                    : "text-muted-foreground hover:bg-secondary/60"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
            router.invalidate();
          }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-red-500"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-5 py-3 sm:hidden">
          <Link to="/admin" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-bloom" />
            <span className="font-display italic">Admin</span>
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem(AUTH_KEY);
              setAuthed(false);
              router.invalidate();
            }}
            className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-red-500"
          >
            Log out
          </button>
        </header>
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
