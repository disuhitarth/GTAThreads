import { useEffect, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

gsap.registerPlugin(ScrollTrigger);

export const productsQueryOptions = (first = 12, query?: string) => ({
  queryKey: ["products", first, query ?? "all"],
  queryFn: () => fetchProducts(first, query),
  staleTime: 1000 * 60 * 5,
});

export function FeaturedProducts() {
  const { data: products } = useSuspenseQuery(productsQueryOptions(8));
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, [products.length]);

  return (
    <section ref={root} id="shop" className="bg-background px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-script text-2xl text-bloom">fresh off the hoop</span>
            <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Featured <span className="italic text-bloom">pieces.</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-foreground/60 px-5 py-2.5 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="reveal mt-16 rounded-3xl border border-dashed border-border bg-card/60 py-24 text-center">
            <p className="font-script text-2xl text-bloom">no blooms yet</p>
            <p className="mt-2 text-sm text-muted-foreground">No products found.</p>
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 lg:grid-cols-4">
            {products.map((p, i) => (
              <div key={p.node.id} className="reveal">
                <ProductCard product={p} priority={i < 2} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
