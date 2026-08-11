"use client";

import { useEffect, useRef, useState } from "react";

type Alternative = { letter: string; text: string | null; file: string | null };
type Question = {
  index: number;
  discipline: string;
  language: string | null;
  context: string | null;
  files: string[];
  alternativesIntroduction: string;
  alternatives: Alternative[];
};
type Result = {
  total: number;
  answered: number;
  correct: number;
  accuracyPercent: number;
  byDiscipline: Record<string, { total: number; correct: number }>;
};

const disciplines = [
  { value: "linguagens", label: "Linguagens, Códigos e suas Tecnologias" },
  { value: "ciencias-humanas", label: "Ciências Humanas e suas Tecnologias" },
  {
    value: "ciencias-natureza",
    label: "Ciências da Natureza e suas Tecnologias",
  },
  { value: "matematica", label: "Matemática e suas Tecnologias" },
];

export function EnemSimulationRunner({ years }: { years: number[] }) {
  const [runId, setRunId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [year, setYear] = useState(years[0] ?? 2023);
  const [discipline, setDiscipline] = useState("linguagens");
  const [language, setLanguage] = useState<"ingles" | "espanhol">("ingles");
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    if (!runId || result) return;
    const clock = window.setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt.current) / 1000)),
      1_000,
    );
    return () => window.clearInterval(clock);
  }, [runId, result]);

  useEffect(() => {
    if (!runId || !Object.keys(answers).length || result) return;
    window.localStorage.setItem(
      `enem-simulation:${runId}`,
      JSON.stringify(answers),
    );
    const autosave = window.setTimeout(async () => {
      const response = await fetch(`/api/v1/enem-simulations/${runId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          elapsedSeconds: Math.round((Date.now() - startedAt.current) / 1000),
          submit: false,
        }),
      });
      setStatus(
        response.ok
          ? "Respostas salvas automaticamente."
          : "Offline: respostas preservadas neste dispositivo.",
      );
    }, 800);
    return () => window.clearTimeout(autosave);
  }, [answers, result, runId]);

  async function start() {
    setLoading(true);
    setStatus("Carregando a prova oficial do ENEM…");
    const response = await fetch("/api/v1/enem-simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, discipline, language }),
    });
    setLoading(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setStatus(data?.error ?? "Não foi possível carregar a prova agora.");
      return;
    }
    const data = (await response.json()) as {
      run: { id: string; answers: Record<string, string> };
      questions: Question[];
    };
    setRunId(data.run.id);
    setQuestions(data.questions);
    setAnswers(data.run.answers);
    startedAt.current = Date.now();
    setElapsed(0);
    setStatus("Prova em andamento.");
  }

  async function finish() {
    const response = await fetch(`/api/v1/enem-simulations/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, elapsedSeconds: elapsed, submit: true }),
    });
    if (!response.ok)
      return setStatus("Não foi possível finalizar. Tente novamente.");
    const data = (await response.json()) as { result: Result };
    setResult(data.result);
    window.localStorage.removeItem(`enem-simulation:${runId}`);
    setStatus("Prova finalizada.");
  }

  if (!runId)
    return (
      <section className="mt-8 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Prova completa do ENEM</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Questões oficiais de provas anteriores, via base pública{" "}
          <a
            href="https://enem.dev"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            enem.dev
          </a>{" "}
          — não é um sorteio de 10 questões, é a área inteira daquele ano.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm">
            Ano
            <select
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
              className="rounded-lg border p-2"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Área
            <select
              value={discipline}
              onChange={(event) => setDiscipline(event.target.value)}
              className="rounded-lg border p-2"
            >
              {disciplines.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          {discipline === "linguagens" ? (
            <label className="grid gap-2 text-sm">
              Língua estrangeira
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as "ingles" | "espanhol")
                }
                className="rounded-lg border p-2"
              >
                <option value="ingles">Inglês</option>
                <option value="espanhol">Espanhol</option>
              </select>
            </label>
          ) : null}
        </div>
        <button
          onClick={start}
          disabled={loading}
          className="mt-5 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Carregando…" : "Iniciar prova completa"}
        </button>
        <p role="status" className="mt-3 text-sm">
          {status}
        </p>
      </section>
    );

  if (result)
    return (
      <section
        className="mt-8 rounded-xl border p-6"
        aria-labelledby="resultado-enem"
      >
        <h2 id="resultado-enem" className="text-2xl font-bold">
          Resultado — ENEM {year}
        </h2>
        <p className="mt-4 text-4xl font-bold text-[var(--color-secondary)]">
          {result.accuracyPercent}%
        </p>
        <p className="mt-2">
          {result.correct} acertos em {result.total} questões; {result.answered}{" "}
          respondidas.
        </p>
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Use este resultado para orientar a revisão; ele não representa
          probabilidade de aprovação.
        </p>
      </section>
    );

  return (
    <section className="mt-8">
      <div className="sticky top-2 z-10 flex flex-wrap justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <p className="font-semibold">
          Tempo: {Math.floor(elapsed / 60)}:
          {String(elapsed % 60).padStart(2, "0")}
        </p>
        <p role="status" className="text-sm">
          {status}
        </p>
      </div>
      <ol className="mt-6 grid gap-6">
        {questions.map((question) => (
          <li key={question.index} className="rounded-xl border p-5">
            <strong>Questão {question.index}</strong>
            {question.context ? (
              <QuestionText className="mt-3" text={question.context} />
            ) : null}
            <QuestionText
              className="mt-3 font-semibold"
              text={question.alternativesIntroduction}
            />
            <div className="mt-4 grid gap-2">
              {question.alternatives.map((alternative) => (
                <label key={alternative.letter} className="flex gap-2">
                  <input
                    type="radio"
                    name={`q-${question.index}`}
                    checked={
                      answers[String(question.index)] === alternative.letter
                    }
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [String(question.index)]: alternative.letter,
                      }))
                    }
                  />
                  <span>
                    {alternative.letter}.{" "}
                    {alternative.text ?? (alternative.file ? "(imagem)" : "")}
                    {alternative.file ? (
                      // eslint-disable-next-line @next/next/no-img-element -- arbitrary external source, can't use next/image
                      <img
                        src={alternative.file}
                        alt=""
                        className="mt-1 max-w-xs"
                      />
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button
        onClick={finish}
        className="mt-6 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
      >
        Finalizar e corrigir
      </button>
    </section>
  );
}

function QuestionText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/!\[[^\]]*\]\(([^)]+)\)/g);
  return (
    <p className={`whitespace-pre-line leading-7 ${className ?? ""}`}>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          // odd indexes are the captured image URL from the regex split
          // eslint-disable-next-line @next/next/no-img-element
          <img key={index} src={part} alt="" className="my-2 max-w-full" />
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </p>
  );
}
