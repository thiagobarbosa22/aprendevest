import { listDiagnosticTopics } from "@aprendevest/db";
import Link from "next/link";
import { submitDiagnostic } from "../../actions/study-plan";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Diagnóstico" };

export default async function DiagnosticPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireUser();
  const topics = await listDiagnosticTopics();
  const { erro } = await searchParams;
  return (
    <main id="conteudo-principal" className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Diagnóstico rápido</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Informe como você se sente em cada tópico. Isso não é uma nota e pode
        ser redefinido.
      </p>
      {erro ? (
        <p role="alert" className="mt-4 text-red-700">
          Responda ao menos um tópico.
        </p>
      ) : null}
      {!topics.length ? (
        <p className="mt-8 rounded-xl border p-5">
          O catálogo ainda não tem tópicos publicados.
        </p>
      ) : (
        <form action={submitDiagnostic} className="mt-8 grid gap-6">
          {topics.map((topic) => (
            <fieldset key={topic.id} className="rounded-xl border p-5">
              <legend className="px-2 font-semibold">{topic.name}</legend>
              <p className="mb-4 text-sm text-[var(--color-text-muted)]">
                {topic.summary}
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Não conheço",
                  "Iniciante",
                  "Em progresso",
                  "Seguro",
                  "Domino",
                ].map((label, index) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      required
                      type="radio"
                      name={`topic:${topic.id}`}
                      value={index}
                    />{" "}
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white">
            Gerar meu plano
          </button>
        </form>
      )}
    </main>
  );
}
