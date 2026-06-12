import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORIES } from "@/lib/categories";

export const Route = createFileRoute("/category/")({
  head: () => ({
    meta: [
      { title: "Shop by category — GTA Threads" },
      {
        name: "description",
        content:
          "Browse hand-embroidered tees, hoodies, hats, accessories, kids and matching sets — all stitched in Toronto.",
      },
      { property: "og:title", content: "Shop by category — GTA Threads" },
      { property: "og:description", content: "Tees, hoodies, hats, baby pieces and more." },
      { property: "og:url", content: "/category" },
    ],
    links: [{ rel: "canonical", href: "/category" }],
  }),
  component: CategoryIndex,
});

function CategoryIndex() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">the whole garden, sorted</span>
          <h1 className="mt-2 font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            Shop by <span className="italic text-bloom">category.</span>
          </h1>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${c.tint} p-8 transition-transform hover:-translate-y-1`}
            >
              <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-90 transition-transform group-hover:scale-110" aria-hidden>
                <CategoryIcon slug={c.slug} className="h-full w-full" alt="" />
              </div>
              <p className="font-script text-lg text-bloom">{c.tagline}</p>
              <h2 className="mt-2 font-display text-3xl italic">{c.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{c.blurb}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-foreground/80">
                Shop {c.title.toLowerCase()}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
