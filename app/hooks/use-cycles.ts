"use client";

import { useSyncExternalStore } from "react";
import { type Cycle, getCyclesSnapshot, subscribeCycles } from "../services/cycles";

/** Ciclos salvos no navegador. `null` enquanto renderiza no servidor/hidrata. */
export function useCycles(): Cycle[] | null {
  return useSyncExternalStore(subscribeCycles, getCyclesSnapshot, () => null);
}
