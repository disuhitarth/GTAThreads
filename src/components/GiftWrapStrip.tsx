import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function GiftWrapStrip() {
  return (
    <section className="bg-background px-6 py-16 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1300px] items-center gap-10 rounded-[2.5rem] bg-gradient-to-br from-rose/30 via-cream to-sage/20 p-10 sm:p-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="font-script text-2xl text-bloom">included with every order</span>
          <h2 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            A gift, <span className="italic text-bloom">already wrapped.</span>
          </h2>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Tissue paper, a satin ribbon, a kraft gift box and a handwritten note in your words.
            Tuck a piece of yourself into every send — at no extra cost, ever.
          </p>
          <Link
            to="/custom-orders"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Order something custom
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="grid gap-3 text-sm text-foreground/80">
          <li className="rounded-2xl bg-background/70 p-5">
            <p className="font-display text-xl italic text-bloom">01 — handwritten note</p>
            <p className="mt-1 text-muted-foreground">
              Up to 250 characters in your words, in real ink on a kraft card.
            </p>
          </li>
          <li className="rounded-2xl bg-background/70 p-5">
            <p className="font-display text-xl italic text-bloom">02 — petal wrap</p>
            <p className="mt-1 text-muted-foreground">
              Tissue paper, a dried flower, a satin ribbon, sealed with our stamp.
            </p>
          </li>
          <li className="rounded-2xl bg-background/70 p-5">
            <p className="font-display text-xl italic text-bloom">03 — direct-ship option</p>
            <p className="mt-1 text-muted-foreground">
              Send straight to the recipient with no prices on the slip.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
