import { isFeatureEnabled, listPublishedEssayThemes } from "@aprendevest/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = { title: "Redação" };
export default async function EssaysPublicPage() {
  if (!(await isFeatureEnabled("essays"))) notFound();
  const themes = await listPublishedEssayThemes();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase text-[var(--color-secondary)]">
        Redação
      </p>
      <h1 className="mt-2 text-4xl font-bold">
        Escreva, revise e acompanhe sua evolução
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--color-text-muted)]">
        Temas rastreáveis, versões privadas e correção humana. Apoio de IA não
        atribui nota oficial e permanece desligado no MVP.
      </p>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Temas disponíveis</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {themes.map((theme) => (
            <li key={theme.id} className="rounded-xl border p-5">
              <span className="text-xs font-semibold uppercase text-[var(--color-secondary)]">
                {theme.examLabel}
              </span>
              <h3 className="mt-2 font-semibold">{theme.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                {theme.prompt}
              </p>
              <a
                href={theme.sourceUrl}
                className="mt-3 inline-block text-sm font-semibold underline"
              >
                Fonte e autoria
              </a>
            </li>
          ))}
        </ul>
      </section>
      <Link
        href="/app/redacao"
        className="mt-8 inline-block rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Começar redação
      </Link>
    </main>
  );
}
