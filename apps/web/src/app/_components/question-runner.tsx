"use client";
import { useEffect, useRef, useState } from "react";

type Question = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
  topicName: string;
  difficulty: number;
};

export function QuestionRunner({ question }: { question: Question }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{
    correct: boolean;
    resolution: string;
    correctAnswer: string;
    commonError?: string | null;
  } | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  async function submit() {
    if (!answer) return setMessage("Escolha uma alternativa.");
    setMessage("Corrigindo…");
    const response = await fetch("/api/v1/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question.id,
        answer,
        durationSeconds: Math.round((Date.now() - started.current) / 1000),
        idempotencyKey: crypto.randomUUID(),
        context: "practice",
      }),
    });
    if (!response.ok)
      return setMessage("Não foi possível corrigir. Verifique sua sessão.");
    setResult(await response.json());
    setMessage("");
  }
  return (
    <section className="rounded-xl border border-[var(--color-border)] p-6">
      <p className="text-sm font-semibold text-[var(--color-secondary)]">
        {question.topicName} · dificuldade {question.difficulty}/5
      </p>
      <h2 className="mt-3 text-xl font-semibold">{question.prompt}</h2>
      <fieldset className="mt-6 grid gap-3">
        <legend className="sr-only">Alternativas</legend>
        {question.options.map((option) => (
          <label
            key={option.id}
            className="flex gap-3 rounded-lg border border-[var(--color-border)] p-4"
          >
            <input
              type="radio"
              name={`answer-${question.id}`}
              value={option.id}
              checked={answer === option.id}
              onChange={() => setAnswer(option.id)}
            />
            <span>
              <strong>{option.id.toUpperCase()}.</strong> {option.text}
            </span>
          </label>
        ))}
      </fieldset>
      <button
        onClick={submit}
        disabled={Boolean(result)}
        className="mt-5 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        Corrigir resposta
      </button>
      <p role="status" className="mt-3 text-sm">
        {message}
      </p>
      {result ? (
        <div
          className={`mt-6 rounded-xl p-5 ${result.correct ? "bg-emerald-50 text-emerald-950" : "bg-amber-50 text-amber-950"}`}
        >
          <h3 className="font-semibold">
            {result.correct
              ? "Resposta correta"
              : `Resposta incorreta · gabarito ${result.correctAnswer.toUpperCase()}`}
          </h3>
          <p className="mt-3 leading-7">{result.resolution}</p>
          {!result.correct && result.commonError ? (
            <p className="mt-3 text-sm">
              <strong>Erro comum:</strong> {result.commonError}
            </p>
          ) : null}
          <p className="mt-3 text-sm">
            {result.correct
              ? "Bom trabalho. Continue praticando."
              : "A questão foi adicionada ao seu caderno de erros."}
          </p>
        </div>
      ) : null}
    </section>
  );
}
