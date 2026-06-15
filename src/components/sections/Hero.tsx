import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { FloralRing } from "@/components/FloralRing";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-word", { y: "110%", opacity: 0 });
      gsap.set(".hero-fade", { y: 16, opacity: 0 });
      gsap.set(".hero-image", { scale: 1.08, opacity: 0 });
      gsap.set(".hero-petal", { opacity: 0, y: -30 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-image", { opacity: 1, scale: 1, duration: 1.4 }, 0)
        .to(".hero-word", { y: "0%", opacity: 1, duration: 1.0, stagger: 0.09 }, 0.2)
        .to(".hero-fade", { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, 0.6)
        .to(".hero-petal", { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.4);

      // Drifting petals
      gsap.to(".hero-petal", {
        y: "+=20",
        rotation: "+=10",
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-gradient-to-b from-rose/30 via-background to-background pt-24 sm:pt-28"
    >
      {/* Floating petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[
          { left: "8%", top: "18%", size: 22, color: "#E48BA1", rot: 30 },
          { left: "18%", top: "68%", size: 16, color: "#C8447A", rot: 80 },
          { left: "42%", top: "12%", size: 18, color: "#F5B6C6", rot: 150 },
          { left: "70%", top: "78%", size: 24, color: "#E48BA1", rot: 210 },
          { left: "88%", top: "26%", size: 14, color: "#C8447A", rot: 60 },
          { left: "55%", top: "42%", size: 12, color: "#F8D7A8", rot: 120 },
        ].map((p, i) => (
          <span
            key={i}
            className="hero-petal absolute block"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: "60% 0 60% 0",
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-28">
        <div className="flex flex-col justify-between">
          <div className="hero-fade inline-flex items-center gap-2 self-start rounded-full border border-bloom/30 bg-background/70 px-4 py-1.5 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-bloom" />
            <span className="font-script text-base text-bloom">
              a love-letter for every occasion
            </span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,10vw,9rem)] font-medium leading-[0.95] tracking-[-0.02em]">
            <span className="block overflow-hidden">
              <span className="hero-word inline-block">Gifts,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word inline-block italic text-bloom">stitched</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word inline-block">with love.</span>
            </span>
          </h1>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <p className="hero-fade max-w-md text-base leading-relaxed text-muted-foreground">
              Hand-embroidered sweatshirts, tees, totes and tiny baby pieces — made one stitch at a
              time in the Greater Toronto Area for every kind of celebration. Made for the girls.
              Made for the ones you love.
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-bloom"
              >
                Shop the drop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/occasions"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/60 px-6 py-3 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom"
              >
                Shop by occasion
              </Link>
            </div>
          </div>
        </div>

        <div className="relative">
          <FloralRing className="absolute -inset-8 -z-0 h-[calc(100%+4rem)] w-[calc(100%+4rem)] opacity-60" />
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-secondary/40 shadow-xl">
            <img
              src={heroImage}
              alt="Person wearing a blush embroidered sweatshirt by GTA Threads"
              width={1280}
              height={1600}
              className="hero-image absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="hero-fade absolute -left-3 top-6 rounded-full bg-background px-4 py-2 font-script text-base text-bloom shadow-md">
            for her, with love
          </div>
          <div className="hero-fade absolute -bottom-3 right-6 rounded-full bg-bloom px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-accent-foreground shadow-md">
            Made to order
          </div>
        </div>
      </div>
    </section>
  );
}
