import { getActiveStudyPlan } from "@aprendevest/db";
import Link from "next/link";
import { completeTask, recalculatePlan } from "../../actions/study-plan";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Meu plano" };

export default async function StudyPlanPage() {
  const user = await requireUser();
  const plan = await getActiveStudyPlan(user.userId);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meu plano</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Agenda flexível, sem punição por atraso.
          </p>
        </div>
        {plan ? (
          <form action={recalculatePlan}>
            <button className="rounded-lg border px-4 py-2 font-semibold">
              Replanejar semana
            </button>
          </form>
        ) : null}
      </div>
      {!plan ? (
        <section className="mt-8 rounded-xl border p-6">
          <h2 className="font-semibold">Comece pelo diagnóstico</h2>
          <p className="mt-2 text-sm">
            Uma autoavaliação curta cria sua primeira semana.
          </p>
          <Link
            href="/app/diagnostico"
            className="mt-4 inline-block font-semibold underline"
          >
            Fazer diagnóstico
          </Link>
        </section>
      ) : (
        <>
          <p className="mt-8 rounded-xl bg-[var(--color-surface-muted)] p-4 text-sm">
            <strong>Como priorizamos:</strong> {plan.explanation}
          </p>
          <ol className="mt-6 grid gap-4">
            {plan.tasks.map((task) => (
              <li key={task.id} className="rounded-xl border p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-[var(--color-secondary)]">
                      {task.kind} · {task.minutes} min
                    </span>
                    <h2 className="mt-1 font-semibold">{task.title}</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      {task.reason}
                    </p>
                  </div>
                  {task.status === "completed" ? (
                    <span className="font-semibold text-emerald-700">
                      Concluída
                    </span>
                  ) : (
                    <form action={completeTask}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <button className="rounded-lg border px-4 py-2 text-sm font-semibold">
                        Concluir
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
