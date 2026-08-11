import { getPerformance } from "@aprendevest/db";
import Link from "next/link";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Desempenho" };
export default async function PerformancePage() {
  const user = await requireUser();
  const metrics = await getPerformance(user.userId);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Desempenho</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Estimativas explicáveis, não uma previsão de aprovação.
      </p>
      {!metrics.length ? (
        <section className="mt-8 rounded-xl border p-6">
          <p>Faça o diagnóstico e pratique para gerar evidências.</p>
          <Link
            className="mt-3 inline-block font-semibold underline"
            href="/app/diagnostico"
          >
            Iniciar diagnóstico
          </Link>
        </section>
      ) : (
        <ul className="mt-8 grid gap-4">
          {metrics.map((metric) => (
            <li key={metric.topicId} className="rounded-xl border p-5">
              <div className="flex justify-between">
                <strong>{metric.topic}</strong>
                <span>{metric.estimatePercent}%</span>
              </div>
              <div
                className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200"
                role="progressbar"
                aria-label={`Domínio em ${metric.topic}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={metric.estimatePercent}
              >
                <div
                  className="h-full bg-[var(--color-secondary)]"
                  style={{ width: `${metric.estimatePercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Baseado em {metric.evidenceCount} evidência(s). Ações futuras
                refinam a estimativa.
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
