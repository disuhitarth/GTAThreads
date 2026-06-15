import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { OCCASIONS } from "@/lib/occasions";

const TINTS: Record<string, string> = {
  valentines: "bg-rose/60",
  "mothers-day": "bg-cream",
  "fathers-day": "bg-sage/50",
  baby: "bg-cream/80",
  christmas: "bg-sage/60",
  birthdays: "bg-rose/50",
  grandparents: "bg-cream",
  couples: "bg-rose/40",
  wedding: "bg-cream/80",
  halloween: "bg-rose/30",
  pets: "bg-sage/40",
  "nurse-scrubs": "bg-sage/50",
  auntie: "bg-rose/40",
  autumn: "bg-cream",
  jesus: "bg-cream/80",
  "custom-embroidery": "bg-sage/40",
};

export const Route = createFileRoute("/occasions/")({
  head: () => ({
    meta: [
      { title: "Shop by occasion — GTA Threads" },
      {
        name: "description",
        content:
          "Curated embroidered gifts for Valentine's Day, Mother's Day, Father's Day, baby showers, Christmas, birthdays and every day in between.",
      },
      { property: "og:title", content: "Shop by occasion — GTA Threads" },
      {
        property: "og:description",
        content: "Embroidered gifts for every celebration, made in Toronto.",
      },
      { property: "og:url", content: "/occasions" },
    ],
    links: [{ rel: "canonical", href: "/occasions" }],
  }),
  component: OccasionsIndex,
});

function OccasionsIndex() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">a gift for every day</span>
          <h1 className="mt-2 font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            Shop by <span className="italic text-bloom">occasion.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            From the woman who raised you to the baby who just arrived — every celebration deserves
            something stitched.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              to="/occasions/$slug"
              params={{ slug: o.slug }}
              className={`group relative flex h-80 flex-col justify-between overflow-hidden rounded-3xl p-7 transition-transform hover:-translate-y-1 ${TINTS[o.slug] ?? "bg-cream/60"}`}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-36 w-36 opacity-80 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
                <CategoryIcon slug={o.slug} className="h-full w-full" alt="" />
              </div>
              <span className="relative font-script text-xl text-bloom">{o.tagline}</span>
              <div className="relative">
                <h2 className="font-display text-4xl italic leading-tight">{o.title}</h2>
                <p className="mt-3 max-w-xs text-sm text-foreground/80">{o.heroCopy}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] group-hover:text-bloom">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
