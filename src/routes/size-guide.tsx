import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/size-guide")({
  head: () => ({
    meta: [
      { title: "Size guide — GTA Threads" },
      {
        name: "description",
        content:
          "Find your fit. Sizing for our tees, hoodies, hats and baby pieces, with how-to-measure tips.",
      },
      { property: "og:title", content: "Size guide — GTA Threads" },
      { property: "og:description", content: "Sizing for tees, hoodies, hats and baby pieces." },
      { property: "og:url", content: "/size-guide" },
    ],
    links: [{ rel: "canonical", href: "/size-guide" }],
  }),
  component: SizeGuide,
});

const TEES = [
  ["XS", "32–34", "27"],
  ["S", "35–37", "28"],
  ["M", "38–40", "29"],
  ["L", "41–43", "30"],
  ["XL", "44–46", "31"],
  ["XXL", "47–49", "32"],
];

const HOODIES = [
  ["XS", "38", "26"],
  ["S", "40", "27"],
  ["M", "42", "28"],
  ["L", "44", "29"],
  ["XL", "46", "30"],
  ["XXL", "48", "31"],
];

const BABY = [
  ["0–3m", "Up to 12 lb", '23"'],
  ["3–6m", "12–16 lb", '26"'],
  ["6–12m", "16–22 lb", '29"'],
  ["12–18m", "22–27 lb", '32"'],
  ["18–24m", "27–30 lb", '34"'],
];

function SizeGuide() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[900px]">
        <div className="text-center">
          <span className="font-script text-2xl text-bloom">find your fit</span>
          <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
            Size <span className="italic text-bloom">guide.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
            All measurements are in inches and represent garment dimensions, not body. Sizes can run
            a touch oversized — when in doubt, size down.
          </p>
        </div>

        <Table title="Tees" cols={["Size", "Chest", "Length"]} rows={TEES} />
        <Table title="Hoodies & crewnecks" cols={["Size", "Chest", "Length"]} rows={HOODIES} />
        <Table title="Baby" cols={["Size", "Weight", "Body length"]} rows={BABY} />

        <div className="mt-16 rounded-[2rem] bg-cream/60 p-8 sm:p-12">
          <h2 className="font-display text-3xl italic">How to measure</h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Chest:</strong> Take a favourite tee, lay it flat,
              measure across one inch below the armhole. Double it.
            </li>
            <li>
              <strong className="text-foreground">Length:</strong> Measure from the highest point of
              the shoulder seam down to the hem.
            </li>
            <li>
              <strong className="text-foreground">Sleeve:</strong> From the centre back of the neck,
              across the shoulder, to the cuff.
            </li>
          </ul>
          <p className="mt-8 font-script text-xl text-bloom">
            Still unsure? Email hello@gtathreads.com — we'll help you pick.
          </p>
        </div>
      </div>
    </section>
  );
}

function Table({ title, cols, rows }: { title: string; cols: string[]; rows: string[][] }) {
  return (
    <div className="mt-16">
      <h2 className="font-display text-3xl italic">{title}</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60">
            <tr>
              {cols.map((c) => (
                <th
                  key={c}
                  className="px-5 py-3 text-left font-medium uppercase tracking-[0.18em] text-xs text-muted-foreground"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-cream/30" : ""}>
                {r.map((cell, j) => (
                  <td key={j} className="px-5 py-3 border-t border-border/60">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
