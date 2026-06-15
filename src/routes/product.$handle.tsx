import { useState, Suspense } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { PriceDisplay } from "@/components/PriceDisplay";
import { cn } from "@/lib/utils";

const productQueryOptions = (handle: string) => ({
  queryKey: ["product", handle],
  queryFn: async () => {
    const p = await fetchProductByHandle(handle);
    if (!p) throw notFound();
    return p;
  },
  staleTime: 1000 * 60 * 5,
});

import { SITE_URL } from "@/lib/env";
const SITE = SITE_URL;

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient
      .ensureQueryData(productQueryOptions(params.handle))
      .catch(() => null);
    return { product };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.product;
    const url = `/product/${params.handle}`;
    if (!p) {
      const title = decodeURIComponent(params.handle).replace(/-/g, " ");
      return {
        meta: [
          { title: `${title} — GTA Threads` },
          { name: "description", content: "Hand-embroidered apparel by GTA Threads." },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const image = p.images.edges[0]?.node.url;
    const desc =
      (p.description || "").slice(0, 155).trim() ||
      `${p.title} — hand-embroidered in Toronto by GTA Threads.`;
    const price = p.priceRange.minVariantPrice;
    return {
      meta: [
        { title: `${p.title} — GTA Threads` },
        { name: "description", content: desc },
        { property: "og:title", content: `${p.title} — GTA Threads` },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        ...(image ? [{ name: "twitter:image", content: image }] : []),
        { property: "product:price:amount", content: price.amount },
        { property: "product:price:currency", content: price.currencyCode },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: p.description,
            image: p.images.edges.map((i) => i.node.url),
            brand: { "@type": "Brand", name: "GTA Threads" },
            offers: {
              "@type": "Offer",
              price: price.amount,
              priceCurrency: price.currencyCode,
              availability: p.variants.edges.some((v) => v.node.availableForSale)
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `${SITE}${url}`,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
              { "@type": "ListItem", position: 2, name: "Shop", item: SITE + "/shop" },
              { "@type": "ListItem", position: 3, name: p.title, item: SITE + url },
            ],
          }),
        },
      ],
    };
  },
  component: ProductPage,
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
        <h2 className="font-display text-5xl italic">Not in this drop.</h2>
        <Link
          to="/shop"
          className="mt-6 inline-block border-b border-foreground pb-1 text-xs uppercase tracking-[0.3em] hover:text-accent hover:border-accent"
        >
          Back to shop
        </Link>
      </div>
    </div>
  ),
});

function ProductPageSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1500px] gap-10 px-6 pb-24 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-2">
      <div className="aspect-[4/5] animate-pulse rounded-3xl bg-secondary" />
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-3/4 rounded bg-secondary" />
        <div className="h-6 w-1/4 rounded bg-secondary" />
        <div className="h-4 w-full rounded bg-secondary" />
        <div className="h-4 w-5/6 rounded bg-secondary" />
        <div className="h-12 w-full rounded-full bg-secondary" />
        <div className="h-12 w-1/3 rounded-full bg-secondary" />
      </div>
    </div>
  );
}

function ProductPage() {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductInner />
    </Suspense>
  );
}

function ProductInner() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));

  const [selected, setSelected] = useState(
    product.variants.edges.find((v) => v.node.availableForSale)?.node ??
      product.variants.edges[0]?.node,
  );
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const onAdd = async () => {
    if (!selected) return;
    await addItem({
      product: { node: product },
      variantId: selected.id,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      selectedOptions: selected.selectedOptions ?? [],
    });
  };

  const toggleWish = useWishlistStore((s) => s.toggle);
  const isFavorited = useWishlistStore((s) => s.isFavorited(product.id));
  const onFav = () => {
    const primary = product.images.edges[0]?.node;
    toggleWish({
      id: product.id,
      handle: product.handle,
      title: product.title,
      price: product.priceRange.minVariantPrice,
      image: primary ? { url: primary.url, altText: primary.altText ?? undefined } : undefined,
    });
  };

  const images = product.images.edges;

  return (
    <section className="bg-background px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[1500px]">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
              {images[activeImage]?.node && (
                <img
                  src={images[activeImage].node.url}
                  alt={images[activeImage].node.altText ?? product.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative aspect-square overflow-hidden bg-secondary/40 transition-opacity",
                      i === activeImage ? "ring-1 ring-foreground" : "opacity-70 hover:opacity-100",
                    )}
                  >
                    <img
                      src={img.node.url}
                      alt={`${product.title} — view ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-display text-4xl italic leading-tight tracking-tight sm:text-6xl">
              {product.title}
            </h1>
            <p className="mt-4 font-display text-2xl">
              <PriceDisplay amount={product.priceRange.minVariantPrice.amount} currency={product.priceRange.minVariantPrice.currencyCode} />
            </p>

            {product.description && (
              <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {product.description}
              </p>
            )}

            {product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="mt-8 space-y-6">
                {product.options.map((opt) => (
                  <div key={opt.name}>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {opt.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {selected?.selectedOptions.find((o) => o.name === opt.name)?.value}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opt.values.map((val) => {
                        const variant = product.variants.edges.find((v) =>
                          v.node.selectedOptions.every((o) =>
                            o.name === opt.name
                              ? o.value === val
                              : o.value ===
                                selected?.selectedOptions.find((s) => s.name === o.name)?.value,
                          ),
                        )?.node;
                        const active =
                          selected?.selectedOptions.find((o) => o.name === opt.name)?.value === val;
                        return (
                          <button
                            key={val}
                            onClick={() => variant && setSelected(variant)}
                            disabled={!variant?.availableForSale}
                            className={cn(
                              "min-w-12 border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors",
                              active
                                ? "border-foreground bg-foreground text-background"
                                : "border-border hover:border-foreground",
                              !variant?.availableForSale && "opacity-40 line-through",
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex items-center gap-3">
              <button
                onClick={onAdd}
                disabled={isLoading || !selected?.availableForSale}
                className="flex-1 inline-flex h-14 items-center justify-center bg-foreground text-sm uppercase tracking-[0.22em] text-background transition-colors hover:bg-accent disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : selected?.availableForSale ? (
                  "Add to bag"
                ) : (
                  "Sold out"
                )}
              </button>
              <button
                onClick={onFav}
                aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                className="grid h-14 w-14 shrink-0 place-items-center border border-border transition-colors hover:border-bloom hover:text-bloom"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    isFavorited && "fill-bloom text-bloom scale-110",
                  )}
                />
              </button>
            </div>

            <ul className="mt-8 space-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <li>· Embroidered to order in the GTA</li>
              <li>· Worldwide shipping</li>
              <li>· No reviews yet</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
