import { useCurrencyStore, convertPrice, type CurrencyCode } from "@/stores/currencyStore";
import { formatPrice } from "@/lib/shopify";

export function PriceDisplay({ amount, currency }: { amount: string; currency: string }) {
  const preferred = useCurrencyStore((s) => s.currency);
  const source = currency as CurrencyCode;
  const converted = convertPrice(Number(amount), source, preferred);
  return <>{formatPrice(converted, preferred)}</>;
}
