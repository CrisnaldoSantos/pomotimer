export type Mode = "focus" | "shortBreak" | "longBreak";

export const MODES: Record<Mode, { label: string }> = {
  focus: { label: "foco" },
  shortBreak: { label: "pausa curta" },
  longBreak: { label: "pausa longa" },
};

/** Duração de cada modo, em minutos. */
export type Durations = Record<Mode, number>;

/** Usadas quando o usuário não definiu nada em Configurações. */
export const DEFAULT_DURATIONS: Durations = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
};

export const MIN_MINUTES = 1;
export const MAX_MINUTES = 180;

/** Quantos focos completos até uma pausa longa. */
export const LONG_BREAK_INTERVAL = 4;

export function durationMs(mode: Mode, durations: Durations) {
  return durations[mode] * 60 * 1000;
}

/** Duração legível: "45s", "4m 32s", "25m", "1h 05m". */
export function formatDuration(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  if (minutes === 0) return `${seconds}s`;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

export function formatTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
