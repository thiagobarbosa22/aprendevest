import { Button, Card, ProgressBar } from "@aprendevest/ui";
import Image from "next/image";
import Link from "next/link";

import logoPrincipal from "../../../../fotos/logoprincipal.jpg";

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

export default function HomePage() {
  return (
    <>
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
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
          <HealthStatus />
        </div>
      </header>

      <main id="conteudo-principal" className="mx-auto max-w-5xl px-6 py-16">
        <section aria-labelledby="hero-heading" className="flex flex-col gap-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--color-secondary)]">
            Fase 0 · fundação
          </p>
          <h1
            id="hero-heading"
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Organize seus estudos para o vestibular
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
            Teoria, prática, revisão e acompanhamento em uma jornada só,
            adaptada ao seu objetivo e ao tempo que você tem disponível. Sem
            prometer aprovação — com progresso que você consegue ver.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" disabled>
              Criar conta (chega na Fase 1)
            </Button>
            <Button variant="ghost" disabled>
              Já tenho conta
            </Button>
          </div>
        </section>

        <section aria-labelledby="fase-heading" className="mt-16 max-w-md">
          <h2 id="fase-heading" className="mb-3 text-lg font-semibold">
            Progresso da fundação técnica
          </h2>
          <ProgressBar
            value={1}
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
        <p className="mx-auto max-w-5xl text-sm text-[var(--color-text-muted)]">
          AprendeVest está em construção. Nenhum dado pessoal é coletado nesta
          fase.
        </p>
      </footer>
    </>
  );
}
