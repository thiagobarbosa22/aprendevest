import { listPublishedPapers } from "@aprendevest/db";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata = { title: "Provas anteriores" };
export default async function PapersPage() {
  const papers = await listPublishedPapers();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/">← Início</Link>
      <h1 className="mt-8 text-4xl font-bold">Provas anteriores</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Links oficiais, direitos registrados e modo online com autosave.
      </p>
      <ul className="mt-8 grid gap-4">
        {papers.map((p) => (
          <li key={p.id}>
            <Link
              href={`/provas/${p.slug}`}
              className="block rounded-xl border p-5"
            >
              <strong>{p.title}</strong>
              <p className="mt-2 text-sm">
                {p.acronym} · {p.year} · {p.durationMinutes} minutos
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
