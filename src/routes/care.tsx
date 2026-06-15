import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplet, Sun, Wind, Sparkles } from "lucide-react";

const FAQS = [
  {
    q: "How should I wash an embroidered piece?",
    a: "Always wash inside-out in cold water on a gentle cycle, with a mild dye-free detergent. Skip the bleach and harsh fabric softeners — they dull the thread colour over time.",
  },
  {
    q: "Can I put it in the dryer?",
    a: "We don't recommend it. Tumble drying can pucker the embroidery and shrink the cotton. Lay flat to dry and reshape while damp for the best result.",
  },
  {
    q: "Is it safe to iron?",
    a: "Yes, but iron on the reverse side, on a medium setting, with a thin cotton cloth between the iron and the stitches. A handheld steamer is even kinder.",
  },
  {
    q: "A thread came loose — what do I do?",
    a: "Don't pull it. Clip the thread close to the fabric with sharp scissors. Most loose threads happen in the first few washes and settle naturally afterwards.",
  },
  {
    q: "How should I store embroidered cotton?",
    a: "Fold and store flat rather than on a hanger — embroidered pieces hold their shape best lying down, especially heavier sweatshirts and totes.",
  },
];

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Care instructions — GTA Threads" },
      {
        name: "description",
        content:
          "How to wash, dry and care for hand-embroidered cotton pieces so they last for years.",
      },
      { property: "og:title", content: "Care instructions — GTA Threads" },
      { property: "og:description", content: "How to care for hand-embroidered cotton." },
      { property: "og:url", content: "/care" },
    ],
    links: [{ rel: "canonical", href: "/care" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Care,
});

const TIPS = [
  {
    icon: Droplet,
    title: "Cold wash, inside out",
    body: "Always wash inside-out in cold water on a gentle cycle. Use a mild, dye-free detergent — no bleach, ever.",
  },
  {
    icon: Wind,
    title: "Air dry flat",
    body: "Lay flat to dry, reshape while damp. Tumble drying can pucker the embroidery and shrink the cotton.",
  },
  {
    icon: Sun,
    title: "Iron on the reverse",
    body: "If you must iron, do it on the reverse side, on a medium setting, with a thin cotton cloth between the iron and the stitches.",
  },
  {
    icon: Sparkles,
    title: "Steam to refresh",
    body: "A handheld steamer is your best friend — it refreshes the cotton without flattening the embroidery.",
  },
];

function Care() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[900px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">made to last</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            Care <span className="italic text-bloom">instructions.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
            Real embroidery, like real flowers, asks for a little tenderness. Treat it gently and it
            will look beautiful for years.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {TIPS.map((t) => (
            <div key={t.title} className="rounded-[2rem] bg-cream/50 p-7">
              <t.icon className="h-7 w-7 text-bloom" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-2xl italic">{t.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-5 text-base leading-relaxed text-muted-foreground">
          <h2 className="font-display text-3xl italic text-foreground">A few extra notes</h2>
          <p>
            If a thread loosens, do not pull — clip it close to the fabric with sharp scissors. Most
            loose threads happen in the first few washes and settle naturally.
          </p>
          <p>
            Avoid harsh fabric softeners; they coat the threads and dull the colour. A splash of
            white vinegar in the rinse keeps everything soft, without the residue.
          </p>
          <p>
            Store folded, not on a hanger — embroidered pieces hold their shape best lying flat.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="font-display text-3xl italic">Frequently asked</h2>
          <dl className="mt-6 space-y-6">
            {FAQS.map((f) => (
              <div key={f.q} className="border-b border-border/60 pb-6">
                <dt className="font-display text-xl italic text-foreground">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 rounded-[2rem] bg-cream/50 p-8 text-center">
          <p className="font-script text-2xl text-bloom">keep exploring</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <PillLink to="/shipping-returns">Shipping & returns</PillLink>
            <PillLink to="/size-guide">Size guide</PillLink>
            <PillLink to="/custom-orders">Custom orders</PillLink>
            <PillLink to="/journal">Read the journal</PillLink>
            <PillLink to="/shop">Shop everything</PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function PillLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-bloom hover:text-bloom"
    >
      {children}
    </Link>
  );
}
