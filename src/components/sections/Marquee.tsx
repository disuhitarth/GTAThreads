export function Marquee() {
  const items = [
    "With love from Toronto",
    "Embroidered by hand",
    "Free gift wrap",
    "Custom names always",
    "Ships worldwide",
    "Made for the girls",
  ];
  const row = [...items, ...items, ...items];
  return (
    <section
      aria-label="Studio promise"
      className="overflow-hidden border-y border-border bg-rose/40 py-5"
    >
      <div className="relative flex whitespace-nowrap">
        <div className="flex animate-marquee gap-10 pr-10">
          {row.map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-display text-2xl italic tracking-tight text-foreground sm:text-3xl"
            >
              {t}
              <span className="text-bloom" aria-hidden>
                ❀
              </span>
            </span>
          ))}
        </div>
        <div aria-hidden className="flex animate-marquee gap-10 pr-10">
          {row.map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-10 font-display text-2xl italic tracking-tight text-foreground sm:text-3xl"
            >
              {t}
              <span className="text-bloom">❀</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
