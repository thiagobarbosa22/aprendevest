import { listPublishedQuestions } from "@aprendevest/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banco de questões" };

const difficultyLabel: Record<number, string> = {
  1: "Fácil",
  2: "Médio",
  3: "Difícil",
};
const difficultyOrder = [1, 2, 3];

export default async function QuestionsPage() {
  const questions = await listPublishedQuestions();
  const byDifficulty = difficultyOrder
    .map((level) => ({
      level,
      items: questions.filter((question) => question.difficulty === level),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Início
      </Link>
      <h1 className="mt-8 text-4xl font-bold">Banco de questões</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Questões autorais ou com procedência registrada, organizadas por nível.
        Entre para responder e salvar suas tentativas.
      </p>
      {byDifficulty.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed p-6">
          Nenhuma questão publicada ainda.
        </p>
      ) : (
        byDifficulty.map((group) => (
          <section key={group.level} className="mt-10">
            <h2 className="text-xl font-semibold">
              {difficultyLabel[group.level] ?? `Nível ${group.level}`}
            </h2>
            <ul className="mt-4 grid gap-4">
              {group.items.map((question) => (
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
          </section>
        ))
      )}
      <Link
        href="/app/pratica"
        className="mt-10 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Começar prática
      </Link>
    </main>
  );
}
