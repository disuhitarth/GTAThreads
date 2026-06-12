import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { productsQueryOptions } from "@/components/sections/FeaturedProducts";
import { CATEGORIES, type Category } from "@/lib/categories";
import { OCCASIONS } from "@/lib/occasions";

export function CategoryTemplate({ category }: { category: Category }) {
  return (
    <>
      <section className={`relative overflow-hidden bg-gradient-to-br ${category.tint} px-6 pb-20 pt-32 sm:px-8 sm:pt-40`}>
        <div className="pointer-events-none absolute right-4 top-32 hidden h-72 w-72 opacity-30 sm:right-12 sm:block" aria-hidden>
          <CategoryIcon slug={category.slug} className="h-full w-full" alt="" />
        </div>
        <div className="relative mx-auto max-w-[1100px]">
          <Link
            to="/category"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-bloom"
          >
            <ArrowLeft className="h-4 w-4" />
            All categories
          </Link>
          <span className="mt-6 block font-script text-2xl text-bloom">{category.tagline}</span>
          <h1 className="mt-2 max-w-3xl font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            {category.title.split(" ")[0]}{" "}
            {category.title.split(" ").length > 1 && (
              <span className="italic text-bloom">
                {category.title.split(" ").slice(1).join(" ")}.
              </span>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-foreground/80">{category.blurb}</p>
        </div>
      </section>

      <section className="bg-background px-6 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1100px] space-y-5 text-base leading-relaxed text-muted-foreground">
          {category.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <CategoryGrid query={category.query} title={category.title} />
      </Suspense>

      <section className="bg-cream/60 px-6 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Browse by occasion</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                to="/occasions/$slug"
                params={{ slug: o.slug }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-bloom hover:text-bloom"
              >
                <CategoryIcon slug={o.slug} className="h-5 w-5" alt="" />
                {o.title}
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            <p className="w-full text-xs uppercase tracking-[0.22em] text-muted-foreground">More categories</p>
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-bloom hover:text-bloom"
              >
                <CategoryIcon slug={c.slug} className="h-5 w-5" alt="" />
                {c.title}
              </Link>
            ))}
          </div>
          <Link
            to="/shop"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Shop everything
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}

function CategoryGrid({ query, title }: { query?: string; title: string }) {
  const { data: filtered } = useSuspenseQuery(productsQueryOptions(16, query));
  const { data: all } = useSuspenseQuery(productsQueryOptions(16));
  const products = filtered.length ? filtered : all;
  const isFallback = filtered.length === 0 && all.length > 0;

  return (
    <section className="bg-background px-6 pb-24 sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-4xl italic sm:text-5xl">
            {title} <span className="text-bloom">in the garden.</span>
          </h2>
          {isFallback && (
            <p className="font-script text-lg text-bloom">from the whole shop — start here</p>
          )}
        </div>
        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 py-24 text-center">
            <p className="font-script text-2xl text-bloom">nothing here yet</p>
            <p className="mt-2 text-sm text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
