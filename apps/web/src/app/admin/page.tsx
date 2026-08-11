import Link from "next/link";

import { requirePermission } from "../../lib/auth/guards";

export const metadata = { title: "Administração" };

export default async function AdminPage() {
  await requirePermission("content:create");
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
        CMS
      </p>
      <h1 className="mt-2 text-3xl font-bold">Administração editorial</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/catalogo"
          className="rounded-xl border border-[var(--color-border)] p-6"
        >
          <strong>Catálogo</strong>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Vestibulares, matérias, tópicos e versões.
          </p>
        </Link>
        <div className="rounded-xl border border-[var(--color-border)] p-6">
          <strong>Conteúdo</strong>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Disponível na Fase 3.
          </p>
        </div>
      </div>
    </main>
  );
}
