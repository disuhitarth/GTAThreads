import { Suspense } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Gift } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { FaqAccordion } from "@/components/FaqAccordion";
import { occasionBySlug, OCCASIONS } from "@/lib/occasions";
import { getFaqs } from "@/lib/faqs";
import { productsQueryOptions } from "@/components/sections/FeaturedProducts";

export const Route = createFileRoute("/occasions/$slug")({
  head: ({ params }) => {
    const o = occasionBySlug(params.slug);
    if (!o) return { meta: [{ title: "Occasion — GTA Threads" }] };
    const faqs = getFaqs(params.slug);
    return {
      meta: [
        { title: `${o.title} gifts in Toronto — GTA Threads` },
        {
          name: "description",
          content: `${o.heroCopy} Hand-embroidered ${o.title} gifts, stitched to order in Toronto, with free GTA delivery on orders over $75.`,
        },
        { property: "og:title", content: `${o.title} gifts — GTA Threads` },
        { property: "og:description", content: o.heroCopy },
        { property: "og:url", content: `/occasions/${params.slug}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/occasions/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Occasions", item: "/occasions" },
              { "@type": "ListItem", position: 3, name: o.title, item: `/occasions/${params.slug}` },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  loader: ({ params, context }) => {
    const o = occasionBySlug(params.slug);
    if (!o) throw notFound();
    context.queryClient.ensureQueryData(productsQueryOptions(8, o.query));
    context.queryClient.ensureQueryData(productsQueryOptions(8));
  },
  component: OccasionPage,
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-3xl italic">A loose thread.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom">Retry</button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-5xl italic text-bloom">Not in the garden.</h1>
        <Link
          to="/occasions"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          See all occasions
        </Link>
      </div>
    </div>
  ),
});

function OccasionPage() {
  const { slug } = Route.useParams();
  const o = occasionBySlug(slug)!;

  return (
    <>
      <section className={`relative overflow-hidden bg-gradient-to-br ${o.tint} px-5 pb-20 pt-32 sm:px-8 sm:pt-40`}>
        <div className="pointer-events-none absolute right-4 top-32 hidden h-72 w-72 opacity-30 sm:right-12 sm:block" aria-hidden>
          <CategoryIcon slug={o.slug} className="h-full w-full" alt="" />
        </div>
        <div className="relative mx-auto max-w-[1100px]">
          <Link
            to="/occasions"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-bloom"
          >
            <ArrowLeft className="h-4 w-4" />
            All occasions
          </Link>
          <span className="mt-6 block font-script text-2xl text-bloom">{o.tagline}</span>
          <h1 className="mt-2 max-w-3xl font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            {o.title.includes(" ") ? (
              <>
                {o.title.split(" ")[0]}{" "}
                <span className="italic text-bloom">
                  {o.title.split(" ").slice(1).join(" ")}.
                </span>
              </>
            ) : (
              <span className="italic text-bloom">{o.title}.</span>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/80">{o.heroCopy}</p>
        </div>
      </section>

      <section className="bg-background px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Gift className="h-8 w-8 text-bloom" />
            <h2 className="mt-4 font-display text-3xl italic">A note from the studio.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {o.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="border-l-2 border-bloom pl-5 font-script text-xl text-bloom">
              {o.pairing}
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <Picks query={o.query} title={o.title} />
      </Suspense>

      <section className="bg-background px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="font-script text-2xl text-bloom">good to know</span>
            <h2 className="mt-2 font-display text-3xl italic sm:text-5xl">Frequently asked.</h2>
          </div>
          <FaqAccordion items={getFaqs(slug)} />
        </div>
      </section>

      <section className="bg-cream/60 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-6 rounded-[2rem] bg-background p-10 text-center shadow-md sm:p-14">
          <span className="font-script text-2xl text-bloom">need a little help?</span>
          <h3 className="font-display text-3xl italic sm:text-5xl">
            Try the gift finder.
          </h3>
          <p className="max-w-md text-base text-muted-foreground">
            Three little questions and we'll point you at the right piece.
          </p>
          <Link
            to="/gift-finder"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Find the gift
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-[1100px]">
          <p className="text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
            More occasions
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {OCCASIONS.filter((x) => x.slug !== o.slug).map((x) => (
              <Link
                key={x.slug}
                to="/occasions/$slug"
                params={{ slug: x.slug }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-bloom hover:text-bloom"
              >
                <CategoryIcon slug={x.slug} className="h-5 w-5" alt="" />
                {x.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Picks({ query, title }: { query?: string; title: string }) {
  const { data: filtered } = useSuspenseQuery(productsQueryOptions(8, query));
  const { data: all } = useSuspenseQuery(productsQueryOptions(8));
  const products = filtered.length ? filtered : all;
  const isFallback = filtered.length === 0 && all.length > 0;

  return (
    <section className="bg-background px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl italic sm:text-5xl">
            Picks for <span className="text-bloom">{title}.</span>
          </h2>
          {isFallback && (
            <p className="font-script text-lg text-bloom">
              from the whole shop — start here
            </p>
          )}
        </div>
        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 py-24 text-center">
            <p className="font-script text-2xl text-bloom">nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
