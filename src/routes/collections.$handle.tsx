import { Suspense } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchCollectionByHandle } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

const collectionQueryOptions = (handle: string) => ({
  queryKey: ["collection", handle],
  queryFn: async () => {
    const c = await fetchCollectionByHandle(handle);
    if (!c) throw notFound();
    return c;
  },
  staleTime: 1000 * 60 * 5,
});

export const Route = createFileRoute("/collections/$handle")({
  loader: async ({ context, params }) => {
    const collection = await context.queryClient
      .ensureQueryData(collectionQueryOptions(params.handle))
      .catch(() => null);
    return { collection };
  },
  head: ({ params, loaderData }) => {
    const c = loaderData?.collection;
    const url = `/collections/${params.handle}`;
    if (!c) {
      const title = decodeURIComponent(params.handle).replace(/-/g, " ");
      return {
        meta: [
          { title: `${title} — GTA Threads` },
          { name: "description", content: "Hand-embroidered apparel by GTA Threads." },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const desc = c.description || `Browse the ${c.title} collection at GTA Threads.`;
    return {
      meta: [
        { title: `${c.title} — GTA Threads` },
        { name: "description", content: desc },
        { property: "og:title", content: `${c.title} — GTA Threads` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: CollectionPage,
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
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-5xl italic text-bloom">Not in the garden.</h1>
        <p className="mt-2 text-sm text-muted-foreground">This collection doesn't exist.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
        >
          See all products
        </Link>
      </div>
    </div>
  ),
});

function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-bloom" />
        </div>
      }
    >
      <CollectionInner />
    </Suspense>
  );
}

function CollectionInner() {
  const { handle } = Route.useParams();
  const { data: collection } = useSuspenseQuery(collectionQueryOptions(handle));

  const products = collection.products?.edges ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-rose/10 via-background to-background px-6 pb-20 pt-32 sm:px-8 sm:pt-40">
        <div className="relative mx-auto max-w-[1100px]">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-bloom"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
          <span className="mt-6 block font-script text-2xl text-bloom">Collection</span>
          <h1 className="mt-2 max-w-3xl font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-6 max-w-xl text-lg text-foreground/80">{collection.description}</p>
          )}
        </div>
      </section>

      <section className="bg-background px-6 pb-24 sm:px-8 py-10">
        <div className="mx-auto max-w-[1500px]">
          {products.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-card/60 py-24 text-center">
              <p className="font-script text-2xl text-bloom">nothing here yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                No products found in this collection.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
