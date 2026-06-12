import { ExternalLink } from "lucide-react";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import occasions from "@/assets/occasions.jpg";

const tiles = [hero, occasions, about, look1, look2, look3];

export function InstagramStrip() {
  return (
    <section className="bg-background px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-script text-2xl text-bloom">from the feed</span>
            <h2 className="mt-2 font-display text-4xl italic tracking-tight sm:text-6xl">
              @gta_threads
            </h2>
          </div>
          <a
            href="https://www.instagram.com/gta_threads/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-foreground/60 px-5 py-2.5 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom"
          >
            Follow on Instagram
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {tiles.map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/gta_threads/"
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl bg-secondary/40 ring-1 ring-border"
            >
              <img
                src={src}
                alt="Embroidery from the GTA Threads studio on Instagram"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 grid place-items-center bg-bloom/0 transition-colors duration-300 group-hover:bg-bloom/40">
                <ExternalLink className="h-5 w-5 text-background opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
