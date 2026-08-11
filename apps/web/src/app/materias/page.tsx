import { listPublishedSubjects } from "@aprendevest/db";
import { Card } from "@aprendevest/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = { title: "Matérias" };

const areaLabels = {
  languages: "Linguagens",
  mathematics: "Matemática",
  natural_sciences: "Ciências da Natureza",
  human_sciences: "Ciências Humanas",
  interdisciplinary: "Interdisciplinares",
};

export default async function SubjectsPage() {
  const subjects = await listPublishedSubjects();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Início
      </Link>
      <h1 className="mt-8 text-4xl font-bold">Matérias</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Explore a hierarquia de conteúdos e avance respeitando pré-requisitos.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Link href={`/materias/${subject.slug}`}>
              <Card>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                  {areaLabels[subject.area]}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{subject.name}</h2>
                <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                  {subject.summary}
                </p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
