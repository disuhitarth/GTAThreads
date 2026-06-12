import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { productsQueryOptions } from "./FeaturedProducts";
import { ProductCard } from "@/components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export function BestsellersCarousel() {
  const { data: products } = useSuspenseQuery(productsQueryOptions(12));
  const trackRef = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 280;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });
  };

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".bs-fade", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  if (!products.length) return null;

  return (
    <section
      ref={root}
      className="bg-cream/60 px-6 py-20 sm:px-8 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="bs-fade flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-script text-2xl text-bloom">most loved this season</span>
            <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
              Bestsellers.
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background hover:border-bloom hover:text-bloom"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background hover:border-bloom hover:text-bloom"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="bs-fade mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <div
              key={p.node.id}
              data-card
              className="w-[72vw] shrink-0 snap-start sm:w-[40vw] lg:w-[24vw]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
