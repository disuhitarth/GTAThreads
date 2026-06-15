import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CurrencyCode = "CAD" | "USD";

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "CAD",
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "gta-threads-currency",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const RATES: Record<CurrencyCode, Record<CurrencyCode, number>> = {
  CAD: { CAD: 1, USD: 0.73 },
  USD: { CAD: 1 / 0.73, USD: 1 },
};

export function convertPrice(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  return amount * RATES[from][to];
}
