export interface Occasion {
  slug: string;
  title: string;
  tagline: string;
  emoji: string; // legacy, retained for fallback; UI uses CategoryIcon
  query?: string;
  heroCopy: string;
  paragraphs: string[];
  pairing: string;
  tint: string; // bg utility for hero tint
}

export const OCCASIONS: Occasion[] = [
  {
    slug: "valentines",
    title: "Valentine's Day",
    tagline: "For the heart you keep close.",
    emoji: "💌",
    query: "tag:valentines OR title:heart OR title:love OR title:valentine",
    heroCopy: "Love letters, but you can wear them.",
    paragraphs: [
      "Some gifts are roses, some are chocolates, and some are a sweatshirt with their name stitched right above your heart. The kind they'll throw on a Tuesday and think of you.",
      "Our Valentine's pieces are hand-embroidered in soft pinks, deep reds and creamy ivories — hearts, initials, a tiny line from a song you both know. Quiet little declarations.",
      "Order by February 7 for guaranteed delivery in the GTA. Custom names always welcome.",
    ],
    pairing: "Pairs beautifully with a hand-written card and a slow Sunday morning.",
    tint: "from-rose/40 via-background to-background",
  },
  {
    slug: "mothers-day",
    title: "For Mom",
    tagline: "For the woman who taught you tenderness.",
    emoji: "🌷",
    query: "tag:mothers-day OR title:mom OR title:mama OR title:mother",
    heroCopy: "For mom, mama, and the women who raised you.",
    paragraphs: [
      "Mom doesn't need another mug. She needs the thing she'll keep in the top drawer and wear on the days she misses you most.",
      "Choose her birth flower, her favourite colour, and the words she always says — we'll embroider them onto a soft crewneck or a tote she'll carry to the farmer's market.",
      "Order by April 24 for delivery before Mother's Day.",
    ],
    pairing: "Tuck a polaroid into the gift box. She'll cry the good kind.",
    tint: "from-cream via-background to-rose/30",
  },
  {
    slug: "fathers-day",
    title: "For Dad",
    tagline: "For dad, papa, and the steady ones.",
    emoji: "🌿",
    query: "tag:fathers-day OR title:dad OR title:papa OR title:father",
    heroCopy: "Soft pieces for the strong ones.",
    paragraphs: [
      "Dad will say he doesn't need anything. He'll still wear the sweatshirt every Sunday. Simple, sturdy, and quietly personal — a kid's drawing turned into stitches, an initial on the cuff, a coordinate from his hometown.",
      "Stitched in earthy tones and forest greens, on heavyweight cotton built to soften with every wash.",
      "Order by June 5 for delivery before Father's Day.",
    ],
    pairing: "Pairs with his favourite coffee and a long porch evening.",
    tint: "from-sage/40 via-background to-cream",
  },
  {
    slug: "grandparents",
    title: "For Grandma & Grandpa",
    tagline: "For the ones who spoil first, ask later.",
    emoji: "🪴",
    query: "tag:grandma OR tag:grandpa OR title:grandma OR title:grandpa OR title:nana OR title:papa",
    heroCopy: "Stitched keepsakes from the grandkids.",
    paragraphs: [
      "Grandparents save everything. Make it worth saving. Embroidered crewnecks with the grandkids' names, birth years, or the little nicknames only they get to use.",
      "Soft heavyweight cotton, roomy fit, gentle wash care so it lasts a decade of Sunday lunches.",
    ],
    pairing: "Wrap it with a photo of all the grandkids piled on the couch.",
    tint: "from-cream via-background to-sage/30",
  },
  {
    slug: "couples",
    title: "Couples",
    tagline: "Twinning, but tasteful.",
    emoji: "💞",
    query: "tag:couples OR tag:matching OR title:couple OR title:matching",
    heroCopy: "Two pieces, one quiet inside joke.",
    paragraphs: [
      "Matching sweatshirts that don't scream — coordinates, anniversary dates, initials stitched on the cuff. Pick a colourway and we'll do the rest.",
      "Available in cream, sage, oat, and the prettiest blush you've ever seen.",
    ],
    pairing: "Pairs with the photo you'll send to the group chat.",
    tint: "from-rose/30 via-background to-sage/20",
  },
  {
    slug: "wedding",
    title: "Wedding",
    tagline: "Bridesmaids, grooms, and the morning of.",
    emoji: "💍",
    query: "tag:wedding OR title:wedding OR title:bride OR title:groom",
    heroCopy: "Stitched pieces for the people standing beside you.",
    paragraphs: [
      "Embroidered robes for the bridal party, monogrammed hankies for dad, and a 'just married' sweatshirt for the morning-after brunch.",
      "Custom orders take 2–3 weeks — please plan ahead for your date.",
    ],
    pairing: "Pairs with champagne and slightly damp mascara.",
    tint: "from-cream via-background to-rose/20",
  },
  {
    slug: "baby",
    title: "Baby & New Mums",
    tagline: "For tiny humans and the ones who love them.",
    emoji: "🍼",
    query: "tag:baby OR title:baby OR title:newborn OR title:onesie",
    heroCopy: "Soft beginnings, stitched with care.",
    paragraphs: [
      "Cotton onesies with their name stitched on the chest. Made for first photos, hospital bags, baby showers and the moments you'll want to keep forever.",
      "Pastel threads, breathable cotton, optional tiny daisies, bears, or a birth date.",
      "Sized 0–24 months. Free gift wrapping on baby gifts, always.",
    ],
    pairing: "Pairs with a swaddle, a soft toy, and a long deep nap.",
    tint: "from-cream via-background to-sage/30",
  },
  {
    slug: "pets",
    title: "Pets",
    tagline: "For the four-legged best friend.",
    emoji: "🐾",
    query: "tag:pets OR title:dog OR title:cat OR title:pet OR title:paw",
    heroCopy: "Stitched with their name (and their paw print).",
    paragraphs: [
      "Embroidered bandanas, tote bags with their name, and matching crewnecks for the human who can't stop talking about them.",
      "Send us their name (and a photo if you'd like a tiny stitched portrait) — we'll do the rest.",
    ],
    pairing: "Pairs with a long walk and slightly muddy paws.",
    tint: "from-rose/20 via-background to-sage/20",
  },
  {
    slug: "christmas",
    title: "Christmas",
    tagline: "For under the tree, for the matching family photo.",
    emoji: "🎄",
    query: "tag:christmas OR tag:holiday OR title:christmas OR title:holiday",
    heroCopy: "The kind of gift they'll save for next year, too.",
    paragraphs: [
      "Matching sweatshirts, embroidered stockings, family names with the year stitched in. Pieces meant to become tradition.",
      "Available in forest sage, deep cream, and a Christmas red so warm it feels like firelight.",
      "Order by December 5 for delivery before Christmas.",
    ],
    pairing: "Pairs with hot chocolate, slow snow, and the right playlist.",
    tint: "from-sage/30 via-background to-rose/20",
  },
  {
    slug: "halloween",
    title: "Halloween",
    tagline: "Spooky, but make it cute.",
    emoji: "🎃",
    query: "tag:halloween OR title:halloween OR title:pumpkin OR title:spooky",
    heroCopy: "Pumpkin season, with a needle and thread.",
    paragraphs: [
      "Embroidered pumpkins, tiny ghosts, and 'spooky season' crewnecks for the people who start decorating in September.",
      "Limited runs every October — once they're stitched, they're gone.",
    ],
    pairing: "Pairs with cinnamon coffee and one too many candles.",
    tint: "from-cream via-background to-rose/20",
  },
  {
    slug: "birthdays",
    title: "Birthdays",
    tagline: "For the people you'd throw a party for.",
    emoji: "🎂",
    query: "tag:birthday OR title:birthday",
    heroCopy: "A gift that doesn't get re-gifted.",
    paragraphs: [
      "Hand-embroidered with their name, their birth flower, or the inside joke only the two of you will understand.",
      "Standard turnaround is 5–7 days. Rush available on request.",
    ],
    pairing: "Pairs with a slice of cake and a single candle.",
    tint: "from-rose/30 via-background to-cream",
  },
  {
    slug: "nurse-scrubs",
    title: "Nurse, Dentist & Scrubs",
    tagline: "For the long shifts and the kind hands.",
    emoji: "🩺",
    query: "tag:nurse OR tag:scrubs OR title:nurse OR title:scrubs OR title:dentist",
    heroCopy: "Embroidered crewnecks for the people who care for everyone else.",
    paragraphs: [
      "Their name, their unit, their credentials — stitched onto a heavyweight crewneck they can throw on after a 12-hour shift.",
      "Soft cottons that wash well, because we know how hard you are on your clothes.",
    ],
    pairing: "Pairs with a hot shower and twelve hours of sleep.",
    tint: "from-sage/30 via-background to-cream",
  },
  {
    slug: "auntie",
    title: "Auntie",
    tagline: "For the cool one in the family.",
    emoji: "💐",
    query: "tag:auntie OR tag:aunt OR title:aunt OR title:auntie",
    heroCopy: "Stitched gifts for the auntie who shows up.",
    paragraphs: [
      "Embroidered with 'cool aunt', niece/nephew names, or a tiny inside joke. Worn proudly at every family gathering.",
    ],
    pairing: "Pairs with a glass of wine and unsolicited gossip.",
    tint: "from-rose/30 via-background to-background",
  },
  {
    slug: "autumn",
    title: "Autumn",
    tagline: "For sweater weather and slow Sundays.",
    emoji: "🍂",
    query: "tag:autumn OR tag:fall OR title:autumn OR title:fall OR title:leaves",
    heroCopy: "Warm threads for cool mornings.",
    paragraphs: [
      "Embroidered leaves, mushrooms, and tiny pumpkins on heavyweight crewnecks in rust, mustard, and forest tones.",
    ],
    pairing: "Pairs with apple cider and a long walk in the leaves.",
    tint: "from-cream via-background to-rose/20",
  },
  {
    slug: "jesus",
    title: "Faith",
    tagline: "Quiet pieces of devotion.",
    emoji: "✝️",
    query: "tag:faith OR tag:jesus OR title:jesus OR title:faith OR title:cross",
    heroCopy: "Stitched scripture and gentle reminders.",
    paragraphs: [
      "Verses, crosses, and gentle words embroidered in cream and gold — small, meaningful pieces.",
    ],
    pairing: "Pairs with morning coffee and your favourite verse.",
    tint: "from-cream via-background to-sage/20",
  },
  {
    slug: "custom-embroidery",
    title: "Custom Embroidery",
    tagline: "Anything you can dream, stitched by hand.",
    emoji: "🧵",
    heroCopy: "Send us the words, the colour, the garment.",
    paragraphs: [
      "Custom orders are our favourite. Names, dates, illustrations, song lyrics, a tiny drawing your kid made — we'll stitch it onto the garment of your choice.",
      "Turnaround is 7–14 days. Request a custom order anytime.",
    ],
    pairing: "Pairs perfectly with whatever moment you're trying to keep.",
    tint: "from-rose/20 via-background to-sage/20",
  },
];

export const occasionBySlug = (slug: string) =>
  OCCASIONS.find((o) => o.slug === slug);
