export interface Faq {
  q: string;
  a: string;
}

const COMMON: Faq[] = [
  {
    q: "How long does an order take?",
    a: "Standard turnaround is 5–7 business days from approval. Each piece is embroidered to order in our Toronto studio, then quality-checked and gift-wrapped before shipping.",
  },
  {
    q: "Do you ship outside the GTA?",
    a: "Yes — we ship across Canada and to the US. GTA orders qualify for same-week local delivery. International shipping is available on request.",
  },
  {
    q: "Can I personalise a piece with a name or date?",
    a: "Absolutely — that's most of what we do. Add a note at checkout with the name, date, or short phrase you want stitched and we'll preview the layout before we begin.",
  },
];

export const OCCASION_FAQS: Record<string, Faq[]> = {
  valentines: [
    {
      q: "When should I order to receive my gift by Valentine's Day?",
      a: "Order by February 7 to guarantee delivery anywhere in the GTA before February 14. Rush orders may be accommodated — message us first.",
    },
    {
      q: "Do you wrap Valentine's orders?",
      a: "Every Valentine's piece arrives wrapped in tissue, tied with a satin ribbon, and tucked into a kraft gift box. A handwritten card is included free.",
    },
    {
      q: "Can I get a couple's matching set?",
      a: "Yes — many of our Valentine's pieces are designed to be ordered as twinning sets. Add both sizes to your cart and we'll coordinate the stitching.",
    },
    ...COMMON,
  ],
  "mothers-day": [
    {
      q: "What's the cut-off date for Mother's Day delivery?",
      a: "Order by April 24 for delivery anywhere in Canada before Mother's Day. GTA local orders can be placed up to April 30.",
    },
    {
      q: "Can I add my kids' names to the design?",
      a: "Of course. Add each name (and a date if you'd like) in the personalisation field and we'll lay them out in a balanced composition.",
    },
    {
      q: "Do you have anything for grandmothers?",
      a: "Yes — many of our Mother's Day pieces work beautifully for grandmas. We can embroider 'Nana,' 'Grandma,' 'Babcia,' 'Nani' — any term of love.",
    },
    ...COMMON,
  ],
  "fathers-day": [
    {
      q: "Will Dad actually wear this?",
      a: "Our Father's Day pieces are designed for everyday — heavyweight cottons, earthy tones, subtle embroidery on the chest or sleeve. The kind of gift that becomes a uniform.",
    },
    {
      q: "Can you turn my kid's drawing into embroidery?",
      a: "Yes! Upload the drawing in the custom-order form and we'll digitise it as embroidery. Allow an extra 5 days for digitisation.",
    },
    {
      q: "When should I order for Father's Day?",
      a: "Order by June 5 for guaranteed delivery before Father's Day.",
    },
    ...COMMON,
  ],
  baby: [
    {
      q: "What sizes do you carry for babies?",
      a: "0–3, 3–6, 6–12, 12–18 and 18–24 months for onesies. Toddler tees go up to size 4T.",
    },
    {
      q: "Are the materials safe for newborns?",
      a: "Always. We use 100% organic combed cotton, OEKO-TEX-certified threads, and never any iron-ons or transfers near the skin.",
    },
    {
      q: "Do you wrap baby gifts?",
      a: "Free gift wrap is standard on all baby orders, with a little daisy tag and space for a handwritten note.",
    },
    ...COMMON,
  ],
  christmas: [
    {
      q: "When's the Christmas order deadline?",
      a: "Order by December 5 for guaranteed Canada-wide delivery before December 24. GTA local same-week delivery available until December 19.",
    },
    {
      q: "Can you do matching family sets?",
      a: "Yes — we love these. Add each family member's size and name in your cart and we'll stitch them as a coordinated set.",
    },
    {
      q: "Do you offer corporate Christmas orders?",
      a: "Yes — for 10+ pieces, please use the custom order request form so we can quote and schedule properly.",
    },
    ...COMMON,
  ],
  birthdays: [
    {
      q: "How fast can you turn around a birthday gift?",
      a: "Standard 5–7 days. Rush turnaround in 48 hours is available for an additional fee — message us first to confirm.",
    },
    {
      q: "Can I include a personal message?",
      a: "Yes — add a note at checkout and we'll handwrite it on a kraft card tucked into the gift box.",
    },
    {
      q: "Do you make gift cards?",
      a: "Digital gift cards are available in $25, $50 and $100 denominations — perfect if you're not sure what to choose.",
    },
    ...COMMON,
  ],
};

export const getFaqs = (slug: string): Faq[] => OCCASION_FAQS[slug] ?? COMMON;
