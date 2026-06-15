import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Package, RefreshCw, MapPin } from "lucide-react";

const FAQS = [
  {
    q: "How fast can I get an order in the GTA?",
    a: "Free local delivery on orders over $75 anywhere within the Greater Toronto Area, delivered Tuesday–Friday with a heads-up text the morning of. Processing takes 5–7 business days from order approval; rush 48-hour turnaround is available for a fee — message us first.",
  },
  {
    q: "How much is Canada-wide shipping?",
    a: "Canada Post tracked shipping starts at $9 and is free on orders over $150. Typical transit is 2–5 business days from when your piece leaves our Toronto studio.",
  },
  {
    q: "Do you ship to the US?",
    a: "Yes — US orders arrive in 5–10 business days, with duties calculated at checkout. We also ship to select international destinations on request.",
  },
  {
    q: "What's your return policy?",
    a: "Send any non-personalised piece back within 30 days in original condition for a full refund. Personalised items are final sale — we send a digital proof before stitching so you're sure.",
  },
  {
    q: "What if my order arrives damaged?",
    a: "Send us a photo at hello@gtathreads.com within 7 days of delivery and we'll replace the piece at no charge.",
  },
  {
    q: "What are the holiday order deadlines?",
    a: "Order by February 7 for Valentine's Day, April 24 for Mother's Day, June 5 for Father's Day, and December 5 for Christmas to guarantee delivery.",
  },
];

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & returns — GTA Threads" },
      {
        name: "description",
        content:
          "Same-week GTA delivery, Canada-wide and US shipping, plus our gentle 30-day returns policy.",
      },
      { property: "og:title", content: "Shipping & returns — GTA Threads" },
      { property: "og:description", content: "Same-week GTA delivery and 30-day returns." },
      { property: "og:url", content: "/shipping-returns" },
    ],
    links: [{ rel: "canonical", href: "/shipping-returns" }],
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
  component: Shipping,
});

function Shipping() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1000px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">getting it to you</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            Shipping & <span className="italic text-bloom">returns.</span>
          </h1>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card icon={MapPin} title="GTA local same-week">
            Free local delivery on orders over $75 anywhere within the Greater Toronto Area.
            Delivered Tuesday–Friday, with a text the morning of.
          </Card>
          <Card icon={Truck} title="Canada-wide">
            Canada Post tracked shipping from $9. Free on orders over $150. Typical transit: 2–5
            business days.
          </Card>
          <Card icon={Package} title="USA & international">
            We ship to the US (5–10 days) and select international destinations on request. Duties
            are calculated at checkout.
          </Card>
          <Card icon={RefreshCw} title="30-day returns">
            Not in love with your piece? Send it back within 30 days, in original condition, for a
            full refund. Personalised items are final sale (we'll send a digital proof before
            stitching so you're sure).
          </Card>
        </div>

        <div className="mt-16 space-y-5 text-base leading-relaxed text-muted-foreground">
          <h2 className="font-display text-3xl italic text-foreground">
            The fine print, kept short
          </h2>
          <p>
            <strong className="text-foreground">Processing time:</strong> 5–7 business days from
            order approval. Rush turnaround in 48 hours is available for an additional fee — message
            us first.
          </p>
          <p>
            <strong className="text-foreground">Holiday deadlines:</strong> Order by February 7
            (Valentine's), April 24 (Mother's Day), June 5 (Father's Day), and December 5
            (Christmas) for guaranteed delivery.
          </p>
          <p>
            <strong className="text-foreground">Address changes:</strong> Email hello@gtathreads.com
            within 12 hours of ordering and we'll update before stitching begins.
          </p>
          <p>
            <strong className="text-foreground">Damaged in transit:</strong> Send us a photo within
            7 days of delivery and we'll replace at no charge.
          </p>
        </div>

        <div className="mt-20">
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
          <p className="font-script text-2xl text-bloom">while you're here</p>
          <p className="mt-2 text-sm text-muted-foreground">A few more pages worth a peek.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <PillLink to="/care">Care instructions</PillLink>
            <PillLink to="/size-guide">Size guide</PillLink>
            <PillLink to="/custom-orders">Custom orders</PillLink>
            <PillLink to="/gift-finder">Gift finder</PillLink>
            <PillLink to="/occasions">Shop by occasion</PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Truck;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] bg-cream/50 p-7">
      <Icon className="h-7 w-7 text-bloom" strokeWidth={1.5} />
      <h2 className="mt-4 font-display text-2xl italic">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
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
