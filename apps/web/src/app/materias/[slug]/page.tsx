import { getPublishedSubject, listPublishedLessons } from "@aprendevest/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { toYoutubeThumbnailUrl } from "../../../lib/youtube";
import { SubjectIcon } from "../../_components/subject-icon";

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const subject = await getPublishedSubject((await params).slug);
  if (!subject) notFound();
  const lessons = await listPublishedLessons(subject.slug);
  const byFrente = new Map<string, typeof lessons>();
  for (const lesson of lessons) {
    const key = lesson.frenteName ?? "Outros temas";
    const group = byFrente.get(key) ?? [];
    group.push(lesson);
    byFrente.set(key, group);
  }
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/materias" className="text-sm text-[var(--color-primary)]">
        ← Todas as matérias
      </Link>
      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <SubjectIcon area={subject.area} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-4xl font-bold">{subject.name}</h1>
          <p className="mt-2 max-w-2xl text-lg text-[var(--color-text-muted)]">
            {subject.summary}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Aulas em vídeo</h2>
        <p className="mt-1 text-[var(--color-text-muted)]">
          {lessons.length
            ? "Escolha uma frente e um tema, e assista direto por aqui — sem sair do site."
            : "Nenhuma aula publicada ainda."}
        </p>
        {[...byFrente.entries()].map(([frenteName, frenteLessons]) => (
          <div key={frenteName} className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
              Frente: {frenteName}
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {frenteLessons.map((lesson) => {
                const thumbnail = lesson.mediaUrl
                  ? toYoutubeThumbnailUrl(lesson.mediaUrl)
                  : null;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/aulas/${lesson.slug}`}
                      className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                    >
                      <div className="relative aspect-video bg-[var(--color-surface-muted)]">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                            className="object-cover"
                          />
                        ) : null}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-90 transition group-hover:bg-black/35">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[var(--color-primary)] shadow">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="ml-0.5 h-5 w-5"
                              aria-hidden="true"
                            >
                              <path d="M8 5v14l11-7-11-7Z" />
                            </svg>
                          </span>
                        </span>
                        <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-semibold text-white">
                          {lesson.estimatedMinutes} min
                        </span>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                          Módulo: {lesson.topicName}
                        </p>
                        <strong className="mt-1 block leading-snug">
                          {lesson.title}
                        </strong>
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-muted)]">
                          {lesson.summary}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
