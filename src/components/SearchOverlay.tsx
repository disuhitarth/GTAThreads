import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Search, X, Loader2 } from "lucide-react";
import { fetchProducts, formatPrice } from "@/lib/shopify";
import { useQuery } from "@tanstack/react-query";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchProducts(8, `title:*${query}* OR tag:*${query}*`),
    enabled: query.length >= 2,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Search products" className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-2xl px-5 pt-20 sm:pt-28">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            aria-label="Search products"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card py-4 pl-13 pr-12 text-lg focus:border-bloom focus:outline-none"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-2xl flex-1 overflow-y-auto px-5 pb-20">
        {query.length < 2 && (
          <p className="text-center text-sm text-muted-foreground">Type at least 2 characters to search.</p>
        )}

        {isFetching && (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-bloom" />
          </div>
        )}

        {data && data.length === 0 && query.length >= 2 && (
          <div className="mt-8 text-center">
            <p className="font-script text-xl text-bloom">nothing in the garden</p>
            <p className="mt-1 text-sm text-muted-foreground">No products found for "{query}".</p>
          </div>
        )}

        {data && data.length > 0 && (
          <div className="mt-4 space-y-2">
            {data.map(({ node: p }) => (
              <Link
                key={p.id}
                to="/product/$handle"
                params={{ handle: p.handle }}
                onClick={onClose}
                className="flex items-center gap-4 rounded-2xl border border-transparent bg-card/40 px-4 py-3 transition-colors hover:border-bloom/30 hover:bg-card"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {p.featuredImage?.url ? (
                    <img src={p.featuredImage.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">—</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(p.priceRange.minVariantPrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
