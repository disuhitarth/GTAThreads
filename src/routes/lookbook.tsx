import { createFileRoute } from "@tanstack/react-router";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";

const shots = [
  { src: hero, span: "lg:col-span-7 lg:row-span-2", caption: "01 / Signature crewneck" },
  { src: look2, span: "lg:col-span-5", caption: "02 / Thread study" },
  { src: look1, span: "lg:col-span-5", caption: "03 / Brick + navy" },
  { src: look3, span: "lg:col-span-6", caption: "04 / Folded flat" },
  { src: about, span: "lg:col-span-6", caption: "05 / In the studio" },
];

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — GTA Threads" },
      {
        name: "description",
        content: "Editorial lookbook from the GTA Threads studio in Toronto.",
      },
      { property: "og:title", content: "Lookbook — GTA Threads" },
      { property: "og:description", content: "Editorial lookbook from Toronto." },
      { property: "og:url", content: "/lookbook" },
      { property: "og:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/lookbook" }],
  }),
  component: LookbookPage,
});

function LookbookPage() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-foreground/40" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Lookbook · FW
          </span>
        </div>
        <h1 className="mt-4 font-display text-6xl italic leading-[1.02] tracking-tight sm:text-8xl">
          Quiet pieces, <br />
          <span className="text-accent">loud city.</span>
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12 lg:auto-rows-[28vw]">
          {shots.map((s, i) => (
            <figure key={i} className={`relative overflow-hidden bg-secondary/40 ${s.span}`}>
              <div className="relative h-full w-full aspect-[4/5] lg:aspect-auto">
                <img
                  src={s.src}
                  alt={s.caption}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="absolute bottom-3 left-3 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.3em]">
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
