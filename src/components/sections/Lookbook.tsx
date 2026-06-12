import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import hero from "@/assets/hero.jpg";
import occasions from "@/assets/occasions.jpg";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  { src: hero, label: "01 / Signature", caption: "Blush rose crewneck" },
  { src: occasions, label: "02 / Gift table", caption: "Flat-lay for the season" },
  { src: look2, label: "03 / Thread study", caption: "Macro · roses on cream" },
  { src: look1, label: "04 / Layered", caption: "Brick & navy" },
  { src: look3, label: "05 / Folded", caption: "Wrapped and ready" },
];

export function Lookbook() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const el = track.current!;
      const distance = el.scrollWidth - window.innerWidth + 80;
      gsap.to(el, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-foreground text-background"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 pt-20 sm:px-8 sm:pt-24 lg:pt-32">
        <span className="font-script text-2xl text-rose">a little look around</span>
        <h2 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
          Quiet pieces, <span className="italic text-rose">soft city.</span>
        </h2>
      </div>

      <div className="relative mt-14 pb-24">
        <div
          ref={track}
          className="flex flex-col gap-6 px-6 sm:gap-8 sm:px-8 lg:flex-row lg:flex-nowrap lg:gap-10 lg:will-change-transform"
        >
          {slides.map((s, i) => (
            <figure key={i} className="relative w-full shrink-0 lg:w-[55vw]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-background/10 lg:aspect-[3/4] lg:h-[70vh] lg:w-full">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between text-xs uppercase tracking-[0.22em] text-background/70">
                <span>{s.label}</span>
                <span>{s.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
