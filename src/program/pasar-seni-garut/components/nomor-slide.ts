import { createContext, useContext } from "react";

/** Nomor slide yang sedang tampil, diisi deck dari urutan manifest. */
export const NomorSlideContext = createContext<{ nomor: number; total: number } | null>(null);

export function useNomorSlide() {
  return useContext(NomorSlideContext);
}
