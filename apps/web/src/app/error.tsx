"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="conteudo-principal" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">
        Não foi possível carregar esta etapa
      </h1>
      <p className="mt-3 text-[var(--color-text-muted)]">
        Seu progresso salvo foi preservado. Verifique a conexão e tente
        novamente.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Tentar novamente
      </button>
    </main>
  );
}
