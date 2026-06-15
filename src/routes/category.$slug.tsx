import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CategoryTemplate } from "@/components/CategoryTemplate";
import { categoryBySlug } from "@/lib/categories";
import { productsQueryOptions } from "@/components/sections/FeaturedProducts";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const c = categoryBySlug(params.slug);
    if (!c) return { meta: [{ title: "Category — GTA Threads" }] };
    return {
      meta: [
        { title: `${c.title} — GTA Threads` },
        { name: "description", content: `${c.blurb} Hand-embroidered in Toronto.` },
        { property: "og:title", content: `${c.title} — GTA Threads` },
        { property: "og:description", content: c.blurb },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Category", item: "/category" },
              { "@type": "ListItem", position: 3, name: c.title, item: `/category/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  loader: ({ params, context }) => {
    const c = categoryBySlug(params.slug);
    if (!c) throw notFound();
    context.queryClient.ensureQueryData(productsQueryOptions(16, c.query));
    context.queryClient.ensureQueryData(productsQueryOptions(16));
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-5xl italic text-bloom">Not in the garden.</h1>
        <Link
          to="/category"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          See all categories
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-3xl italic">A loose thread.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          Retry
        </button>
      </div>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const c = categoryBySlug(slug)!;
  return <CategoryTemplate category={c} />;
}
