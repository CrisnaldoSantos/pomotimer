import type { Metadata } from "next";
import { SettingsPanel } from "../components/settings-panel";

export const metadata: Metadata = {
  title: "Configurações — pomotimer",
};

export default function ConfiguracoesPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-mono text-2xl font-semibold">
          <span className="text-green">$</span> vim .pomotimerrc
        </h1>
        <p className="mt-1 text-sm text-muted">
          Duração de cada sessão, salva neste navegador.
        </p>
      </div>
      <SettingsPanel />
    </main>
  );
}
