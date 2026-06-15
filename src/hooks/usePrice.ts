import { useCurrencyStore, convertPrice, type CurrencyCode } from "@/stores/currencyStore";
import { formatPrice } from "@/lib/shopify";

export function usePrice(amount: string, sourceCurrency: string) {
  const preferred = useCurrencyStore((s) => s.currency);
  const source = sourceCurrency as CurrencyCode;
  const converted = convertPrice(Number(amount), source, preferred);
  return formatPrice(converted, preferred);
}
