import Link from "next/link";

import { requireUser } from "../../lib/auth/guards";

export const metadata = { title: "Hoje" };

export default async function StudentHomePage() {
  const user = await requireUser();

  return (
    <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
        Hoje
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Bom estudo, {user.displayName}
      </h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Sua próxima sessão aparecerá aqui após o diagnóstico.
      </p>

      <Link
        href="/materias"
        className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-[var(--color-primary)] p-6 text-white"
      >
        <div>
          <strong className="text-lg">Assistir aulas por matéria</strong>
          <p className="mt-1 text-sm text-white/85">
            Vídeo-aulas de Matemática, Português, Biologia, História, Química e
            Física, organizadas por tema.
          </p>
        </div>
        <span aria-hidden="true" className="text-2xl">
          →
        </span>
      </Link>

      {!user.onboardingCompletedAt ? (
        <section className="mt-10 rounded-xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
          <h2 className="font-semibold">Complete seu objetivo</h2>
          <p className="mt-1 text-sm">
            Precisamos do seu tempo disponível e vestibulares-alvo para montar a
            trilha.
          </p>
          <Link
            href="/boas-vindas"
            className="mt-4 inline-block font-semibold underline"
          >
            Continuar configuração
          </Link>
        </section>
      ) : (
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Link
            href="/app/perfil"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Perfil e privacidade</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Objetivos, dados e consentimentos.
            </p>
          </Link>
          <Link
            href="/aulas/funcoes-primeiros-passos"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Continuar aula</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Funções: primeiros passos.
            </p>
          </Link>
          <Link
            href="/app/plano"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Meu plano</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Diagnóstico, agenda e prioridades explicadas.
            </p>
          </Link>
          <Link
            href="/app/revisao"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Revisão</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Retome lacunas no momento certo.
            </p>
          </Link>
          <Link
            href="/app/desempenho"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Desempenho</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Domínio por tópico e evidências usadas.
            </p>
          </Link>
          <Link
            href="/app/simulados"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Simulados</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Cronômetro, autosave, correção e análise.
            </p>
          </Link>
          <Link
            href="/app/redacao"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <strong>Redação</strong>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Rascunhos privados e correção humana.
            </p>
          </Link>
        </section>
      )}
    </main>
  );
}
