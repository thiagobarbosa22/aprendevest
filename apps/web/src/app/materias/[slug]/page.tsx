import { getPublishedSubject, listPublishedLessons } from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const subject = await getPublishedSubject((await params).slug);
  if (!subject) notFound();
  const lessons = await listPublishedLessons(subject.slug);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/materias" className="text-sm text-[var(--color-primary)]">
        ← Todas as matérias
      </Link>
      <h1 className="mt-8 text-4xl font-bold">{subject.name}</h1>
      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        {subject.summary}
      </p>
      <section className="mt-10 rounded-xl border border-[var(--color-border)] p-8">
        <h2 className="text-xl font-semibold">Mapa de conteúdos</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {lessons.length
            ? "Comece por uma aula publicada e acompanhe seu progresso."
            : "Nenhuma aula publicada ainda."}
        </p>
        <ul className="mt-6 grid gap-3">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/aulas/${lesson.slug}`}
                className="block rounded-lg bg-[var(--color-surface-muted)] p-4"
              >
                <strong>{lesson.title}</strong>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {lesson.estimatedMinutes} min · {lesson.summary}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
