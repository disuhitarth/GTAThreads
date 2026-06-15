import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist – GTA Threads" },
      { name: "description", content: "Your saved favourites at GTA Threads." },
      { property: "og:title", content: "Wishlist – GTA Threads" },
      { name: "twitter:title", content: "Wishlist – GTA Threads" },
    ],
  }),
});

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const removeItem = useWishlistStore((s) => s.removeItem);

  return (
    <section className="bg-background px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="font-display text-5xl italic tracking-tight sm:text-7xl">Wishlist</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Saved for later — tap the heart to revisit.
        </p>

        {items.length === 0 ? (
          <div className="mt-20 grid place-items-center gap-4 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
            <Link
              to="/shop"
              className="rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item.id} className="group">
                <Link
                  to="/product/$handle"
                  params={{ handle: item.handle }}
                  className="relative block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary/60">
                    {item.image ? (
                      <img
                        src={item.image.url}
                        alt={item.image.altText ?? item.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-cream/60">
                        <span className="font-script text-sm text-bloom">stitching soon</span>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      aria-label="Remove from wishlist"
                      className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-background/85 backdrop-blur transition-colors hover:text-red-500"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
                    <h3 className="truncate text-sm font-medium">{item.title}</h3>
                    <span className="shrink-0 font-display text-lg text-bloom">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
