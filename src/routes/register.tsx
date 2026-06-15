import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { customerRegister, customerLogin, getCustomer } from "@/lib/shopify";
import { useAuthStore } from "@/stores/authStore";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account – GTA Threads" },
      { name: "description", content: "Create your GTA Threads account." },
      { property: "og:title", content: "Create account – GTA Threads" },
      { name: "twitter:title", content: "Create account – GTA Threads" },
    ],
  }),
});

export default function RegisterPage() {
  const setCustomer = useAuthStore((s) => s.setCustomer);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await customerRegister({ email, password, firstName, lastName });
      if (!result.success) {
        setError(result.error);
        return;
      }
      const loginResult = await customerLogin({ email, password });
      if (!loginResult.success) {
        navigate({ to: "/login" });
        return;
      }
      const customer = await getCustomer(loginResult.accessToken);
      setCustomer(customer!, loginResult.accessToken);
      navigate({ to: "/account" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="grid min-h-screen place-items-center bg-background px-5 pt-24 sm:px-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl italic tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join the GTA Threads community.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reg-email" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-foreground py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom disabled:opacity-50"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline hover:text-bloom">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
