"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  LONG_BREAK_INTERVAL,
  MODES,
  type Mode,
  durationMs,
  formatTime,
} from "../lib/pomodoro";
import { useCycles } from "../hooks/use-cycles";
import { useSettings } from "../hooks/use-settings";
import { type Cycle, type CycleStatus, saveCycle } from "../services/cycles";
import { DevAnimation, type DevState } from "./dev-animation";

const MODE_ORDER: Mode[] = ["focus", "shortBreak", "longBreak"];

/** Sessões interrompidas com menos que isso não entram no histórico. */
const MIN_RECORDED_MS = 1000;

function playChime() {
  try {
    const ctx = new AudioContext();
    [660, 880, 990].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.18;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch {
    // Áudio indisponível — segue sem som
  }
}

function countFocusToday(cycles: Cycle[]) {
  const today = new Date().toDateString();
  return cycles.filter(
    (c) => c.mode === "focus" && c.status === "completed" && new Date(c.startedAt).toDateString() === today,
  ).length;
}

export function Timer() {
  const [mode, setMode] = useState<Mode>("focus");
  /** Tempo restante da sessão em andamento; null enquanto não começou (usa a duração configurada). */
  const [remaining, setRemaining] = useState<number | null>(null);
  /** Duração congelada no início da sessão, para mudanças em Configurações não afetarem a sessão atual. */
  const [sessionTotal, setSessionTotal] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [completedFocus, setCompletedFocus] = useState(0);
  const endAtRef = useRef(0);
  /** Momento do primeiro "iniciar" da sessão atual; null se ainda não começou. */
  const startedAtRef = useRef<number | null>(null);
  const cycles = useCycles();
  const { durations } = useSettings();

  const total = sessionTotal ?? durationMs(mode, durations);
  const remainingMs = remaining ?? total;
  const progress = 1 - remainingMs / total;
  const isBreak = mode !== "focus";
  const devState: DevState = isBreak ? "break" : running ? "coding" : "idle";

  function recordCycle(status: CycleStatus) {
    const startedAt = startedAtRef.current;
    if (startedAt === null) return;
    startedAtRef.current = null;

    const left = running ? Math.max(0, endAtRef.current - Date.now()) : remainingMs;
    const elapsedMs = status === "completed" ? total : total - left;
    if (status === "interrupted" && elapsedMs < MIN_RECORDED_MS) return;

    saveCycle({
      mode,
      startedAt: new Date(startedAt).toISOString(),
      endedAt: new Date().toISOString(),
      plannedMs: total,
      elapsedMs,
      status,
    });
  }

  /** Troca de sessão; se a atual já tinha começado, registra no histórico. */
  function goTo(next: Mode, status: CycleStatus = "interrupted") {
    recordCycle(status);
    setRunning(false);
    setMode(next);
    setRemaining(null);
    setSessionTotal(null);
  }

  function start() {
    startedAtRef.current ??= Date.now();
    setSessionTotal(total);
    endAtRef.current = Date.now() + remainingMs;
    setRunning(true);
  }

  function pause() {
    setRemaining(Math.max(0, endAtRef.current - Date.now()));
    setRunning(false);
  }

  function toggle() {
    if (running) pause();
    else start();
  }

  function reset() {
    goTo(mode);
  }

  function nextMode(countFocus: boolean) {
    if (mode !== "focus") return "focus";
    const done = countFocus ? completedFocus + 1 : completedFocus;
    if (countFocus) setCompletedFocus(done);
    return done > 0 && done % LONG_BREAK_INTERVAL === 0 ? "longBreak" : "shortBreak";
  }

  function skip() {
    goTo(nextMode(false));
  }

  const onComplete = useEffectEvent(() => {
    playChime();
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(mode === "focus" ? "Foco concluído! Hora da pausa ☕" : "Pausa encerrada. Bora codar! 💻");
    }
    goTo(nextMode(true), "completed");
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        onComplete();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = `${formatTime(remainingMs)} · ${MODES[mode].label} — pomotimer`;
  }, [remainingMs, mode]);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, button, a, [contenteditable]")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === "Space") {
      e.preventDefault();
      toggle();
    } else if (e.key === "r") {
      reset();
    } else if (e.key === "s") {
      skip();
    }
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function handleStartClick() {
    if (!running && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    toggle();
  }

  const accent = isBreak ? "var(--blue)" : "var(--green)";
  const cyclePosition = completedFocus % LONG_BREAK_INTERVAL;
  // cycles é null no servidor, então a data só é lida no cliente
  const focusToday = cycles ? countFocusToday(cycles) : 0;

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      {/* Modos */}
      <div role="tablist" aria-label="Modo" className="flex gap-1 rounded-lg border border-border bg-surface p-1 font-mono text-sm">
        {MODE_ORDER.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => goTo(m)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              mode === m ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* Animação central */}
      <DevAnimation state={devState} className="w-full max-w-2xl" />

      {/* Tempo + progresso */}
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        <p
          className="font-mono text-7xl font-semibold tabular-nums tracking-tight sm:text-8xl"
          aria-live="off"
        >
          {formatTime(remainingMs)}
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-linear"
            style={{ width: `${progress * 100}%`, background: accent }}
          />
        </div>
        <p className="font-mono text-sm text-muted">
          {isBreak ? "// respira, hidrata, alonga" : running ? "> codando..." : "> pronto para focar"}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3 font-mono">
        <button
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-muted hover:text-foreground"
          title="Reiniciar (R)"
        >
          reset
        </button>
        <button
          onClick={handleStartClick}
          className="min-w-36 rounded-lg px-6 py-2.5 text-base font-semibold text-background transition-opacity hover:opacity-90"
          style={{ background: accent }}
          title="Iniciar/pausar (Espaço)"
        >
          {running ? "pausar" : remaining === null ? "iniciar" : "continuar"}
        </button>
        <button
          onClick={skip}
          className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted transition-colors hover:border-muted hover:text-foreground"
          title="Pular (S)"
        >
          pular
        </button>
      </div>

      {/* Ciclo atual */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2" aria-label={`${cyclePosition} de ${LONG_BREAK_INTERVAL} focos no ciclo`}>
          {Array.from({ length: LONG_BREAK_INTERVAL }, (_, i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full ${i < cyclePosition ? "bg-green" : "bg-surface-2"}`}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-muted">
          {focusToday} {focusToday === 1 ? "foco concluído" : "focos concluídos"} hoje ·{" "}
          <kbd>espaço</kbd> iniciar/pausar · <kbd>r</kbd> reset · <kbd>s</kbd> pular
        </p>
      </div>
    </div>
  );
}
