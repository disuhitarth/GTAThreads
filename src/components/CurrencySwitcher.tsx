import { useCurrencyStore, type CurrencyCode } from "@/stores/currencyStore";

const FLAGS: Record<CurrencyCode, string> = {
  CAD: "CA",
  USD: "US",
};

export function CurrencySwitcher() {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  return (
    <div className="flex items-center gap-1">
      {(["CAD", "USD"] as CurrencyCode[]).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          aria-label={`Display prices in ${c}`}
          className={`grid h-7 w-9 place-items-center rounded-md text-[11px] uppercase tracking-wider transition-colors ${
            currency === c
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {FLAGS[c]}
        </button>
      ))}
    </div>
  );
}
