/**
 * SSR-safe PersistStorage for Zustand persist middleware.
 * On the server returns an in-memory store that discards writes.
 * On the client returns the real localStorage.
 */
export function ssrSafeStorage(): Storage {
  if (typeof window !== "undefined") return localStorage;
  const store = new Map<string, string>();
  return {
    getItem(key: string) { return store.get(key) ?? null; },
    setItem(key: string, value: string) { store.set(key, value); },
    removeItem(key: string) { store.delete(key); },
    get length() { return store.size; },
    clear() { store.clear(); },
    key(index: number) { return [...store.keys()][index] ?? null; },
  };
}
