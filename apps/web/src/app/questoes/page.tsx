import { listPublishedQuestions } from "@aprendevest/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banco de questões" };
export default async function QuestionsPage() {
  const questions = await listPublishedQuestions();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Início
      </Link>
      <h1 className="mt-8 text-4xl font-bold">Banco de questões</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Questões autorais ou com procedência registrada. Entre para responder e
        salvar suas tentativas.
      </p>
      <ul className="mt-8 grid gap-4">
        {questions.map((question) => (
          <li
            key={question.id}
            className="rounded-xl border border-[var(--color-border)] p-5"
          >
            <p className="text-sm font-semibold text-[var(--color-secondary)]">
              {question.topicName}
            </p>
            <p className="mt-2">{question.prompt}</p>
          </li>
        ))}
      </ul>
      <Link
        href="/app/pratica"
        className="mt-8 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Começar prática
      </Link>
    </main>
  );
}
