import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/brand/Logo";
import { CategoryIcon } from "@/components/CategoryIcon";
import { SearchOverlay } from "@/components/SearchOverlay";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { OCCASIONS } from "@/lib/occasions";
import { CATEGORIES } from "@/lib/categories";
import { fetchCollections } from "@/lib/shopify";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/category", label: "Categories" },
  { to: "/shop", label: "Collections", hasDropdown: true },
  { to: "/gift-finder", label: "Gift finder" },
  { to: "/custom-orders", label: "Custom" },
  { to: "/journal", label: "Journal" },
];

function getCollectionLink(c: { title: string; handle: string }) {
  const customOccasion = OCCASIONS.find(
    (o) =>
      o.slug === c.handle ||
      c.title.toLowerCase().includes(o.title.toLowerCase()) ||
      o.title.toLowerCase().includes(c.title.toLowerCase()),
  );
  const customCategory = CATEGORIES.find(
    (cat) =>
      cat.slug === c.handle ||
      c.title.toLowerCase().includes(cat.title.toLowerCase()) ||
      cat.title.toLowerCase().includes(c.title.toLowerCase()),
  );

  if (customOccasion) {
    return {
      to: "/occasions/$slug" as const,
      params: { slug: customOccasion.slug },
      iconSlug: customOccasion.slug,
    };
  }
  if (customCategory) {
    return {
      to: "/category/$slug" as const,
      params: { slug: customCategory.slug },
      iconSlug: customCategory.slug,
    };
  }

  return {
    to: "/collections/$handle" as const,
    params: { handle: c.handle },
    iconSlug: c.handle,
  };
}

export function Header() {
  const { data: collections = [] } = useQuery({
    queryKey: ["collections"],
    queryFn: () => fetchCollections(50),
    staleTime: 1000 * 60 * 5,
  });

  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setOpen = useCartStore((s) => s.setOpen);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [occOpen, setOccOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useAuthStore.getState().hydrate();
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-border/60 bg-background/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-2 sm:px-8 sm:py-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link to="/" aria-label="GTA Threads home" className="min-w-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            item.hasDropdown ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setOccOpen(true)}
                onMouseLeave={() => setOccOpen(false)}
              >
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-bloom"
                  activeProps={{ className: "text-bloom" }}
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3" />
                </Link>
                <div
                  className={cn(
                    "absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all",
                    occOpen ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <div className="max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-card p-3 shadow-lg">
                    {collections
                      .filter((c) => c.handle !== "frontpage")
                      .map((c) => {
                        const link = getCollectionLink(c);
                        return (
                          <Link
                            key={c.id}
                            to={link.to}
                            params={link.params}
                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-secondary/60"
                          >
                            <CategoryIcon
                              slug={link.iconSlug}
                              className="h-7 w-7 shrink-0"
                              alt=""
                            />
                            <span>{c.title}</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-bloom"
                activeProps={{ className: "text-bloom" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center justify-end gap-1">
          <button
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-bloom"
          >
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-bloom"
          >
            <Heart className="h-5 w-5" strokeWidth={1.5} />
            {mounted && wishlistCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            to={accessToken ? "/account" : "/login"}
            aria-label="Account"
            className="grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-bloom"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <button
            aria-label="Open cart"
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center text-foreground transition-colors hover:text-bloom"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {mounted && totalItems > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-bloom px-1 text-[10px] font-medium text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="grid h-11 w-11 place-items-center text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-background transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Logo />
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="grid h-11 w-11 place-items-center"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-6 pt-8">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl italic tracking-tight"
            >
              {item.label}
            </Link>
          ))}
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl italic tracking-tight text-bloom"
            >
              Wishlist
            </Link>
            <Link
              to={accessToken ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="font-display text-4xl italic tracking-tight"
            >
              {accessToken ? "Account" : "Sign in"}
            </Link>
          <div className="mt-6 grid grid-cols-2 gap-2 border-t border-border pt-6">
            {collections
              .filter((c) => c.handle !== "frontpage")
              .map((c) => {
                const link = getCollectionLink(c);
                return (
                  <Link
                    key={c.id}
                    to={link.to}
                    params={link.params}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2 text-sm"
                  >
                    <CategoryIcon slug={link.iconSlug} className="h-6 w-6 shrink-0" alt="" />
                    <span>{c.title}</span>
                  </Link>
                );
              })}
          </div>
        </nav>
      </div>
    </header>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
