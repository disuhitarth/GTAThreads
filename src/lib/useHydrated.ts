import { useEffect, useState } from "react";

/** Returns true once all Zustand persist stores have hydrated from localStorage.
 *  Prevents hydration mismatch errors by deferring client-only rendering. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
