import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToNewsletter } from "@/lib/newsletter.functions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const subscribe = useServerFn(subscribeToNewsletter);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/.+@.+\..+/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    try {
      await subscribe({ data: { email } });
      setSubmitted(true);
      toast.success("You're on the bloom list.");
    } catch {
      toast.error("Something went wrong. Try again in a moment.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose/40 to-cream px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="absolute -left-10 top-10 text-9xl opacity-20" aria-hidden>🌷</div>
      <div className="absolute -right-10 bottom-10 text-9xl opacity-20" aria-hidden>🌸</div>

      <div className="relative mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div>
          <span className="font-script text-2xl text-bloom">stay close</span>
          <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            Join the <span className="italic text-bloom">bloom list.</span>
          </h2>
        </div>
        <div>
          <p className="max-w-md text-base text-muted-foreground">
            Small drops, occasion guides, behind-the-stitch peeks, and the
            occasional 10% off — sent only when there's something worth saying.
            No spam, promise.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-3 rounded-full border border-foreground/30 bg-background p-2 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitted}
              className="w-full rounded-full bg-transparent px-5 py-2 text-base placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-bloom disabled:opacity-60"
            >
              {submitted ? "Subscribed" : "Subscribe"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
