import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { OCCASIONS } from "@/lib/occasions";

gsap.registerPlugin(ScrollTrigger);

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

export function Occasions() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".occ-card", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="occasions"
      className="relative bg-background px-6 py-20 sm:px-8 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 text-center">
          <span className="font-script text-2xl text-bloom">a little something for every day</span>
          <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            Shop by <span className="italic text-bloom">occasion.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Whether you're celebrating the new mum, the dad who's seen it all, or your own Galentine
            — there's a stitched gift for that.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => (
            <Link
              key={o.slug}
              to="/occasions/$slug"
              params={{ slug: o.slug }}
              className={`occ-card group relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 ${TINTS[o.slug] ?? "bg-cream/60"}`}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 opacity-80 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
                <CategoryIcon slug={o.slug} className="h-full w-full" alt="" />
              </div>
              <div className="relative">
                <span className="font-script text-xl text-bloom">{o.tagline}</span>
              </div>
              <div className="relative">
                <h3 className="font-display text-3xl italic leading-tight sm:text-4xl">
                  {o.title}
                </h3>
                <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-foreground/80 transition-colors group-hover:text-bloom">
                  Explore gifts
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
