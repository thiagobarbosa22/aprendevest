import {
  isFeatureEnabled,
  listPublishedEssayThemes,
  listUserEssays,
} from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEssayAction, saveEssayAction } from "../../actions/essay";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Minhas redações" };
export default async function StudentEssaysPage({
  searchParams,
}: {
  searchParams: Promise<{ salvo?: string; erro?: string }>;
}) {
  const user = await requireUser();
  if (!(await isFeatureEnabled("essays", user.userId))) notFound();
  const [themes, submissions, params] = await Promise.all([
    listPublishedEssayThemes(),
    listUserEssays(user.userId),
    searchParams,
  ]);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Minhas redações</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Seu texto é privado e retido por até dois anos; você pode excluí-lo
        quando quiser.
      </p>
      {params.salvo ? (
        <p
          role="status"
          className="mt-4 rounded-lg bg-emerald-50 p-3 text-emerald-900"
        >
          Redação salva.
        </p>
      ) : null}
      {params.erro ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-900">
          Revise título e texto antes de salvar.
        </p>
      ) : null}
      {themes.length ? (
        <form
          action={saveEssayAction}
          className="mt-8 grid gap-4 rounded-xl border p-6"
        >
          <h2 className="text-xl font-semibold">Novo texto</h2>
          <label className="grid gap-2 text-sm">
            Tema
            <select name="themeId" required className="rounded-lg border p-3">
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Título
            <input
              name="title"
              required
              minLength={3}
              maxLength={160}
              className="rounded-lg border p-3"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Texto
            <textarea
              name="text"
              required
              minLength={30}
              maxLength={20000}
              rows={16}
              className="rounded-lg border p-3"
              aria-describedby="privacidade-redacao"
            />
          </label>
          <p
            id="privacidade-redacao"
            className="text-xs text-[var(--color-text-muted)]"
          >
            Não inclua nome completo, documentos ou outros dados pessoais no
            texto.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              name="intent"
              value="draft"
              className="rounded-lg border px-5 py-3 font-semibold"
            >
              Salvar rascunho
            </button>
            <button
              name="intent"
              value="submit"
              className="rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
            >
              Enviar para correção humana
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-8 rounded-xl border p-5">Nenhum tema publicado.</p>
      )}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Histórico</h2>
        {!submissions.length ? (
          <p className="mt-4 rounded-xl border p-5">
            Você ainda não salvou redações.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {submissions.map((item) => (
              <li key={item.id} className="rounded-xl border p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase text-[var(--color-secondary)]">
                      {item.status} · {item.wordCount} palavras
                    </span>
                    <h3 className="mt-1 font-semibold">{item.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {item.themeTitle}
                    </p>
                  </div>
                  <form action={deleteEssayAction}>
                    <input type="hidden" name="submissionId" value={item.id} />
                    <button className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800">
                      Excluir texto
                    </button>
                  </form>
                </div>
                {item.generalComment ? (
                  <p className="mt-4 rounded-lg bg-[var(--color-surface-muted)] p-3 text-sm">
                    <strong>Correção:</strong> {item.generalComment}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
