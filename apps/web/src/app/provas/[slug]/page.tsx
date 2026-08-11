import { getPublishedPaper } from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamRunner } from "../../_components/exam-runner";
export const dynamic = "force-dynamic";
export default async function PaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const paper = await getPublishedPaper((await params).slug);
  if (!paper) notFound();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/provas">← Provas</Link>
      <h1 className="mt-8 text-3xl font-bold">{paper.title}</h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Versão {paper.version} · {paper.durationMinutes} minutos · direitos:{" "}
        {paper.rightsStatus}
      </p>
      <a
        href={paper.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block font-semibold underline"
      >
        Abrir fonte oficial
      </a>
      <div className="mt-8">
        <ExamRunner paperId={paper.id} />
      </div>
    </main>
  );
}
