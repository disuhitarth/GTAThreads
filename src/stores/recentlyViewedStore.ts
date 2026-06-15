import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface RecentProduct {
  id: string;
  handle: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string };
}

interface RecentlyViewedStore {
  items: RecentProduct[];
  addItem: (item: RecentProduct) => void;
}

const MAX = 8;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id);
        set({ items: [item, ...filtered].slice(0, MAX) });
      },
    }),
    {
      name: "gta-threads-recent",
      storage: createJSONStorage(() => typeof window !== "undefined" ? localStorage : undefined!),
    },
  ),
);
