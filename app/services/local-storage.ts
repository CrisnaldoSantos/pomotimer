// Leitura/escrita de chaves do localStorage com aviso de mudança,
// base comum dos services persistidos no navegador.

// O evento "storage" só dispara em outras abas; este avisa a aba atual.
const CHANGE_EVENT = "pomotimer:storage-change";

export function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeKey(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage cheio ou bloqueado (ex.: modo privado) — não há onde salvar
    return;
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

/** Notifica mudanças em `key` (nesta aba e em outras). */
export function subscribeKey(key: string, onChange: () => void) {
  const onLocal = (e: Event) => {
    if ((e as CustomEvent<string>).detail === key) onChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Snapshot estável para useSyncExternalStore: só reprocessa o valor
 * quando o conteúdo salvo muda.
 */
export function createSnapshot<T>(key: string, parse: (raw: string | null) => T) {
  let cachedRaw: string | null | undefined;
  let cachedValue: T;
  return () => {
    const raw = readKey(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parse(raw);
    }
    return cachedValue;
  };
}
