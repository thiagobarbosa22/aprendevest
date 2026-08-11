import { getPublishedSubject } from "@aprendevest/db";
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
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/materias" className="text-sm text-[var(--color-primary)]">
        ← Todas as matérias
      </Link>
      <h1 className="mt-8 text-4xl font-bold">{subject.name}</h1>
      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        {subject.summary}
      </p>
      <section className="mt-10 rounded-xl border border-dashed border-[var(--color-border)] p-8">
        <h2 className="text-xl font-semibold">Mapa de conteúdos</h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          Os módulos e tópicos publicados aparecerão aqui na Fase 3.
        </p>
      </section>
    </main>
  );
}
