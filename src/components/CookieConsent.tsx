import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gta-threads:cookie-consent";

type Consent = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setConsent("declined");
    setVisible(false);
  };

  if (!visible || consent) return null;

  return (
    <div
      className={cn(
        "fixed bottom-5 left-5 right-5 z-[80] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500",
        "rounded-2xl border border-border bg-card p-5 shadow-2xl backdrop-blur-md sm:left-5 sm:right-auto",
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <button
        onClick={decline}
        aria-label="Close"
        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-sm leading-relaxed text-foreground/85">
        We use cookies to keep your cart working, remember your preferences, and understand how you
        use our site. Read our{" "}
        <a href="/privacy" className="text-bloom underline-offset-4 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={accept}
          className="rounded-full bg-foreground px-5 py-2 text-xs uppercase tracking-[0.18em] text-background hover:bg-bloom transition-colors"
        >
          Accept all
        </button>
        <button
          onClick={decline}
          className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.18em] text-foreground/70 hover:border-bloom hover:text-bloom transition-colors"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
