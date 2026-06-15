import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import journal from "@/assets/journal.jpg";
import about from "@/assets/about.jpg";
import occasions from "@/assets/occasions.jpg";

export const POSTS = [
  {
    slug: "stitching-with-love",
    title: "Stitching with love — why we still do it slow",
    excerpt:
      "On the joy of a one-woman studio, and what gets lost when everything is mass-produced.",
    cover: about,
    minutes: 4,
    date: "March 2026",
    body: [
      "There's a kind of love that goes into a thing made by hand. You can feel it in the slight imperfection of a stitch, the way the rose is tilted just a little, the way the daisy isn't quite centred. That's the love. That's the whole reason.",
      "When I started GTA Threads, I was stitching names onto hoodies for friends. The machine was on the kitchen counter. The thread was tangled. The light was bad.",
      "Now the machine has its own room. The thread is sorted by colour. The light is good. But the love is the same. Every piece is still made one at a time — because the person it's for is one of one, too.",
      "If you've ever opened a gift and known instantly that someone thought of you, that's what we're trying to make.",
    ],
  },
  {
    slug: "how-to-gift-an-heirloom",
    title: "How to gift an heirloom (when you only have a week)",
    excerpt: "Five tiny tricks for making a gift feel like it'll be passed down.",
    cover: occasions,
    minutes: 3,
    date: "February 2026",
    body: [
      "Heirlooms aren't made in factories. They're made in the small choices: the colour you chose because it reminded you of her grandmother, the date you stitched on the inside seam, the song lyric tucked into the cuff.",
      "Trick one: pick something they'll wear, not display. A sweatshirt seen every Sunday is loved more than a frame on a shelf.",
      "Trick two: hide a small detail. A tiny daisy on the inside. An initial on the sleeve. The kind of secret only the wearer knows.",
      "Trick three: include a hand-written note. Even three sentences. The note becomes part of the gift.",
      "Trick four: wrap it like it matters. Tissue, ribbon, a sprig of something green. The unwrapping is half the joy.",
      "Trick five: don't apologise for it being small. The size of a gift has nothing to do with what it means.",
    ],
  },
  {
    slug: "behind-the-bloom",
    title: "Behind the bloom — the spring drop, explained",
    excerpt: "The colours, the flowers, and the playlist behind our newest collection.",
    cover: journal,
    minutes: 5,
    date: "January 2026",
    body: [
      "Every spring I sit with a stack of thread spools and try to remember why I love this. The answer is always the same: the colours. The way rose looks against cream. The way sage softens raspberry. The way a small daisy can change everything.",
      "This year's drop is built around three flowers — the peony, the daisy, and the wild rose. Each one is stitched in a slightly different way, and each one carries a little meaning we hope you'll feel.",
      "The peony is for the grand gestures. The daisy is for the quiet love. The wild rose is for the in-between — the friendships, the long Sundays, the just-because.",
      "If you're curious about the playlist that got stitched into this collection, it's on our Instagram. Mostly Lana, a little Beach House, a lot of soft piano. The kind of music you sew to.",
    ],
  },
];

export function JournalTeaser() {
  return (
    <section className="bg-rose/30 px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-script text-2xl text-bloom">slow read, soft thoughts</span>
            <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
              The <span className="italic text-bloom">journal.</span>
            </h2>
          </div>
          <Link
            to="/journal"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-foreground/60 px-5 py-2.5 text-xs uppercase tracking-[0.22em] hover:border-bloom hover:text-bloom"
          >
            All posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <Link
              key={p.slug}
              to="/journal/$slug"
              params={{ slug: p.slug }}
              className="group block overflow-hidden rounded-3xl bg-background transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{p.date}</span>
                  <span>·</span>
                  <span>{p.minutes} min read</span>
                </div>
                <h3 className="mt-3 font-display text-2xl italic leading-tight group-hover:text-bloom">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
