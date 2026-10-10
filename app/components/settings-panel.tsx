"use client";

import { useState } from "react";
import { useSettings } from "../hooks/use-settings";
import {
  DEFAULT_DURATIONS,
  type Durations,
  LONG_BREAK_INTERVAL,
  MAX_MINUTES,
  MIN_MINUTES,
  MODES,
  type Mode,
} from "../lib/pomodoro";
import {
  type Settings,
  isValidMinutes,
  resetSettings,
  saveSettings,
} from "../services/settings";

const FIELDS: { mode: Mode; hint: string; color: string }[] = [
  { mode: "focus", hint: "tempo codando sem interrupções", color: "var(--green)" },
  { mode: "shortBreak", hint: "entre um foco e outro", color: "var(--blue)" },
  { mode: "longBreak", hint: `a cada ${LONG_BREAK_INTERVAL} focos concluídos`, color: "var(--purple)" },
];

type Draft = Record<Mode, string>;

function toDraft(durations: Durations): Draft {
  return {
    focus: String(durations.focus),
    shortBreak: String(durations.shortBreak),
    longBreak: String(durations.longBreak),
  };
}

function isDefault(durations: Durations) {
  return FIELDS.every(({ mode }) => durations[mode] === DEFAULT_DURATIONS[mode]);
}

export function SettingsPanel() {
  const settings = useSettings();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  return (
    // Remonta o formulário quando o valor salvo muda (hidratação, outra aba, restaurar padrões)
    <SettingsForm
      key={JSON.stringify(settings)}
      settings={settings}
      savedAt={savedAt}
      onSaved={() => setSavedAt(Date.now())}
    />
  );
}

function SettingsForm({
  settings,
  savedAt,
  onSaved,
}: {
  settings: Settings;
  savedAt: number | null;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings.durations));

  const parsed = Object.fromEntries(
    FIELDS.map(({ mode }) => [mode, Number(draft[mode])]),
  ) as Durations;
  const errors = Object.fromEntries(
    FIELDS.map(({ mode }) => [
      mode,
      draft[mode].trim() !== "" && isValidMinutes(parsed[mode])
        ? null
        : `Use um número inteiro entre ${MIN_MINUTES} e ${MAX_MINUTES}.`,
    ]),
  ) as Record<Mode, string | null>;
  const valid = FIELDS.every(({ mode }) => errors[mode] === null);
  const dirty = FIELDS.some(({ mode }) => parsed[mode] !== settings.durations[mode]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || !dirty) return;
    saveSettings({ durations: parsed });
    onSaved();
  }

  function handleReset() {
    resetSettings();
    // Se já não havia nada salvo, o snapshot não muda e o form não remonta
    setDraft(toDraft(DEFAULT_DURATIONS));
    onSaved();
  }

  function step(mode: Mode, delta: number) {
    const current = isValidMinutes(parsed[mode]) ? parsed[mode] : DEFAULT_DURATIONS[mode];
    const next = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, current + delta));
    setDraft((d) => ({ ...d, [mode]: String(next) }));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="divide-y divide-border rounded-lg border border-border bg-surface">
        {FIELDS.map(({ mode, hint, color }) => {
          const id = `duration-${mode}`;
          const error = errors[mode];
          return (
            <div key={mode} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label htmlFor={id} className="flex items-center gap-2 font-mono text-sm font-medium">
                  <span className="size-2 rounded-full" style={{ background: color }} />
                  {MODES[mode].label}
                </label>
                <p className="mt-0.5 text-xs text-muted">
                  {hint} · padrão: {DEFAULT_DURATIONS[mode]} min
                </p>
                {error && (
                  <p id={`${id}-error`} className="mt-1 text-xs text-pink">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => step(mode, -1)}
                  aria-label={`Diminuir ${MODES[mode].label}`}
                  className="size-9 rounded-md border border-border text-muted transition-colors hover:border-muted hover:text-foreground"
                >
                  −
                </button>
                <input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={MIN_MINUTES}
                  max={MAX_MINUTES}
                  step={1}
                  value={draft[mode]}
                  onChange={(e) => setDraft((d) => ({ ...d, [mode]: e.target.value }))}
                  aria-invalid={error !== null}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className={`h-9 w-16 rounded-md border bg-background text-center tabular-nums outline-none [appearance:textfield] focus:border-blue [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                    error ? "border-pink" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => step(mode, 1)}
                  aria-label={`Aumentar ${MODES[mode].label}`}
                  className="size-9 rounded-md border border-border text-muted transition-colors hover:border-muted hover:text-foreground"
                >
                  +
                </button>
                <span className="w-8 text-sm text-muted">min</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
        <button
          type="button"
          onClick={handleReset}
          disabled={isDefault(settings.durations) && !dirty}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          restaurar padrões
        </button>
        <div className="flex items-center gap-3">
          {savedAt !== null && !dirty && (
            <span key={savedAt} className="text-sm text-green" role="status">
              ✓ salvo
            </span>
          )}
          <button
            type="submit"
            disabled={!valid || !dirty}
            className="rounded-lg bg-green px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            salvar
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        As mudanças valem a partir da próxima sessão; uma sessão já iniciada mantém a duração original.
      </p>
    </form>
  );
}
