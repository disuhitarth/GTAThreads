import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { POSTS } from "@/components/sections/JournalTeaser";

const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => {
    const p = postBySlug(params.slug);
    const url = `/journal/${params.slug}`;
    if (!p) return { meta: [{ title: "Journal — GTA Threads" }] };
    return {
      meta: [
        { title: `${p.title} — GTA Threads Journal` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:image", content: p.cover },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:image", content: p.cover },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.excerpt,
            image: p.cover,
            datePublished: p.date,
            author: { "@type": "Organization", name: "GTA Threads" },
            publisher: { "@type": "Organization", name: "GTA Threads" },
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    if (!postBySlug(params.slug)) throw notFound();
  },
  component: PostPage,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-5xl italic text-bloom">Post not found.</h1>
        <Link
          to="/journal"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          Back to journal
        </Link>
      </div>
    </div>
  ),
});

function PostPage() {
  const { slug } = Route.useParams();
  const p = postBySlug(slug)!;
  return (
    <article className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[800px]">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-bloom"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to journal
        </Link>
        <p className="mt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {p.date} · {p.minutes} min read
        </p>
        <h1 className="mt-3 font-display text-4xl italic leading-[1.05] tracking-tight sm:text-6xl">
          {p.title}
        </h1>
        <div className="mt-10 aspect-[4/3] overflow-hidden rounded-3xl">
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
        </div>
        <div className="prose-soft mt-10 space-y-6 text-lg leading-relaxed text-foreground/85">
          {p.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="mt-16 border-t border-border pt-8 text-center">
          <p className="font-script text-2xl text-bloom">with love, from the studio</p>
        </div>

        <RelatedPosts currentSlug={slug} />

        <div className="mt-12 rounded-[2rem] bg-cream/50 p-8 text-center">
          <p className="font-script text-2xl text-bloom">ready to gift something stitched?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <PillLink to="/shop">Shop everything</PillLink>
            <PillLink to="/occasions">Shop by occasion</PillLink>
            <PillLink to="/gift-finder">Gift finder</PillLink>
            <PillLink to="/custom-orders">Custom orders</PillLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl italic">Keep reading</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {related.map((r) => (
          <li key={r.slug}>
            <Link
              to="/journal/$slug"
              params={{ slug: r.slug }}
              className="block rounded-2xl border border-border/60 bg-background p-5 hover:border-bloom"
            >
              <p className="font-display text-base italic">{r.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{r.minutes} min read</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PillLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm hover:border-bloom hover:text-bloom"
    >
      {children}
    </Link>
  );
}

