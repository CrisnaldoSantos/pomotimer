"use client";

import { useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  type Settings,
  getSettingsSnapshot,
  subscribeSettings,
} from "../services/settings";

/** Configurações salvas no navegador (padrões no servidor/hidratação). */
export function useSettings(): Settings {
  return useSyncExternalStore(subscribeSettings, getSettingsSnapshot, () => DEFAULT_SETTINGS);
}
