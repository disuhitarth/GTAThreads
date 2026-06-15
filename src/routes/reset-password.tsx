import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { customerRecover } from "@/lib/shopify";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password – GTA Threads" },
      { name: "description", content: "Reset your GTA Threads account password." },
    ],
  }),
});

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    const result = await customerRecover(email);
    if (!result.success) {
      setError(result.error);
      setPending(false);
    } else {
      setSent(true);
      setPending(false);
    }
  };

  if (sent) {
    return (
      <section className="grid min-h-screen place-items-center bg-background px-5 pt-24 sm:px-8">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-4xl italic tracking-tight">Check your email</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Back to sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid min-h-screen place-items-center bg-background px-5 pt-24 sm:px-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-5xl italic tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We'll send you a reset link if an account exists.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="reset-email" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-foreground py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom disabled:opacity-50"
          >
            {isPending ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="underline hover:text-bloom">
            Back to sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
