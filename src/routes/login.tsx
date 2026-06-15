import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in – GTA Threads" },
      { name: "description", content: "Sign in to your GTA Threads account." },
      { property: "og:title", content: "Sign in – GTA Threads" },
      { name: "twitter:title", content: "Sign in – GTA Threads" },
    ],
  }),
});

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const isPending = useAuthStore((s) => s.isPending);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const err = await login(email, password);
    if (err) {
      setError(err);
    } else {
      navigate({ to: "/account" });
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-background px-5 pt-24 sm:px-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl italic tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back to GTA Threads.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-foreground py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom disabled:opacity-50"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Link to="/reset-password" className="underline hover:text-bloom">
              Forgot password?
            </Link>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link to="/register" className="text-foreground underline hover:text-bloom">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
