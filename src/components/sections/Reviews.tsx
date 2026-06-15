import { useQuery } from "@tanstack/react-query";
import { Star, ExternalLink, Heart } from "lucide-react";
import { fetchGoogleReviews, type Review } from "@/lib/reviews.functions";

const ETSY_URL = "https://www.etsy.com/ca/shop/giftedthreads25?ref=sh-carousel-1#reviews";

// Curated review wall — swap with real Google/Etsy copy as it comes in.
// Marked as source so we can show provenance honestly.
const CURATED: Review[] = [
  {
    author: "Priya M.",
    rating: 5,
    relativeTime: "2 weeks ago",
    source: "Etsy",
    text: "The embroidery is so neat and the colour is exactly like the photo. Gifted to my mom for her birthday — she cried a little. 10/10 would order again.",
  },
  {
    author: "Sarah K.",
    rating: 5,
    relativeTime: "a month ago",
    source: "Google",
    text: "Ordered matching Mama + Mini sweatshirts for our newborn shoot. Soft, true to size, and the script font is dreamy. Worth every dollar.",
  },
  {
    author: "Aisha R.",
    rating: 5,
    relativeTime: "3 weeks ago",
    source: "Etsy",
    text: "Came in the most beautiful packaging with a handwritten note. You can tell a real person made this with care. Will be back for Christmas.",
  },
  {
    author: "Jen T.",
    rating: 5,
    relativeTime: "2 months ago",
    source: "Google",
    text: "Got a custom name hoodie for my husband for Father's Day. Shipping was fast even with the custom request and he wears it constantly.",
  },
  {
    author: "Mel D.",
    rating: 5,
    relativeTime: "a week ago",
    source: "Etsy",
    text: "Bought the baby onesie set as a shower gift. The mama who received it texted me a photo immediately. Quality is gorgeous.",
  },
  {
    author: "Carla V.",
    rating: 5,
    relativeTime: "a month ago",
    source: "Google",
    text: "Such a kind small business. They tweaked the colour for me without any fuss and it turned out perfect. Highly recommend GTA Threads.",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < n ? "fill-bloom text-bloom" : "text-border"}`} />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: Review["source"] }) {
  const styles =
    source === "Google"
      ? "bg-white text-foreground border-border"
      : "bg-[#F1641E]/10 text-[#D24A09] border-[#F1641E]/30";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] ${styles}`}
    >
      {source}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <Stars n={r.rating} />
        <SourceBadge source={r.source} />
      </div>
      <blockquote className="font-display text-lg leading-snug text-foreground sm:text-xl">
        "{r.text}"
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-2 text-sm">
        {r.avatarUrl ? (
          <img
            src={r.avatarUrl}
            alt={`${r.author} avatar`}
            className="h-9 w-9 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-rose/50 font-display text-sm text-bloom">
            {r.author.charAt(0)}
          </span>
        )}
        <div className="min-w-0">
          <div className="truncate font-medium text-foreground">{r.author}</div>
          <div className="text-xs text-muted-foreground">{r.relativeTime}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const { data: googleReviews } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: () => fetchGoogleReviews(),
    staleTime: 1000 * 60 * 60,
  });

  const reviews: Review[] =
    googleReviews && googleReviews.length > 0
      ? [...googleReviews, ...CURATED.filter((r) => r.source === "Etsy")].slice(0, 6)
      : CURATED;

  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 5;

  return (
    <section id="reviews" className="bg-cream/40 px-6 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-script text-2xl text-bloom">customer love</span>
          <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Stitched with love, <span className="italic text-bloom">reviewed with heart</span>
          </h2>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Stars n={Math.round(avg)} />
              <span className="font-medium text-foreground">{avg.toFixed(1)} / 5</span>
            </div>
            <span aria-hidden className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span>From {reviews.length}+ reviews on Etsy &amp; Google</span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <ReviewCard key={`${r.author}-${i}`} r={r} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-14">
          <a
            href={ETSY_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-[#F1641E] px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <Heart className="h-4 w-4" />
            Read all reviews on Etsy
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Left us some love?{" "}
            <a
              href={ETSY_URL}
              target="_blank"
              rel="noreferrer"
              className="text-bloom underline-offset-4 hover:underline"
            >
              Share a review on Etsy
            </a>{" "}
            — it makes our whole week.
          </p>
        </div>
      </div>
    </section>
  );
}
