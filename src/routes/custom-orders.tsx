import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MagneticButton } from "@/components/MagneticButton";

export const Route = createFileRoute("/custom-orders")({
  head: () => ({
    meta: [
      { title: "Custom orders — GTA Threads" },
      {
        name: "description",
        content:
          "Custom embroidery for weddings, baby showers, sports teams, corporate gifts and bulk orders. Stitched to spec in Toronto.",
      },
      { property: "og:title", content: "Custom orders — GTA Threads" },
      { property: "og:description", content: "Tell us what you need. We'll stitch it." },
      { property: "og:url", content: "/custom-orders" },
    ],
    links: [{ rel: "canonical", href: "/custom-orders" }],
  }),
  component: CustomOrders,
});

type FormState = {
  product: string;
  occasion: string;
  quantity: number;
  designStatus: string;
  timeline: string;
  budget: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  city: string;
};

const EMPTY: FormState = {
  product: "",
  occasion: "",
  quantity: 25,
  designStatus: "",
  timeline: "",
  budget: "",
  notes: "",
  name: "",
  email: "",
  phone: "",
  city: "",
};

const STORAGE_KEY = "gta-threads:custom-order";

const PRODUCTS = ["T-shirts", "Hoodies", "Crewnecks", "Hats", "Tote bags", "Baby onesies", "Other"];
const OCCASIONS = ["Wedding", "Baby shower", "Birthday", "Corporate gift", "Sports team", "Memorial", "Holiday", "Other"];
const DESIGN_STATUS = [
  "I have artwork ready",
  "I have an idea — need help",
  "I want your team to design it",
  "Just a name or word",
];
const TIMELINES = ["Under 2 weeks (rush)", "2–4 weeks", "1–2 months", "Flexible / 3+ months"];
const BUDGETS = ["Under $250", "$250–$750", "$750–$2,000", "$2,000–$5,000", "$5,000+"];

function CustomOrders() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  // restore from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm({ ...EMPTY, ...JSON.parse(saved) });
    } catch {/* ignore */}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)); } catch {/* ignore */}
  }, [form]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const steps = [
    {
      title: "What are you making?",
      hint: "Pick the main piece — we can mix in extras later.",
      valid: !!form.product,
      content: (
        <ChipGrid value={form.product} options={PRODUCTS} onChange={(v) => set("product", v)} />
      ),
    },
    {
      title: "What's the occasion?",
      hint: "This helps us suggest the right palette and detailing.",
      valid: !!form.occasion,
      content: (
        <ChipGrid value={form.occasion} options={OCCASIONS} onChange={(v) => set("occasion", v)} />
      ),
    },
    {
      title: "How many pieces?",
      hint: "Slide to estimate — we'll confirm exact pricing in the quote.",
      valid: form.quantity > 0,
      content: (
        <div className="space-y-6">
          <p className="text-center font-display text-7xl italic text-bloom">{form.quantity}{form.quantity >= 500 ? "+" : ""}</p>
          <input
            type="range"
            min={5}
            max={500}
            step={5}
            value={form.quantity}
            onChange={(e) => set("quantity", parseInt(e.target.value, 10))}
            className="w-full accent-[color:var(--bloom)]"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5</span><span>100</span><span>250</span><span>500+</span>
          </div>
        </div>
      ),
    },
    {
      title: "Where are you at with the design?",
      hint: "Don't worry — most folks start with just an idea.",
      valid: !!form.designStatus,
      content: (
        <ChipGrid value={form.designStatus} options={DESIGN_STATUS} onChange={(v) => set("designStatus", v)} />
      ),
    },
    {
      title: "When do you need it?",
      hint: "Rush orders are possible — we'll just need to chat.",
      valid: !!form.timeline,
      content: (
        <ChipGrid value={form.timeline} options={TIMELINES} onChange={(v) => set("timeline", v)} />
      ),
    },
    {
      title: "What's your budget?",
      hint: "Ballpark is fine. Helps us suggest the right products.",
      valid: !!form.budget,
      content: (
        <ChipGrid value={form.budget} options={BUDGETS} onChange={(v) => set("budget", v)} />
      ),
    },
    {
      title: "Anything else we should know?",
      hint: "Colours, dates, words you want stitched, references — all welcome.",
      valid: true,
      content: (
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value.slice(0, 1000))}
          rows={6}
          placeholder="Tell us about your vision…"
          className="w-full rounded-2xl border border-border bg-background p-5 text-base outline-none focus:border-bloom"
        />
      ),
    },
    {
      title: "How do we reach you?",
      hint: "We'll respond within one business day with a quote.",
      valid: form.name.trim().length > 1 && /.+@.+\..+/.test(form.email),
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" value={form.name} onChange={(v) => set("name", v.slice(0, 100))} placeholder="First & last" />
          <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v.slice(0, 200))} placeholder="you@example.com" />
          <Field label="Phone (optional)" value={form.phone} onChange={(v) => set("phone", v.slice(0, 30))} placeholder="(416) 555-0100" />
          <Field label="City" value={form.city} onChange={(v) => set("city", v.slice(0, 100))} placeholder="Toronto, ON" />
        </div>
      ),
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  function submit() {
    // Save locally + open mailto so the brief reaches the studio. Once Cloud is enabled
    // we'll swap this for a server function that writes to Supabase.
    const lines = [
      `New custom order request — GTA Threads`,
      ``,
      `Product: ${form.product}`,
      `Occasion: ${form.occasion}`,
      `Quantity: ${form.quantity}`,
      `Design status: ${form.designStatus}`,
      `Timeline: ${form.timeline}`,
      `Budget: ${form.budget}`,
      ``,
      `Notes:`,
      form.notes || "(none)",
      ``,
      `From: ${form.name} <${form.email}>`,
      `Phone: ${form.phone || "(not provided)"}`,
      `City: ${form.city || "(not provided)"}`,
    ].join("\n");

    const subject = encodeURIComponent(`Custom order — ${form.occasion || "request"} (${form.quantity} ${form.product})`);
    const body = encodeURIComponent(lines);
    window.location.href = `mailto:hello@gtathreads.com?subject=${subject}&body=${body}`;

    try { localStorage.removeItem(STORAGE_KEY); } catch {/* ignore */}
    setSubmitted(true);
    toast.success("Your request is on its way 🌸");
  }

  if (submitted) {
    return (
      <section className="grid min-h-[80vh] place-items-center bg-background px-5 pt-24 sm:px-8">
        <div className="max-w-xl text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-bloom/15 text-bloom">
            <Check className="h-10 w-10" />
          </div>
          <span className="mt-6 block font-script text-2xl text-bloom">thank you</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.05] italic sm:text-7xl">
            Your brief is <span className="text-bloom">on its way.</span>
          </h1>
          <p className="mt-6 text-base text-muted-foreground">
            We'll reply within one business day with a quote, palette suggestions and a few sample mock-ups. Check your sent folder — and your inbox.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom">Back home</Link>
            <Link to="/shop" className="rounded-full border border-foreground/60 px-6 py-3 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom">Browse shop</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[820px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">tell us your idea</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            Custom <span className="italic text-bloom">orders.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
            Weddings, baby showers, sports teams, corporate gifts — eight little questions and we'll send a quote.
          </p>
        </div>

        {/* progress */}
        <div className="mt-12 flex items-center justify-center gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-10 bg-bloom" : i < step ? "w-6 bg-bloom/60" : "w-6 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-card p-8 shadow-sm sm:p-12">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
          <h2 className="mt-3 font-display text-3xl italic sm:text-5xl">{current.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{current.hint}</p>

          <div className="mt-8">{current.content}</div>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground enabled:hover:text-bloom disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {isLast ? (
              <MagneticButton
                onClick={submit}
                disabled={!current.valid}
                className="group items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.22em] text-background enabled:hover:bg-bloom disabled:opacity-40"
              >
                <Mail className="h-4 w-4" />
                Send my brief
              </MagneticButton>
            ) : (
              <MagneticButton
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                disabled={!current.valid}
                className="group items-center gap-2 rounded-full bg-foreground px-7 py-3 text-xs uppercase tracking-[0.22em] text-background enabled:hover:bg-bloom disabled:opacity-40"
              >
                Next
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            )}
          </div>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-bloom" />
          Your progress autosaves as you type.
        </p>
      </div>
    </section>
  );
}

function ChipGrid({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-full border px-5 py-3 text-sm transition-all ${
            value === o
              ? "border-bloom bg-bloom/15 text-bloom"
              : "border-border bg-background hover:border-bloom/60 hover:text-bloom"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-bloom"
      />
    </label>
  );
}
