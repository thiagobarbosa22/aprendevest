import { listPublishedPapers } from "@aprendevest/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Provas anteriores" };

export default async function PapersPage() {
  const papers = await listPublishedPapers();
  const byExam = new Map<string, typeof papers>();
  for (const paper of papers) {
    const group = byExam.get(paper.acronym) ?? [];
    group.push(paper);
    byExam.set(paper.acronym, group);
  }

  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Início
      </Link>
      <h1 className="mt-8 text-4xl font-bold">Provas anteriores</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Links oficiais, direitos registrados e modo online com autosave.
      </p>
      {byExam.size === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed p-6">
          Nenhuma prova publicada ainda.
        </p>
      ) : (
        [...byExam.entries()].map(([acronym, examPapers]) => (
          <section key={acronym} className="mt-10">
            <h2 className="text-xl font-semibold">{acronym}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {examPapers
                .sort((a, b) => b.year - a.year)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/provas/${p.slug}`}
                      className="block rounded-xl border border-[var(--color-border)] p-5"
                    >
                      <strong>{p.title}</strong>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {p.year} · {p.durationMinutes} minutos
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
