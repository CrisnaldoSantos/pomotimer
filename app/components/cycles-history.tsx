"use client";

import Link from "next/link";
import { useCycles } from "../hooks/use-cycles";
import { MODES, formatDuration } from "../lib/pomodoro";
import { type Cycle, clearCycles } from "../services/cycles";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold tabular-nums" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ModeBadge({ mode }: { mode: Cycle["mode"] }) {
  const isFocus = mode === "focus";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs ${
        isFocus ? "bg-green/10 text-green" : "bg-blue/10 text-blue"
      }`}
    >
      <span className={`size-1.5 rounded-full ${isFocus ? "bg-green" : "bg-blue"}`} />
      {MODES[mode].label}
    </span>
  );
}

function StatusBadge({ status }: { status: Cycle["status"] }) {
  return status === "completed" ? (
    <span className="text-green">✓ concluído</span>
  ) : (
    <span className="text-orange">✗ interrompido</span>
  );
}

export function CyclesHistory() {
  const cycles = useCycles();

  // Renderização no servidor / antes da hidratação: ainda não lemos o localStorage
  if (cycles === null) {
    return <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />;
  }

  if (cycles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-16 text-center">
        <p className="font-mono text-muted">{"// nenhum ciclo registrado ainda"}</p>
        <Link
          href="/"
          className="rounded-lg bg-green px-4 py-2 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          iniciar um foco
        </Link>
      </div>
    );
  }

  const focus = cycles.filter((c) => c.mode === "focus");
  const completedFocus = focus.filter((c) => c.status === "completed").length;
  const focusedMs = focus.reduce((sum, c) => sum + c.elapsedMs, 0);
  const interrupted = cycles.filter((c) => c.status === "interrupted").length;

  function handleClear() {
    if (window.confirm("Apagar todo o histórico de ciclos deste navegador?")) {
      clearCycles();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Focos concluídos" value={String(completedFocus)} color="var(--green)" />
        <Stat label="Tempo focado" value={formatDuration(focusedMs)} color="var(--purple)" />
        <Stat label="Interrompidos" value={String(interrupted)} color="var(--orange)" />
        <Stat label="Sessões" value={String(cycles.length)} color="var(--blue)" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface font-mono text-xs text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Data</th>
              <th scope="col" className="px-4 py-3 font-medium">Início</th>
              <th scope="col" className="px-4 py-3 font-medium">Fim</th>
              <th scope="col" className="px-4 py-3 font-medium">Tipo</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Duração</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-mono">
            {cycles.map((cycle) => {
              const started = new Date(cycle.startedAt);
              const ended = new Date(cycle.endedAt);
              return (
                <tr key={cycle.id} className="transition-colors hover:bg-surface">
                  <td className="px-4 py-3 whitespace-nowrap">{dateFormat.format(started)}</td>
                  <td className="px-4 py-3 text-muted tabular-nums">{timeFormat.format(started)}</td>
                  <td className="px-4 py-3 text-muted tabular-nums">{timeFormat.format(ended)}</td>
                  <td className="px-4 py-3">
                    <ModeBadge mode={cycle.mode} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                    {formatDuration(cycle.elapsedMs)}
                    <span className="text-muted"> / {formatDuration(cycle.plannedMs)}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <StatusBadge status={cycle.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className="rounded-lg border border-border px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-pink hover:text-pink"
        >
          limpar histórico
        </button>
      </div>
    </div>
  );
}
