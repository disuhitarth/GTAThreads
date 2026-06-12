import { Suspense, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { X, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { productsQueryOptions } from "@/components/sections/FeaturedProducts";
import { CATEGORIES } from "@/lib/categories";
import { OCCASIONS } from "@/lib/occasions";
import type { ShopifyProduct } from "@/lib/shopify";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "az";

interface ShopSearch {
  category?: string;
  occasion?: string;
  size?: string;
  color?: string;
  min?: number;
  max?: number;
  sort: Sort;
}

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "az", label: "A–Z" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (raw: Record<string, unknown>): ShopSearch => {
    const sort = (raw.sort as Sort) || "featured";
    return {
      category: typeof raw.category === "string" ? raw.category : undefined,
      occasion: typeof raw.occasion === "string" ? raw.occasion : undefined,
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

function ShopPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev: ShopSearch) => ({ ...prev, ...patch }) });

  const clearAll = () => navigate({ search: { sort: "featured" } as ShopSearch });

  const activeChips: { slug?: string; label: string; clear: () => void }[] = [];
  if (search.category) {
    const c = CATEGORIES.find((x) => x.slug === search.category);
    if (c) activeChips.push({ slug: c.slug, label: c.title, clear: () => update({ category: undefined }) });
  }
  if (search.occasion) {
    const o = OCCASIONS.find((x) => x.slug === search.occasion);
    if (o) activeChips.push({ slug: o.slug, label: o.title, clear: () => update({ occasion: undefined }) });
  }
  if (search.size) activeChips.push({ label: `Size: ${search.size}`, clear: () => update({ size: undefined }) });
  if (search.color) activeChips.push({ label: `Colour: ${search.color}`, clear: () => update({ color: undefined }) });
  if (search.min != null) activeChips.push({ label: `Min $${search.min}`, clear: () => update({ min: undefined }) });
  if (search.max != null) activeChips.push({ label: `Max $${search.max}`, clear: () => update({ max: undefined }) });

  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">the whole garden</span>
          <h1 className="mt-2 font-display text-6xl leading-[1.02] tracking-tight sm:text-8xl">
            Shop the <span className="italic text-bloom">collection.</span>
          </h1>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-bloom" />
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Filters</p>
            </div>

            <FilterGroup title="Category">
              <div className="space-y-1.5">
                {CATEGORIES.map((c) => (
                  <FilterButton
                    key={c.slug}
                    active={search.category === c.slug}
                    onClick={() => update({ category: search.category === c.slug ? undefined : c.slug })}
                  >
                    <CategoryIcon slug={c.slug} className="mr-2 inline-block h-5 w-5 align-middle" alt="" />{c.title}
                  </FilterButton>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Occasion">
              <div className="space-y-1.5">
                {OCCASIONS.map((o) => (
                  <FilterButton
                    key={o.slug}
                    active={search.occasion === o.slug}
                    onClick={() => update({ occasion: search.occasion === o.slug ? undefined : o.slug })}
                  >
                    <CategoryIcon slug={o.slug} className="mr-2 inline-block h-5 w-5 align-middle" alt="" />{o.title}
                  </FilterButton>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Size">
              <div className="flex flex-wrap gap-1.5">
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => update({ size: search.size === s ? undefined : s })}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      search.size === s ? "border-bloom bg-bloom/15 text-bloom" : "border-border hover:border-bloom/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Price">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={search.min ?? ""}
                  onChange={(e) => update({ min: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-bloom"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={search.max ?? ""}
                  onChange={(e) => update({ max: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-bloom"
                />
              </div>
            </FilterGroup>

            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs uppercase tracking-[0.22em] text-bloom underline-offset-4 hover:underline">
                Clear all filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {activeChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 rounded-full bg-bloom/15 px-3 py-1.5 text-xs text-bloom"
                  >
                    {chip.slug && <CategoryIcon slug={chip.slug} className="h-4 w-4" alt="" />}
                    {chip.label} <X className="h-3 w-3" />
                  </button>
                ))}
                {activeChips.length === 0 && (
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">All pieces</p>
                )}
              </div>
              <select
                value={search.sort}
                onChange={(e) => update({ sort: e.target.value as Sort })}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.22em] outline-none hover:border-bloom"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>Sort: {s.label}</option>
                ))}
              </select>
            </div>

            <Suspense fallback={<div className="mt-16 h-[40vh]" />}>
              <FilteredGrid search={search} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilteredGrid({ search }: { search: ShopSearch }) {
  const { data: products } = useSuspenseQuery(productsQueryOptions(60));

  const filtered = useMemo(() => {
    const cat = search.category ? CATEGORIES.find((c) => c.slug === search.category) : null;
    const occ = search.occasion ? OCCASIONS.find((o) => o.slug === search.occasion) : null;

    const matches = (p: ShopifyProduct) => {
      const haystack = [
        p.node.title.toLowerCase(),
        p.node.description.toLowerCase(),
        ...p.node.options.flatMap((o) => o.values.map((v) => v.toLowerCase())),
      ].join(" ");

      if (cat?.query) {
        const keywords = extractKeywords(cat.query);
        if (!keywords.some((k) => haystack.includes(k))) return false;
      }
      if (occ?.query) {
        const keywords = extractKeywords(occ.query);
        if (!keywords.some((k) => haystack.includes(k))) return false;
      }
      if (search.size) {
        const sizeOpt = p.node.options.find((o) => o.name.toLowerCase().includes("size"));
        if (sizeOpt && !sizeOpt.values.some((v) => v.toLowerCase() === search.size!.toLowerCase())) {
          return false;
        }
      }
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      if (search.min != null && price < search.min) return false;
      if (search.max != null && price > search.max) return false;
      return true;
    };

    const arr = products.filter(matches);
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
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{filtered.length} pieces</p>
      <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
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

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-xl px-3 py-1.5 text-left text-sm transition-colors ${
        active ? "bg-bloom/15 text-bloom" : "hover:bg-secondary/60"
      }`}
    >
      {children}
    </button>
  );
}
