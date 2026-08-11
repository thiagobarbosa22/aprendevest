"use client";
import { useEffect, useRef, useState } from "react";
type Q = {
  id: string;
  prompt: string;
  options: Array<{ id: string; text: string }>;
  position: number;
};
export function ExamRunner({ paperId }: { paperId: string }) {
  const [runId, setRunId] = useState("");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  async function start() {
    const r = await fetch("/api/v1/exam-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId }),
    });
    if (!r.ok)
      return setStatus(
        "Entre com uma conta e verifique se a prova foi carregada pelo seed.",
      );
    const data = (await r.json()) as {
      run: { id: string; answers: Record<string, string> };
      questions: Q[];
    };
    const localAnswers = window.localStorage.getItem(`exam-run:${data.run.id}`);
    setRunId(data.run.id);
    setAnswers({
      ...data.run.answers,
      ...(localAnswers
        ? (JSON.parse(localAnswers) as Record<string, string>)
        : {}),
    });
    setQuestions(data.questions);
    setStatus("Prova iniciada. Suas respostas podem ser retomadas.");
  }
  async function save(submit = false) {
    const elapsedSeconds = Math.round((Date.now() - started.current) / 1000);
    const r = await fetch(`/api/v1/exam-runs/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, elapsedSeconds, submit }),
    });
    setStatus(
      r.ok
        ? submit
          ? "Prova finalizada e salva."
          : "Respostas salvas no servidor."
        : "Falha no autosave. Tente novamente.",
    );
    if (submit && r.ok) window.localStorage.removeItem(`exam-run:${runId}`);
  }
  useEffect(() => {
    if (!runId || Object.keys(answers).length === 0) return;
    window.localStorage.setItem(`exam-run:${runId}`, JSON.stringify(answers));
    const autosave = window.setTimeout(async () => {
      const elapsedSeconds = Math.round((Date.now() - started.current) / 1000);
      const response = await fetch(`/api/v1/exam-runs/${runId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, elapsedSeconds, submit: false }),
      });
      setStatus(
        response.ok
          ? "Respostas salvas automaticamente."
          : "Sem conexão: respostas preservadas neste dispositivo.",
      );
    }, 800);
    return () => window.clearTimeout(autosave);
  }, [answers, runId]);
  if (!runId)
    return (
      <div>
        <button
          onClick={start}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
        >
          Resolver online
        </button>
        <p role="status" className="mt-3 text-sm">
          {status}
        </p>
      </div>
    );
  return (
    <section>
      <p
        role="status"
        className="rounded-lg bg-[var(--color-surface-muted)] p-3 text-sm"
      >
        {status}
      </p>
      <ol className="mt-6 grid gap-6">
        {questions.map((q) => (
          <li key={q.id} className="rounded-xl border p-5">
            <strong>
              {q.position}. {q.prompt}
            </strong>
            <div className="mt-4 grid gap-2">
              {q.options.map((o) => (
                <label key={o.id} className="flex gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  />
                  {o.id.toUpperCase()}. {o.text}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => save(false)}
          className="rounded-lg border px-4 py-2 font-semibold"
        >
          Salvar
        </button>
        <button
          onClick={() => save(true)}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
        >
          Finalizar prova
        </button>
      </div>
    </section>
  );
}
