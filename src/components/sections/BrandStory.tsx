import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutImg from "@/assets/about.jpg";

gsap.registerPlugin(ScrollTrigger);

export function BrandStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-background px-6 py-20 sm:px-8 sm:py-28 lg:py-36">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-24">
        <div className="reveal relative">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-secondary lg:aspect-[3/4]">
            <img
              src={aboutImg}
              alt="Hands stitching pink rose petals onto cream linen"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 rounded-full bg-bloom px-5 py-3 font-script text-xl text-accent-foreground shadow-lg">
            one stitch at a time
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="reveal font-script text-2xl text-bloom">studio note</span>
          <h2 className="reveal mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
            A small studio, <br />
            <span className="italic text-bloom">stitching slowly.</span>
          </h2>
          <p className="reveal mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
            GTA Threads is a one-woman embroidery studio in the Greater Toronto Area. Every piece is
            made on a single machine, in a quiet room — for grandmas, new mums, brides, dads, anime
            girls, and the people you actually love.
          </p>
          <p className="reveal mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            No mass production. No 24-hour shipping. Just careful stitching, soft cotton, and a
            little daisy somewhere you didn't expect.
          </p>
          <blockquote className="reveal mt-10 border-l-2 border-bloom pl-6 font-display text-2xl italic leading-snug text-foreground sm:text-3xl">
            "A gift that doesn't get re-gifted — that's the whole job."
          </blockquote>
        </div>
      </div>
    </section>
  );
}
