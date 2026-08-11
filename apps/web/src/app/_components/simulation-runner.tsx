"use client";

import { useEffect, useRef, useState } from "react";

type Question = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
};
type Result = {
  total: number;
  answered: number;
  correct: number;
  accuracyPercent: number;
};

type ExamOption = { slug: string; acronym: string };

export function SimulationRunner({ exams = [] }: { exams?: ExamOption[] }) {
  const [runId, setRunId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mode, setMode] = useState("quick");
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [examSlug, setExamSlug] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState("");
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
    window.localStorage.setItem(`simulation:${runId}`, JSON.stringify(answers));
    const autosave = window.setTimeout(async () => {
      const response = await fetch(`/api/v1/simulations/${runId}`, {
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
    setStatus("Preparando questões...");
    const response = await fetch("/api/v1/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        questionCount,
        durationMinutes,
        examSlug: examSlug || undefined,
      }),
    });
    if (!response.ok) {
      setStatus(
        "Não foi possível iniciar. Entre na conta e confira o catálogo.",
      );
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
    setStatus("Simulado em andamento.");
  }

  async function finish() {
    const response = await fetch(`/api/v1/simulations/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, elapsedSeconds: elapsed, submit: true }),
    });
    if (!response.ok)
      return setStatus("Não foi possível finalizar. Tente novamente.");
    const data = (await response.json()) as { result: Result };
    setResult(data.result);
    window.localStorage.removeItem(`simulation:${runId}`);
    setStatus("Simulado finalizado.");
  }

  if (!runId)
    return (
      <section className="mt-8 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">Configurar sessão</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-4">
          <label className="grid gap-2 text-sm">
            Vestibular
            <select
              value={examSlug}
              onChange={(event) => setExamSlug(event.target.value)}
              className="rounded-lg border p-2"
            >
              <option value="">Geral (todas as matérias)</option>
              {exams.map((exam) => (
                <option key={exam.slug} value={exam.slug}>
                  {exam.acronym} — provas anteriores
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Modo
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              className="rounded-lg border p-2"
            >
              <option value="quick">Sessão rápida</option>
              <option value="custom">Personalizado</option>
              <option value="adaptive">Adaptativo</option>
              <option value="final_review">Reta final</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Questões
            <input
              type="number"
              min={1}
              max={90}
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
              className="rounded-lg border p-2"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Duração (min)
            <input
              type="number"
              min={5}
              max={360}
              value={durationMinutes}
              onChange={(event) =>
                setDurationMinutes(Number(event.target.value))
              }
              className="rounded-lg border p-2"
            />
          </label>
        </div>
        <button
          onClick={start}
          className="mt-5 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
        >
          Iniciar simulado
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
        aria-labelledby="resultado-simulado"
      >
        <h2 id="resultado-simulado" className="text-2xl font-bold">
          Resultado
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

  const remaining = Math.max(0, durationMinutes * 60 - elapsed);
  return (
    <section className="mt-8">
      <div className="sticky top-2 z-10 flex flex-wrap justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <p role="timer" className="font-semibold">
          Tempo restante: {Math.floor(remaining / 60)}:
          {String(remaining % 60).padStart(2, "0")}
        </p>
        <p role="status" className="text-sm">
          {status}
        </p>
      </div>
      <ol className="mt-6 grid gap-6">
        {questions.map((question, index) => (
          <li key={question.id} className="rounded-xl border p-5">
            <strong>
              {index + 1}. {question.prompt}
            </strong>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => (
                <label key={option.id} className="flex gap-2">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === option.id}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: option.id,
                      }))
                    }
                  />
                  {option.id.toUpperCase()}. {option.text}
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
