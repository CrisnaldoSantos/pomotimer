import type { Metadata } from "next";
import { CyclesHistory } from "../components/cycles-history";

export const metadata: Metadata = {
  title: "Ciclos — pomotimer",
};

export default function CiclosPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-mono text-2xl font-semibold">
          <span className="text-green">$</span> git log --cycles
        </h1>
        <p className="mt-1 text-sm text-muted">
          Histórico de sessões salvo neste navegador.
        </p>
      </div>
      <CyclesHistory />
    </main>
  );
}
