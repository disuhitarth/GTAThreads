import { createFileRoute, Link } from "@tanstack/react-router";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — GTA Threads" },
      {
        name: "description",
        content:
          "GTA Threads is a one-woman embroidery studio in the Greater Toronto Area, stitching gifts one piece at a time.",
      },
      { property: "og:title", content: "About — GTA Threads" },
      {
        property: "og:description",
        content: "A small Toronto embroidery studio stitching gifts with love.",
      },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: aboutImg },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <span className="font-script text-2xl text-bloom">a little about us</span>
          <h1 className="mt-2 font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            Threads of <span className="italic text-bloom">love.</span>
          </h1>
          <div className="mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary/40">
            <img
              src={aboutImg}
              alt="Hands embroidering pink roses onto cream linen"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground lg:pt-32">
          <p>
            GTA Threads started in a small room in the Greater Toronto Area, with one embroidery
            machine and a habit of writing names on hoodies for friends.
          </p>
          <p>
            What began as gifts turned into a quiet little studio — custom-stitched sweatshirts for
            new mums, grandmas, brides, dads, anime girls, and anyone with someone specific in mind.
          </p>
          <p>
            Every order is made one at a time. Nothing sits in a warehouse, nothing is printed.
            Every letter, every flower, every name is stitched into the fabric so it lasts.
          </p>
          <p>
            We ship from Toronto to anywhere a thread can reach. If you have an idea, send a message
            on{" "}
            <a
              href="https://www.instagram.com/gta_threads/"
              target="_blank"
              rel="noreferrer"
              className="text-bloom underline-offset-4 hover:underline"
            >
              @gta_threads
            </a>
            .
          </p>
          <div className="pt-6">
            <Link
              to="/shop"
              className="inline-block rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
