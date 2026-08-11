import type { ContentBlock } from "@aprendevest/contracts";
import {
  getContentProgress,
  getPublishedLesson,
  listContentNotes,
} from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "../../../lib/auth/session";
import { toYoutubeEmbedUrl } from "../../../lib/youtube";
import { LessonProgress } from "../../_components/lesson-progress";

export const dynamic = "force-dynamic";

const levelLabel: Record<string, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

const pedagogicalTypeLabel: Record<string, string> = {
  teoria: "Teoria",
  exercicios: "Exercícios",
  revisao: "Revisão",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const lesson = await getPublishedLesson((await params).slug);
  if (!lesson) notFound();
  const user = await getCurrentUser();
  const progress = user
    ? await getContentProgress(user.userId, lesson.id)
    : null;
  const notes = user ? await listContentNotes(user.userId, lesson.id) : [];
  return (
    <main id="conteudo-principal" className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href={`/materias/${lesson.subjectSlug}`}
        className="text-sm text-[var(--color-primary)]"
      >
        ← {lesson.subjectName}
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
            {lesson.subjectName}
            {lesson.frenteName ? ` · ${lesson.frenteName}` : ""} ·{" "}
            {lesson.topicName} · {lesson.estimatedMinutes} min
          </p>
          <h1 className="mt-3 text-4xl font-bold">{lesson.title}</h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">
            {lesson.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[var(--color-primary)]">
              {levelLabel[lesson.level] ?? lesson.level}
            </span>
            <span className="rounded-full bg-[var(--color-secondary)]/10 px-3 py-1 text-[var(--color-secondary)]">
              {pedagogicalTypeLabel[lesson.pedagogicalType] ??
                lesson.pedagogicalType}
            </span>
            {lesson.examTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-[var(--color-accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
          {lesson.prerequisiteSummary ? (
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              <strong>Pré-requisito:</strong> {lesson.prerequisiteSummary}
            </p>
          ) : null}
          {lesson.mediaUrl && toYoutubeEmbedUrl(lesson.mediaUrl) ? (
            <div className="mt-8 aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                className="h-full w-full"
                src={toYoutubeEmbedUrl(lesson.mediaUrl) ?? undefined}
                title={lesson.title}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
          <section className="mt-8 rounded-xl bg-[var(--color-surface-muted)] p-6">
            <h2 className="font-semibold">Ao final, você será capaz de</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {lesson.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </section>
          <div className="mt-10 space-y-6">
            {lesson.body.map((block, index) => (
              <ContentBlockView key={`${block.type}-${index}`} block={block} />
            ))}
          </div>
          <details className="mt-10 rounded-xl border border-[var(--color-border)] p-5">
            <summary className="cursor-pointer font-semibold">
              Versão acessível em texto
            </summary>
            <p className="mt-4 leading-7">{lesson.accessibleText}</p>
          </details>
          <footer className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-text-muted)]">
            <p>
              Versão editorial {lesson.version} · direitos:{" "}
              {lesson.rightsStatus}
            </p>
            <a
              href={lesson.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-semibold underline"
            >
              Fonte consultada
            </a>
          </footer>
        </article>
        <div>
          {user ? (
            <LessonProgress
              contentId={lesson.id}
              initialPercent={progress?.percent ?? 0}
              initialNotes={notes.map((note) => ({
                id: note.id,
                body: note.body,
                timestampSeconds: note.timestampSeconds,
              }))}
            />
          ) : (
            <aside className="rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="font-semibold">Salve seu progresso</h2>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Entre para retomar esta aula em qualquer dispositivo.
              </p>
              <Link
                href="/entrar"
                className="mt-4 inline-block rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
              >
                Entrar
              </Link>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

function ContentBlockView({ block }: { block: ContentBlock }) {
  if (block.type === "heading")
    return <h2 className="pt-3 text-2xl font-semibold">{block.text}</h2>;
  if (block.type === "paragraph")
    return <p className="text-lg leading-8">{block.text}</p>;
  if (block.type === "example")
    return (
      <section className="rounded-xl border-l-4 border-[var(--color-secondary)] bg-[var(--color-surface-muted)] p-5">
        <h3 className="font-semibold">{block.title}</h3>
        <p className="mt-2 leading-7">{block.text}</p>
      </section>
    );
  if (block.type === "formula")
    return (
      <figure className="rounded-xl border border-[var(--color-border)] p-5">
        <code className="text-lg font-semibold">{block.expression}</code>
        <figcaption className="mt-2 text-sm text-[var(--color-text-muted)]">
          {block.description}
        </figcaption>
      </figure>
    );
  return (
    <details className="rounded-xl border border-[var(--color-border)] p-5">
      <summary className="cursor-pointer font-semibold">
        Cheque sua compreensão: {block.question}
      </summary>
      <p className="mt-3">{block.answer}</p>
    </details>
  );
}
