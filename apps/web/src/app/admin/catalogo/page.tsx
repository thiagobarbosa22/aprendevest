import { listEditorialExams } from "@aprendevest/db";
import Link from "next/link";

import { ExamForm } from "../../_components/exam-form";
import {
  approveExamAction,
  publishExamAction,
  submitExamForReviewAction,
} from "../../actions/catalog";
import { requirePermission } from "../../../lib/auth/guards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Catálogo | Administração" };

export default async function CatalogAdminPage() {
  await requirePermission("content:create");
  const exams = await listEditorialExams();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/admin" className="text-sm text-[var(--color-primary)]">
        ← Voltar ao CMS
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Catálogo de vestibulares</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Nenhum item é publicado sem fonte, direitos, autoria, revisão e versão.
      </p>
      <ExamForm />
      <section className="mt-12" aria-labelledby="itens-heading">
        <h2 id="itens-heading" className="text-xl font-semibold">
          Itens cadastrados
        </h2>
        {exams.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-[var(--color-border)] p-6">
            Nenhum vestibular cadastrado. Crie o primeiro rascunho acima.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr>
                  <th className="border-b p-3">Vestibular</th>
                  <th className="border-b p-3">Status</th>
                  <th className="border-b p-3">Versão</th>
                  <th className="border-b p-3">Ação</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="border-b p-3">
                      <strong>{exam.acronym}</strong>
                      <br />
                      {exam.name}
                    </td>
                    <td className="border-b p-3">{exam.status}</td>
                    <td className="border-b p-3">{exam.version}</td>
                    <td className="border-b p-3">
                      {exam.status === "draft" ? (
                        <form action={submitExamForReviewAction}>
                          <input type="hidden" name="examId" value={exam.id} />
                          <button className="rounded-lg bg-[var(--color-primary)] px-3 py-2 font-semibold text-white">
                            Enviar para revisão
                          </button>
                        </form>
                      ) : exam.status === "in_review" ? (
                        <form action={approveExamAction}>
                          <input type="hidden" name="examId" value={exam.id} />
                          <button className="rounded-lg bg-[var(--color-primary)] px-3 py-2 font-semibold text-white">
                            Aprovar
                          </button>
                        </form>
                      ) : exam.status === "approved" ? (
                        <form action={publishExamAction}>
                          <input type="hidden" name="examId" value={exam.id} />
                          <button className="rounded-lg bg-[var(--color-primary)] px-3 py-2 font-semibold text-white">
                            Publicar
                          </button>
                        </form>
                      ) : (
                        <Link
                          href={`/vestibulares/${exam.slug}`}
                          className="underline"
                        >
                          Ver página
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
