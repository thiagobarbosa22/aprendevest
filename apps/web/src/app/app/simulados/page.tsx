import {
  enemYears,
  listExamsWithPracticeQuestions,
  listSimulationHistory,
} from "@aprendevest/db";
import Link from "next/link";
import { EnemSimulationRunner } from "../../_components/enem-simulation-runner";
import { SimulationRunner } from "../../_components/simulation-runner";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Meus simulados" };
export default async function SimulationsPage() {
  const user = await requireUser();
  const [history, exams] = await Promise.all([
    listSimulationHistory(user.userId),
    listExamsWithPracticeQuestions(),
  ]);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Simulados</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Prova completa do ENEM com questões oficiais, ou prática rápida filtrada
        por vestibular.
      </p>
      <EnemSimulationRunner years={enemYears} />
      <h2 className="mt-12 text-xl font-semibold">Prática rápida</h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Sessões menores, com questões autorais de prática por vestibular.
      </p>
      <SimulationRunner exams={exams} />
      {history.length ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Histórico</h2>
          <ul className="mt-4 grid gap-3">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap justify-between rounded-xl border p-4"
              >
                <span>
                  {item.mode} · {item.status}
                </span>
                <strong>
                  {item.result
                    ? `${item.result.accuracyPercent}%`
                    : "Em andamento"}
                </strong>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
