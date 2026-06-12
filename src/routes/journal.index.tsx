import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/components/sections/JournalTeaser";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Journal — GTA Threads" },
      {
        name: "description",
        content:
          "Slow notes from the GTA Threads studio — on stitching with love, gifting heirlooms, and the spring drop.",
      },
      { property: "og:title", content: "Journal — GTA Threads" },
      {
        property: "og:description",
        content: "Slow notes from a small Toronto embroidery studio.",
      },
      { property: "og:url", content: "/journal" },
    ],
    links: [{ rel: "canonical", href: "/journal" }],
  }),
  component: JournalIndex,
});

function JournalIndex() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1300px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">slow read, soft thoughts</span>
          <h1 className="mt-2 font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            The <span className="italic text-bloom">journal.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            Notes from the studio. On stitching, on gifting, on the slow business
            of making something by hand.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to="/journal/$slug"
              params={{ slug: p.slug }}
              className="group block overflow-hidden rounded-3xl bg-secondary/30 transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.minutes} min read</span>
                </div>
                <h2 className="mt-3 font-display text-2xl italic leading-tight group-hover:text-bloom">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
