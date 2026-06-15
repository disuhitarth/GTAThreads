import { Link } from "@tanstack/react-router";
import { Heart, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { PRODUCT_PLACEHOLDER } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ShopifyProduct;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const node = product.node;
  const primary = node.images.edges[0]?.node;
  const secondary = node.images.edges[1]?.node ?? primary;
  const variant = node.variants.edges.find((v) => v.node.availableForSale)?.node;
  const price = node.priceRange.minVariantPrice;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [favorited, setFavorited] = useState(false);

  const onQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited((v) => !v);
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: node.handle }}
      className={cn("group block", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-secondary/60">
        {primary ? (
          <>
            <img
              src={primary.url}
              alt={primary.altText ?? node.title}
              loading={priority ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
            />
            <img
              src={secondary.url}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-cream/60">
            <img
              src={PRODUCT_PLACEHOLDER}
              alt={node.title}
              loading="lazy"
              className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 font-script text-sm text-bloom">
              stitching soon
            </span>
          </div>
        )}

        <button
          onClick={onFav}
          aria-label="Favourite"
          className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur transition-colors hover:text-bloom"
        >
          <Heart
            className={cn("h-4 w-4 transition-all", favorited && "fill-bloom text-bloom scale-110")}
          />
        </button>

        {variant && (
          <button
            onClick={onQuickAdd}
            aria-label={`Add ${node.title} to bag`}
            className="absolute inset-x-3 bottom-3 inline-flex h-10 translate-y-0 items-center justify-center gap-2 rounded-full bg-foreground text-xs uppercase tracking-[0.18em] text-background opacity-100 transition-all duration-300 hover:bg-bloom md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add to basket
              </>
            )}
          </button>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
        <h3 className="truncate text-sm font-medium">{node.title}</h3>
        <span className="shrink-0 font-display text-lg text-bloom">
          {formatPrice(price.amount, price.currencyCode)}
        </span>
      </div>
    </Link>
  );
}
