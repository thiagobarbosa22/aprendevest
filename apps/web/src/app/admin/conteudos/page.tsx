import {
  listContentEditorOptions,
  listEditorialContent,
} from "@aprendevest/db";
import Link from "next/link";

import { LessonForm } from "../../_components/lesson-form";
import {
  approveContentAction,
  publishContentAction,
  submitContentAction,
} from "../../actions/content";
import { requirePermission } from "../../../lib/auth/guards";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conteúdos | Administração" };

export default async function ContentAdminPage() {
  await requirePermission("content:create");
  const [{ modules, topics }, items] = await Promise.all([
    listContentEditorOptions(),
    listEditorialContent(),
  ]);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/admin" className="text-sm text-[var(--color-primary)]">
        ← Voltar ao CMS
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Aulas e conteúdos</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Conteúdo estruturado, acessível e versionado. Use o seed para criar
        módulo e tópico iniciais.
      </p>
      <LessonForm modules={modules} topics={topics} />
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Workflow</h2>
        {items.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed p-6">
            Nenhum conteúdo cadastrado.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] p-4"
              >
                <div>
                  <strong>{item.title}</strong>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {item.status} · versão {item.version}
                  </p>
                </div>
                {item.status === "draft" ? (
                  <ActionForm
                    action={submitContentAction}
                    id={item.id}
                    label="Enviar para revisão"
                  />
                ) : item.status === "in_review" ? (
                  <ActionForm
                    action={approveContentAction}
                    id={item.id}
                    label="Aprovar"
                  />
                ) : item.status === "approved" ? (
                  <ActionForm
                    action={publishContentAction}
                    id={item.id}
                    label="Publicar"
                  />
                ) : (
                  <Link
                    href={`/aulas/${item.slug}`}
                    className="font-semibold underline"
                  >
                    Ver aula
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function ActionForm({
  action,
  id,
  label,
}: {
  action: (data: FormData) => Promise<void>;
  id: string;
  label: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="contentId" value={id} />
      <button className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white">
        {label}
      </button>
    </form>
  );
}
