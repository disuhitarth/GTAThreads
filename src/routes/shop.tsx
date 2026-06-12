import { Suspense, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { X, SlidersHorizontal, Check, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { productsQueryOptions } from "@/components/sections/FeaturedProducts";
import { CATEGORIES } from "@/lib/categories";
import { OCCASIONS } from "@/lib/occasions";
import { fetchCollections, formatPrice } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "az";

interface ShopSearch {
  collection?: string;
  size?: string;
  color?: string;
  min?: number;
  max?: number;
  sort: Sort;
}

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "az", label: "A–Z" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (raw: Record<string, unknown>): ShopSearch => {
    const sort = (raw.sort as Sort) || "featured";
    
    // Resolve legacy category/occasion parameters to collection
    let collection = typeof raw.collection === "string" ? raw.collection : undefined;
    if (!collection) {
      if (typeof raw.category === "string") {
        collection = raw.category;
      } else if (typeof raw.occasion === "string") {
        collection = raw.occasion;
      }
    }

    return {
      collection,
      size: typeof raw.size === "string" ? raw.size : undefined,
      color: typeof raw.color === "string" ? raw.color : undefined,
      min: typeof raw.min === "string" ? parseFloat(raw.min) : typeof raw.min === "number" ? raw.min : undefined,
      max: typeof raw.max === "string" ? parseFloat(raw.max) : typeof raw.max === "number" ? raw.max : undefined,
      sort: SORTS.find((s) => s.value === sort)?.value ?? "featured",
    };
  },
  head: () => ({
    meta: [
      { title: "Shop — GTA Threads" },
      { name: "description", content: "Filter the full collection of hand-embroidered tees, hoodies, hats, accessories, and gifts. Stitched in Toronto." },
      { property: "og:title", content: "Shop — GTA Threads" },
      { property: "og:description", content: "Embroidered sweatshirts, tees, totes and baby pieces from Toronto." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQueryOptions(60));
  },
  component: ShopPage,
});

interface DropdownProps {
  label: string;
  activeLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
  alignRight?: boolean;
  children: React.ReactNode;
}

function Dropdown({ label, activeLabel, isOpen, onToggle, alignRight = false, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between gap-2 rounded-full border px-5 py-2.5 text-xs uppercase tracking-[0.22em] transition-all cursor-pointer select-none ${
          activeLabel
            ? "border-bloom bg-bloom/10 text-bloom font-semibold"
            : "border-border bg-background text-foreground hover:border-bloom/60 hover:text-bloom"
        }`}
      >
        <span>{activeLabel ? `${label}: ${activeLabel}` : label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div
          className={`absolute ${
            alignRight ? "right-0 left-auto" : "left-0 right-auto"
          } top-full mt-2 w-64 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-3 shadow-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [openDropdown, setOpenDropdown] = useState<"collection" | "size" | "price" | "sort" | null>(null);

  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(50),
    staleTime: 1000 * 60 * 5,
  });

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const clearAll = () => {
    navigate({ search: { sort: "featured" } as ShopSearch });
    setOpenDropdown(null);
  };

  // Find active labels for dropdown highlights
  const activeCollection = collections.find((c) => c.handle === search.collection);
  const activeCollectionLabel = activeCollection
    ? activeCollection.title
    : (CATEGORIES.find((c) => c.slug === search.collection)?.title ||
       OCCASIONS.find((o) => o.slug === search.collection)?.title ||
       search.collection);

  const activeChips: { label: string; clear: () => void }[] = [];
  if (search.collection) {
    activeChips.push({
      label: activeCollectionLabel ?? search.collection,
      clear: () => update({ collection: undefined }),
    });
  }
  if (search.size) {
    activeChips.push({ label: `Size: ${search.size}`, clear: () => update({ size: undefined }) });
  }
  if (search.min != null || search.max != null) {
    let priceLabel = "";
    if (search.min != null && search.max != null) {
      priceLabel = `$${search.min} - $${search.max}`;
    } else if (search.min != null) {
      priceLabel = `Over $${search.min}`;
    } else if (search.max != null) {
      priceLabel = `Under $${search.max}`;
    }
    activeChips.push({
      label: priceLabel,
      clear: () => update({ min: undefined, max: undefined }),
    });
  }

  // Page title dynamically updates based on the selected collection
  const pageTitle = activeCollectionLabel ? (
    <>Shop the <span className="italic text-bloom">{activeCollectionLabel}</span> collection.</>
  ) : (
    <>Shop the <span className="italic text-bloom">collection.</span></>
  );

  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Background click overlay to close dropdowns */}
      {openDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
      )}

      <div className="mx-auto max-w-[1600px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">the whole garden</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            {pageTitle}
          </h1>
        </div>

        {/* Horizontal Filters Bar */}
        <div className="mt-12 flex flex-col gap-4 border-y border-border/60 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 mr-2">
                <SlidersHorizontal className="h-4 w-4 text-bloom" />
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground hidden sm:block">Filters</p>
              </div>

              {/* Collections Dropdown */}
              <Dropdown
                label="Collection"
                activeLabel={activeCollectionLabel}
                isOpen={openDropdown === "collection"}
                onToggle={() => setOpenDropdown(openDropdown === "collection" ? null : "collection")}
              >
                <div className="max-h-64 overflow-y-auto space-y-0.5 p-1">
                  <button
                    onClick={() => {
                      update({ collection: undefined });
                      setOpenDropdown(null);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                  >
                    <span>All Collections</span>
                    {!search.collection && <Check className="h-4 w-4 text-bloom" />}
                  </button>
                  {collections
                    .filter((c) => c.handle !== "frontpage")
                    .map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          update({ collection: c.handle });
                          setOpenDropdown(null);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <CategoryIcon slug={c.handle} className="h-5 w-5 shrink-0" alt="" />
                          {c.title}
                        </span>
                        {search.collection === c.handle && <Check className="h-4 w-4 text-bloom" />}
                      </button>
                    ))}
                </div>
              </Dropdown>

              {/* Sizes Dropdown */}
              <Dropdown
                label="Size"
                activeLabel={search.size}
                isOpen={openDropdown === "size"}
                onToggle={() => setOpenDropdown(openDropdown === "size" ? null : "size")}
              >
                <div className="space-y-0.5 p-1">
                  <button
                    onClick={() => {
                      update({ size: undefined });
                      setOpenDropdown(null);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                  >
                    <span>All Sizes</span>
                    {!search.size && <Check className="h-4 w-4 text-bloom" />}
                  </button>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        update({ size: s });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>{s}</span>
                      {search.size === s && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                  ))}
                </div>
              </Dropdown>

              {/* Price Dropdown */}
              <Dropdown
                label="Price"
                activeLabel={
                  search.min != null || search.max != null
                    ? search.min != null && search.max != null
                      ? `$${search.min} - $${search.max}`
                      : search.min != null
                      ? `Over $${search.min}`
                      : `Under $${search.max}`
                    : undefined
                }
                isOpen={openDropdown === "price"}
                onToggle={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
              >
                <div className="space-y-3 p-1">
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        update({ min: undefined, max: undefined });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>All Prices</span>
                      {search.min == null && search.max == null && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                    <button
                      onClick={() => {
                        update({ min: undefined, max: 50 });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>Under $50</span>
                      {search.min == null && search.max === 50 && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                    <button
                      onClick={() => {
                        update({ min: 50, max: 100 });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>$50 to $100</span>
                      {search.min === 50 && search.max === 100 && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                    <button
                      onClick={() => {
                        update({ min: 100, max: undefined });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>Over $100</span>
                      {search.min === 100 && search.max == null && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                  </div>

                  <div className="border-t border-border/60 pt-2.5">
                    <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Custom Range</p>
                    <div className="flex items-center gap-2 px-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={search.min ?? ""}
                          onChange={(e) => update({ min: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full rounded-lg border border-border bg-background py-1.5 pl-6 pr-2 text-xs outline-none focus:border-bloom"
                        />
                      </div>
                      <span className="text-muted-foreground text-xs">—</span>
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={search.max ?? ""}
                          onChange={(e) => update({ max: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className="w-full rounded-lg border border-border bg-background py-1.5 pl-6 pr-2 text-xs outline-none focus:border-bloom"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dropdown>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Dropdown
                label="Sort By"
                activeLabel={SORTS.find((s) => s.value === search.sort)?.label}
                isOpen={openDropdown === "sort"}
                onToggle={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                alignRight
              >
                <div className="space-y-0.5 p-1">
                  {SORTS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => {
                        update({ sort: s.value });
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <span>{s.label}</span>
                      {search.sort === s.value && <Check className="h-4 w-4 text-bloom" />}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>
          </div>

          {/* Active Chips & Clear All */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 mt-2">
              {activeChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-bloom/10 px-3.5 py-1.5 text-xs font-semibold text-bloom hover:bg-bloom/15 transition-colors cursor-pointer"
                >
                  {chip.label} <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="text-xs uppercase tracking-[0.22em] text-bloom font-semibold ml-2 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Product Grid Area */}
        <div className="mt-8">
          <Suspense fallback={
            <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 lg:grid-cols-4 mt-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] rounded-3xl bg-secondary" />
                  <div className="h-4 w-2/3 rounded bg-secondary" />
                  <div className="h-4 w-1/3 rounded bg-secondary" />
                </div>
              ))}
            </div>
          }>
            <FilteredGrid search={search} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

function FilteredGrid({ search }: { search: ShopSearch }) {
  const { data: products } = useSuspenseQuery(productsQueryOptions(60));

  const filtered = useMemo(() => {
    const matches = (p: ShopifyProduct) => {
      // 1. Collection Filter (with dynamic collections & static categories/occasions fallback)
      if (search.collection) {
        const belongsToCollection = p.node.collections?.edges.some(
          (edge) => edge.node.handle === search.collection
        );
        
        if (!belongsToCollection) {
          // Backward compatibility check for legacy categories/occasions
          const cat = CATEGORIES.find((c) => c.slug === search.collection);
          const occ = OCCASIONS.find((o) => o.slug === search.collection);
          const legacyQuery = cat?.query || occ?.query;
          
          if (legacyQuery) {
            const haystack = [
              p.node.title.toLowerCase(),
              p.node.description.toLowerCase(),
              ...p.node.options.flatMap((o) => o.values.map((v) => v.toLowerCase())),
            ].join(" ");
            
            const keywords = extractKeywords(legacyQuery);
            if (!keywords.some((k) => haystack.includes(k))) return false;
          } else {
            return false;
          }
        }
      }

      // 2. Size Filter
      if (search.size) {
        const sizeOpt = p.node.options.find((o) => o.name.toLowerCase().includes("size"));
        if (sizeOpt && !sizeOpt.values.some((v) => v.toLowerCase() === search.size!.toLowerCase())) {
          return false;
        }
      }

      // 3. Price Filter
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      if (search.min != null && price < search.min) return false;
      if (search.max != null && price > search.max) return false;
      
      return true;
    };

    const arr = products.filter(matches);
    
    // Sorting logic
    switch (search.sort) {
      case "price-asc":
        arr.sort((a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount));
        break;
      case "price-desc":
        arr.sort((a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount));
        break;
      case "az":
        arr.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "newest":
        arr.reverse(); // Shopify default order is newest-last; reverse to newest-first.
        break;
    }
    return arr;
  }, [products, search]);

  if (!filtered.length) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/60 py-24 text-center">
        <p className="font-script text-2xl text-bloom">no matches in the garden</p>
        <p className="mt-2 text-sm text-muted-foreground">Try removing a filter or browsing everything.</p>
        <Link to="/shop" search={{ sort: "featured" }} className="mt-6 inline-block rounded-full bg-foreground px-6 py-2 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">{filtered.length} pieces</p>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p, i) => (
          <ProductCard key={p.node.id} product={p} priority={i < 4} />
        ))}
      </div>
    </>
  );
}

function extractKeywords(shopifyQuery: string): string[] {
  // turn "tag:baby OR title:onesie" → ["baby", "onesie"]
  return shopifyQuery
    .split(/\s+OR\s+/i)
    .map((part) => part.split(":").pop()!.trim().toLowerCase())
    .filter(Boolean);
}
