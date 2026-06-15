export interface Category {
  slug: string;
  title: string;
  tagline: string;
  emoji: string;
  query?: string;
  blurb: string;
  paragraphs: string[];
  tint: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "tees",
    title: "Tees",
    tagline: "soft cottons, gentle stitches",
    emoji: "👕",
    query: "product_type:Tee OR tag:tee OR title:tee OR title:t-shirt",
    blurb:
      "Featherweight cotton tees with hand-embroidered details — the kind you reach for first.",
    paragraphs: [
      "We start with breathable 100% cotton, pre-washed for that broken-in feel, then add embroidery thread by thread. No iron-ons, no transfers — just real stitches that soften with every wash.",
      "Pick a colour, send us your words, and we'll stitch it onto a tee they'll wear until it falls apart (and then ask for another).",
    ],
    tint: "from-rose/30 via-background to-background",
  },
  {
    slug: "hoodies",
    title: "Hoodies & sweatshirts",
    tagline: "heavyweight, hug-like",
    emoji: "🧥",
    query:
      "product_type:Hoodie OR product_type:Sweatshirt OR tag:hoodie OR title:hoodie OR title:sweatshirt OR title:crewneck",
    blurb: "Heavyweight crewnecks and pullovers — the gift they'll live in.",
    paragraphs: [
      "Our hoodies are made from 400gsm brushed-cotton fleece — the kind that holds a hug. Roomy fit, ribbed cuffs, embroidered chest or sleeve detail.",
      "Available in cream, sage, oat, and the prettiest blush you've ever seen.",
    ],
    tint: "from-sage/30 via-background to-cream",
  },
  {
    slug: "headwear",
    title: "Headwear",
    tagline: "caps, beanies, bucket hats",
    emoji: "🧢",
    query: "product_type:Hat OR tag:hat OR title:cap OR title:hat OR title:beanie OR title:bucket",
    blurb: "A little something for the top of their head.",
    paragraphs: [
      "Dad-caps with embroidered initials, soft beanies for cold mornings, and bucket hats for slow Saturdays in the park.",
    ],
    tint: "from-cream via-background to-rose/20",
  },
  {
    slug: "accessories",
    title: "Accessories",
    tagline: "totes, socks, and tiny extras",
    emoji: "🧺",
    query:
      "product_type:Accessory OR product_type:Tote OR tag:accessory OR title:tote OR title:bag OR title:mug OR title:sock",
    blurb:
      "Embroidered totes for the farmer's market and little extras that make a gift feel finished.",
    paragraphs: [
      "Heavy canvas totes, ribbed crew socks with a tiny daisy on the ankle, ceramic mugs and stickers. Perfect for stuffing a gift box.",
    ],
    tint: "from-rose/20 via-background to-sage/20",
  },
  {
    slug: "kids-baby",
    title: "Kids & baby",
    tagline: "for the tiniest humans",
    emoji: "🍼",
    query: "tag:baby OR tag:kids OR title:baby OR title:onesie OR title:toddler OR title:kids",
    blurb: "Onesies, mini hoodies and toddler tees — the gift new parents actually want.",
    paragraphs: [
      "Soft cottons sized 0–6 years, stitched with names, birth dates and tiny illustrations. Snaps where they should be, no scratchy tags, ever.",
      "Free gift wrap on every baby order.",
    ],
    tint: "from-cream via-background to-rose/30",
  },
  {
    slug: "matching-sets",
    title: "Matching sets",
    tagline: "for couples, families, mommy-and-me",
    emoji: "💞",
    query: "tag:matching OR tag:set OR title:matching OR title:set OR title:couple OR title:family",
    blurb: "Twinning pieces for the people who love being seen together.",
    paragraphs: [
      "Couples sweatshirts, mommy-and-me tees, family-photo hoodies in coordinated palettes. Mix and match sizes from 0 to XXL.",
    ],
    tint: "from-rose/30 via-background to-sage/30",
  },
  {
    slug: "new-arrivals",
    title: "New arrivals",
    tagline: "fresh off the embroidery hoop",
    emoji: "✨",
    blurb: "Just stitched, just listed. The latest pieces in the studio.",
    paragraphs: [
      "We add new designs every week — small batches, often one-of-one. If something catches your eye, it might not be here next time.",
    ],
    tint: "from-cream via-background to-rose/20",
  },
  {
    slug: "bestsellers",
    title: "Bestsellers",
    tagline: "the ones everyone's loving",
    emoji: "💗",
    blurb: "Our most-loved pieces, gifted hundreds of times over.",
    paragraphs: [
      "These are the designs our customers come back for — proven gifts, tested by happy mums, dads, grandparents and best friends.",
    ],
    tint: "from-rose/30 via-background to-cream",
  },
  {
    slug: "sale",
    title: "Sale",
    tagline: "a soft discount on a soft thing",
    emoji: "🏷️",
    query: "tag:sale",
    blurb: "End-of-season pieces and studio samples — same craft, gentler price.",
    paragraphs: [
      "When a colour gets retired or a sample comes back from a shoot, we list it here at a thoughtful discount. While they last.",
    ],
    tint: "from-sage/30 via-background to-background",
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
