import { listPublishedQuestions } from "@aprendevest/db";
import Link from "next/link";
import { QuestionRunner } from "../../_components/question-runner";
import { requireUser } from "../../../lib/auth/guards";

export const dynamic = "force-dynamic";
export default async function PracticePage() {
  await requireUser();
  const [question] = await listPublishedQuestions();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/app" className="text-sm text-[var(--color-primary)]">
        ← Hoje
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Prática</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Responda com calma. O erro é usado para recomendar revisão, nunca para
        punir.
      </p>
      <div className="mt-8">
        {question ? (
          <QuestionRunner question={question} />
        ) : (
          <p>Nenhuma questão publicada.</p>
        )}
      </div>
      <Link
        href="/app/caderno-de-erros"
        className="mt-6 inline-block font-semibold underline"
      >
        Abrir caderno de erros
      </Link>
    </main>
  );
}
