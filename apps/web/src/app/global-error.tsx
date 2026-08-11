"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main
          style={{
            maxWidth: 640,
            margin: "4rem auto",
            padding: "1.5rem",
            fontFamily: "sans-serif",
          }}
        >
          <h1>O AprendeVest encontrou uma falha</h1>
          <p>
            Recarregue esta etapa. Respostas com autosave permanecem guardadas
            no dispositivo.
          </p>
          <button onClick={reset}>Tentar novamente</button>
        </main>
      </body>
    </html>
  );
}
