import Link from "next/link";

export const metadata = { title: "Simulados" };
export default function SimulationsPublicPage() {
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase text-[var(--color-secondary)]">
        Simulados
      </p>
      <h1 className="mt-2 text-4xl font-bold">Treine com tempo e análise</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">
        Monte sessões rápidas, personalizadas, adaptativas ou de reta final. O
        progresso é salvo automaticamente.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          "Cronômetro acessível",
          "Autosave e retomada",
          "Análise por tópico",
        ].map((item) => (
          <div key={item} className="rounded-xl border p-5 font-semibold">
            {item}
          </div>
        ))}
      </div>
      <Link
        href="/app/simulados"
        className="mt-8 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Criar simulado
      </Link>
    </main>
  );
}
