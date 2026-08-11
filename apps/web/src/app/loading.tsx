export default function Loading() {
  return (
    <main
      id="conteudo-principal"
      className="mx-auto max-w-5xl animate-pulse px-6 py-12"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <div className="h-8 w-2/3 rounded bg-slate-200" />
      <div className="mt-5 h-4 w-full rounded bg-slate-200" />
      <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
    </main>
  );
}
