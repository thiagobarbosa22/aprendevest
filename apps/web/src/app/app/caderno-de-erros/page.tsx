import { listErrors } from "@aprendevest/db";
import Link from "next/link";
import { requireUser } from "../../../lib/auth/guards";

export const dynamic = "force-dynamic";
export default async function ErrorsPage() {
  const user = await requireUser();
  const errors = await listErrors(user.userId);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/app/pratica" className="text-sm text-[var(--color-primary)]">
        ← Prática
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Caderno de erros</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Revise o conceito e tente novamente; acertos futuros resolvem o item
        automaticamente.
      </p>
      {errors.length ? (
        <ul className="mt-8 grid gap-4">
          {errors.map((item) => (
            <li
              key={item.questionId}
              className="rounded-xl border border-[var(--color-border)] p-5"
            >
              <strong>{item.prompt}</strong>
              <p className="mt-3 text-sm leading-6">{item.resolution}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed p-6">
          Nenhum erro pendente. Continue praticando.
        </p>
      )}
    </main>
  );
}
