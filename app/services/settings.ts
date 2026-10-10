import {
  DEFAULT_DURATIONS,
  type Durations,
  MAX_MINUTES,
  MIN_MINUTES,
  type Mode,
} from "../lib/pomodoro";
import { createSnapshot, readKey, subscribeKey, writeKey } from "./local-storage";

export type Settings = {
  durations: Durations;
};

export const DEFAULT_SETTINGS: Settings = {
  durations: DEFAULT_DURATIONS,
};

const STORAGE_KEY = "pomotimer:settings";

export function isValidMinutes(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_MINUTES &&
    value <= MAX_MINUTES
  );
}

/** Mescla o que foi salvo com os padrões, campo a campo: valor ausente ou inválido usa o padrão. */
function parse(raw: string | null): Settings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data: unknown = JSON.parse(raw);
    const saved =
      typeof data === "object" && data !== null && "durations" in data
        ? (data.durations as Partial<Record<Mode, unknown>>)
        : {};
    const durations = { ...DEFAULT_DURATIONS };
    for (const mode of Object.keys(durations) as Mode[]) {
      const value = saved?.[mode];
      if (isValidMinutes(value)) durations[mode] = value;
    }
    return { durations };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function getSettings(): Settings {
  return parse(readKey(STORAGE_KEY));
}

export function saveSettings(settings: Settings) {
  writeKey(STORAGE_KEY, JSON.stringify(settings));
}

/** Remove a configuração salva, voltando aos padrões. */
export function resetSettings() {
  writeKey(STORAGE_KEY, null);
}

/** Notifica mudanças nas configurações (nesta aba e em outras). */
export function subscribeSettings(onChange: () => void) {
  return subscribeKey(STORAGE_KEY, onChange);
}

/** Snapshot estável das configurações para useSyncExternalStore. */
export const getSettingsSnapshot = createSnapshot(STORAGE_KEY, parse);
