import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText?: string };
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggle: (item: WishlistItem) => void;
  isFavorited: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set({ items: [...get().items, item] }),
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      isFavorited: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "gta-threads-wishlist",
      storage: createJSONStorage(() => typeof window !== "undefined" ? localStorage : undefined!),
    },
  ),
);
