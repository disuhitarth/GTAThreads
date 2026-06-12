import { Star } from "lucide-react";

export function CustomerLove() {
  return (
    <section className="bg-background px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-[1100px] text-center">
        <span className="font-script text-2xl text-bloom">customer love</span>
        <h2 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
          Reviews, <span className="italic text-bloom">soon.</span>
        </h2>
        <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-border bg-card/60 p-10">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-border" />
            ))}
          </div>
          <p className="mt-5 text-base text-muted-foreground">
            No reviews yet — be the first to leave one. Tag us
            <a
              href="https://www.instagram.com/gta_threads/"
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-bloom underline-offset-4 hover:underline"
            >
              @gta_threads
            </a>{" "}
            with your piece and we'll feature it here.
          </p>
        </div>
      </div>
    </section>
  );
}
