import { Truck, ShieldCheck, Gift, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Truck, title: "Free GTA delivery", body: "On orders over $75 anywhere in the Greater Toronto Area." },
  { icon: Gift, title: "Free gift wrap", body: "Tissue, ribbon, kraft box and a handwritten note — on every order." },
  { icon: ShieldCheck, title: "30-day promise", body: "Not in love with your piece? Send it back, no awkward questions." },
  { icon: Sparkles, title: "Stitched, not printed", body: "Real embroidery thread, made to soften with every wash." },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border/60 bg-cream/40 px-6 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-start gap-3">
            <it.icon className="mt-1 h-6 w-6 flex-shrink-0 text-bloom" strokeWidth={1.5} />
            <div>
              <p className="font-display text-lg italic">{it.title}</p>
              <p className="text-sm text-muted-foreground">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
