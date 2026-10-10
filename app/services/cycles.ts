import { MODES, type Mode } from "../lib/pomodoro";
import { createSnapshot, readKey, subscribeKey, writeKey } from "./local-storage";

export type CycleStatus = "completed" | "interrupted";

export type Cycle = {
  id: string;
  mode: Mode;
  /** ISO 8601 */
  startedAt: string;
  /** ISO 8601 */
  endedAt: string;
  /** Duração configurada da sessão */
  plannedMs: number;
  /** Tempo efetivamente cronometrado */
  elapsedMs: number;
  status: CycleStatus;
};

export type NewCycle = Omit<Cycle, "id">;

const STORAGE_KEY = "pomotimer:cycles";

function isCycle(value: unknown): value is Cycle {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.mode === "string" &&
    c.mode in MODES &&
    typeof c.startedAt === "string" &&
    typeof c.endedAt === "string" &&
    typeof c.plannedMs === "number" &&
    typeof c.elapsedMs === "number" &&
    (c.status === "completed" || c.status === "interrupted")
  );
}

function parse(raw: string | null): Cycle[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(isCycle)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  } catch {
    return [];
  }
}

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Todos os ciclos salvos, do mais recente para o mais antigo. */
export function getCycles(): Cycle[] {
  return parse(readKey(STORAGE_KEY));
}

export function saveCycle(input: NewCycle): Cycle {
  const cycle: Cycle = { ...input, id: createId() };
  writeKey(STORAGE_KEY, JSON.stringify([cycle, ...getCycles()]));
  return cycle;
}

export function clearCycles() {
  writeKey(STORAGE_KEY, null);
}

/** Notifica mudanças nos ciclos (nesta aba e em outras). */
export function subscribeCycles(onChange: () => void) {
  return subscribeKey(STORAGE_KEY, onChange);
}

/** Snapshot estável dos ciclos para useSyncExternalStore. */
export const getCyclesSnapshot = createSnapshot(STORAGE_KEY, parse);
