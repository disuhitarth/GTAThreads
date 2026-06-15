import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { WaveDivider } from "@/components/WaveDivider";
import { OCCASIONS } from "@/lib/occasions";

export function Footer() {
  return (
    <footer className="relative bg-secondary/60 text-foreground">
      <WaveDivider className="block h-12 w-full text-background" />
      <div className="mx-auto max-w-[1600px] px-6 pb-14 pt-4 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              A tiny embroidery studio in the Greater Toronto Area, stitching one piece at a time —
              gifts that feel like a love letter you can wear.
            </p>
          </div>
          <FooterCol
            title="Shop"
            links={[
              { to: "/shop", label: "All products" },
              { to: "/category", label: "By category" },
              { to: "/occasions", label: "By occasion" },
              { to: "/gift-finder", label: "Gift finder" },
              { to: "/custom-orders", label: "Custom orders" },
            ]}
          />
          <FooterCol
            title="Help"
            links={[
              { to: "/size-guide", label: "Size guide" },
              { to: "/care", label: "Care instructions" },
              { to: "/shipping-returns", label: "Shipping & returns" },
              { to: "/about", label: "About us" },
              { to: "/lookbook", label: "Lookbook" },
            ]}
          />
          <div>
            <h4 className="font-script text-xl text-bloom">For every day</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {OCCASIONS.slice(0, 5).map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/occasions/$slug"
                    params={{ slug: o.slug }}
                    className="hover:text-bloom"
                  >
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-script text-xl text-bloom">Follow</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/gta_threads/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bloom"
                >
                  @gta_threads
                </a>
              </li>
              <li>
                <a
                  href="https://www.etsy.com/ca/shop/giftedthreads25"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bloom"
                >
                  Etsy shop
                </a>
              </li>
              <li>
                <Link to="/journal" className="hover:text-bloom">
                  Journal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} GTA Threads · Stitched with love in Toronto.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-bloom">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-bloom">
              Terms
            </Link>
            <span className="font-script text-base text-bloom">made for the girls</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-script text-xl text-bloom">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="hover:text-bloom">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
