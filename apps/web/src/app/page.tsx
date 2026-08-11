import { listPublishedSubjects } from "@aprendevest/db";
import { Card, ProgressBar } from "@aprendevest/ui";
import Image from "next/image";
import Link from "next/link";

import logoPrincipal from "../../../../fotos/logoprincipal.jpg";

import { SubjectIcon } from "./_components/subject-icon";
import { mockExamCatalog } from "./_mock/exam-catalog";
import { HealthStatus } from "./health-status";

const priorityLabel: Record<
  (typeof mockExamCatalog)[number]["priority"],
  string
> = {
  P0: "Cobertura inicial",
  P1: "Próxima expansão",
  P2: "Cadastro contínuo",
};

const areaLabels: Record<string, string> = {
  languages: "Linguagens",
  mathematics: "Matemática",
  natural_sciences: "Ciências da Natureza",
  human_sciences: "Ciências Humanas",
  interdisciplinary: "Interdisciplinares",
};

export default async function HomePage() {
  const subjects = await listPublishedSubjects();

  return (
    <>
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="AprendeVest.com — página inicial"
            className="inline-flex rounded-sm"
          >
            <Image
              src={logoPrincipal}
              alt="AprendeVest.com"
              className="h-auto w-36 sm:w-44"
              sizes="(min-width: 640px) 176px, 144px"
              preload
            />
          </Link>
          <nav
            aria-label="Navegação principal"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--color-text)]"
          >
            <Link
              href="/materias"
              className="hover:text-[var(--color-primary)]"
            >
              Matérias
            </Link>
            <Link
              href="/vestibulares"
              className="hover:text-[var(--color-primary)]"
            >
              Vestibulares
            </Link>
            <Link
              href="/questoes"
              className="hover:text-[var(--color-primary)]"
            >
              Questões
            </Link>
            <Link
              href="/simulados"
              className="hover:text-[var(--color-primary)]"
            >
              Simulados
            </Link>
            <Link href="/redacao" className="hover:text-[var(--color-primary)]">
              Redação
            </Link>
          </nav>
          <HealthStatus />
        </div>
      </header>

      <section
        aria-labelledby="hero-heading"
        className="border-b border-[var(--color-border)] bg-[var(--color-primary)] px-6 py-16 text-white sm:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
            Preparação orientada · gratuito
          </p>
          <h1
            id="hero-heading"
            className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Organize seus estudos para o vestibular
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/85">
            Aulas em vídeo, prática, revisão e acompanhamento em uma jornada só,
            adaptada ao seu objetivo e ao tempo que você tem disponível. Sem
            prometer aprovação — com progresso que você consegue ver.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/cadastro"
              className="inline-flex min-h-11 items-center rounded-lg bg-[var(--color-accent)] px-5 py-3 font-semibold text-white hover:brightness-110"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/materias"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/40 px-5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Ver aulas por matéria
            </Link>
          </div>
        </div>
      </section>

      <main id="conteudo-principal" className="mx-auto max-w-6xl px-6 py-16">
        <section aria-labelledby="materias-heading">
          <h2 id="materias-heading" className="text-lg font-semibold">
            Aulas por matéria
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Cada matéria reúne vídeo-aulas por tema — comece pelo que precisa
            reforçar agora.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {subjects.map((subject) => (
              <li key={subject.id}>
                <Link href={`/materias/${subject.slug}`}>
                  <Card interactive className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <SubjectIcon area={subject.area} className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
                        {areaLabels[subject.area] ?? subject.area}
                      </p>
                      <p className="mt-1 text-base font-semibold">
                        {subject.name}
                      </p>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="fase-heading" className="mt-16 max-w-md">
          <h2 id="fase-heading" className="mb-3 text-lg font-semibold">
            Progresso da fundação técnica
          </h2>
          <ProgressBar
            value={2}
            max={10}
            label="Fases do plano técnico concluídas"
          />
        </section>

        <section aria-labelledby="catalogo-heading" className="mt-16">
          <h2 id="catalogo-heading" className="text-lg font-semibold">
            Cobertura inicial de vestibulares
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Dados de exemplo — o catálogo real chega na Fase 2, com fonte,
            edital e trilha por vestibular.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {mockExamCatalog.map((exam) => (
              <li key={exam.slug}>
                <Card>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                    {priorityLabel[exam.priority]}
                  </p>
                  <p className="mt-2 text-base font-semibold">{exam.name}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {exam.institution}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="como-funciona-heading" className="mt-16">
          <h2 id="como-funciona-heading" className="text-lg font-semibold">
            Como a jornada funciona
          </h2>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <li>
              <Card>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  1. Diagnóstico
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Um diagnóstico curto entende onde você está em cada matéria.
                </p>
              </Card>
            </li>
            <li>
              <Card>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  2. Plano
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Um plano semanal combina teoria, prática, revisão e simulado.
                </p>
              </Card>
            </li>
            <li>
              <Card>
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  3. Evolução
                </p>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  Erros viram revisão agendada; seu progresso fica visível a
                  qualquer momento.
                </p>
              </Card>
            </li>
          </ol>
        </section>
      </main>

      <footer className="mt-16 border-t border-[var(--color-border)] px-6 py-8">
        <p className="mx-auto max-w-6xl text-sm text-[var(--color-text-muted)]">
          AprendeVest está em construção. Dados pessoais têm controle de
          exportação e exclusão.
        </p>
      </footer>
    </>
  );
}
