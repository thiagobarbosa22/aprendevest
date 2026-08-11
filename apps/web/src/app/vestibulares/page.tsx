import { listPublishedExams } from "@aprendevest/db";
import { Card } from "@aprendevest/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Vestibulares",
  description: "Consulte formatos, fontes oficiais e trilhas por vestibular.",
};

export default async function ExamsPage() {
  const exams = await listPublishedExams();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Início
      </Link>
      <h1 className="mt-8 text-4xl font-bold">Vestibulares</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">
        Informações versionadas e verificadas em fontes oficiais. A cobertura
        cresce pelo CMS.
      </p>
      {exams.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed p-6">
          O catálogo ainda não tem itens publicados.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {exams.map((exam) => (
            <li key={exam.id}>
              <Link href={`/vestibulares/${exam.slug}`}>
                <Card>
                  <p className="text-sm font-semibold text-[var(--color-secondary)]">
                    {exam.acronym}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{exam.name}</h2>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {exam.institution} · {exam.region}
                  </p>
                  <p className="mt-4 text-sm">{exam.summary}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
