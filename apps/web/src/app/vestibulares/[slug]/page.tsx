import { getPublishedExam, listLiteraryWorks } from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const exam = await getPublishedExam(slug);
  if (!exam) notFound();
  const literaryWorks = (await listLiteraryWorks()).filter(
    (work) => work.examSlug === exam.slug,
  );
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/vestibulares"
        className="text-sm text-[var(--color-primary)]"
      >
        ← Todos os vestibulares
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
        {exam.acronym} · versão {exam.version}
      </p>
      <h1 className="mt-3 text-4xl font-bold">{exam.name}</h1>
      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        {exam.summary}
      </p>
      <dl className="mt-8 grid gap-4 rounded-xl border border-[var(--color-border)] p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">
            Instituição
          </dt>
          <dd className="font-semibold">{exam.institution}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Banca</dt>
          <dd className="font-semibold">{exam.board}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Região</dt>
          <dd className="font-semibold">{exam.region}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Direitos</dt>
          <dd className="font-semibold">{exam.rightsStatus}</dd>
        </div>
      </dl>
      <aside className="mt-8 rounded-xl bg-[var(--color-surface-muted)] p-6">
        <h2 className="font-semibold">Procedência</h2>
        <p className="mt-2 text-sm">
          Metadados verificados em fonte oficial. O AprendeVest não sugere
          parceria com a instituição.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <a
            className="font-semibold underline"
            href={exam.officialUrl}
            rel="noreferrer"
            target="_blank"
          >
            Site oficial
          </a>
          {exam.sourceUrl ? (
            <a
              className="font-semibold underline"
              href={exam.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              Fonte consultada
            </a>
          ) : null}
        </div>
      </aside>
      {literaryWorks.length ? (
        <section className="mt-8 rounded-xl border border-[var(--color-border)] p-6">
          <h2 className="font-semibold">
            Obras literárias obrigatórias · {literaryWorks[0]?.editionYear}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Lista divulgada pela própria instituição — muda a cada edição,
            confira sempre a fonte oficial antes de estudar.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {literaryWorks.map((work) => (
              <li
                key={work.id}
                className="rounded-lg bg-[var(--color-surface-muted)] p-4"
              >
                <strong className="block">{work.title}</strong>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {work.author}
                </p>
                {work.notes ? (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {work.notes}
                  </p>
                ) : null}
                <a
                  href={work.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs font-semibold underline"
                >
                  Fonte oficial
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
