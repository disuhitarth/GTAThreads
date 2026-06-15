import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ssrSafeStorage } from "@/lib/ssrSafeStorage";
import { customerLogin, customerLogout, getCustomer } from "@/lib/shopify";
import type { Customer } from "@/lib/shopify";

interface AuthStore {
  accessToken: string | null;
  customer: Customer | null;
  isPending: boolean;
  setCustomer: (customer: Customer, accessToken: string) => void;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      customer: null,
      isPending: false,

      setCustomer: (customer, accessToken) => set({ customer, accessToken }),

      login: async (email, password) => {
        set({ isPending: true });
        const result = await customerLogin({ email, password });
        if (!result.success) {
          set({ isPending: false });
          return result.error;
        }
        const customer = await getCustomer(result.accessToken);
        set({
          customer,
          accessToken: result.accessToken,
          isPending: false,
        });
        return null;
      },

      logout: async () => {
        const token = get().accessToken;
        if (token) {
          await customerLogout(token).catch(() => {});
        }
        set({ customer: null, accessToken: null });
      },

      hydrate: async () => {
        const token = get().accessToken;
        if (!token) return;
        try {
          const customer = await getCustomer(token);
          if (customer) {
            set({ customer });
          } else {
            set({ customer: null, accessToken: null });
          }
        } catch {
          set({ customer: null, accessToken: null });
        }
      },
    }),
    {
      name: "gta-threads-auth",
      storage: createJSONStorage(ssrSafeStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
