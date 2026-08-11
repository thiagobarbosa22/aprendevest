"use client";

import { useState } from "react";

type Note = { id: string; body: string; timestampSeconds: number | null };

export function LessonProgress({
  contentId,
  initialPercent,
  initialNotes,
}: {
  contentId: string;
  initialPercent: number;
  initialNotes: Note[];
}) {
  const [percent, setPercent] = useState(initialPercent);
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");

  async function save(complete = false) {
    setMessage("Salvando…");
    const response = await fetch(`/api/v1/progress/content/${contentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ percent, positionSeconds: 0, complete }),
    });
    if (!response.ok)
      return setMessage("Não foi possível salvar. Tente novamente.");
    const saved = (await response.json()) as { percent: number };
    setPercent(saved.percent);
    setMessage(
      saved.percent === 100
        ? "Aula concluída. Revisão futura agendada nas próximas fases."
        : "Progresso salvo no servidor.",
    );
  }

  async function addNote(formData: FormData) {
    const body = String(formData.get("body") ?? "");
    const response = await fetch(
      `/api/v1/progress/content/${contentId}/notes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      },
    );
    if (!response.ok) return setMessage("Não foi possível salvar a anotação.");
    const note = (await response.json()) as Note;
    setNotes((current) => [...current, note]);
    setMessage("Anotação salva.");
  }

  return (
    <aside
      className="rounded-xl border border-[var(--color-border)] p-6"
      aria-labelledby="progress-heading"
    >
      <h2 id="progress-heading" className="text-lg font-semibold">
        Seu progresso
      </h2>
      <label
        htmlFor="lesson-percent"
        className="mt-4 block text-sm font-semibold"
      >
        Quanto você estudou? {percent}%
      </label>
      <input
        id="lesson-percent"
        type="range"
        min="0"
        max="100"
        step="10"
        value={percent}
        onChange={(event) => setPercent(Number(event.target.value))}
        className="mt-2 w-full"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => save(false)}
          className="rounded-lg border border-[var(--color-border)] px-4 py-2 font-semibold"
        >
          Salvar progresso
        </button>
        <button
          onClick={() => save(true)}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-semibold text-white"
        >
          Concluir aula
        </button>
      </div>
      <p
        role="status"
        className="mt-3 min-h-6 text-sm text-[var(--color-text-muted)]"
      >
        {message}
      </p>
      <section className="mt-8">
        <h3 className="font-semibold">Minhas anotações</h3>
        <form action={addNote} className="mt-3 flex gap-2">
          <label className="sr-only" htmlFor="note-body">
            Nova anotação
          </label>
          <textarea
            id="note-body"
            name="body"
            required
            maxLength={4000}
            className="min-h-20 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          />
          <button className="self-end rounded-lg border border-[var(--color-border)] px-4 py-2 font-semibold">
            Adicionar
          </button>
        </form>
        {notes.length ? (
          <ul className="mt-4 grid gap-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg bg-[var(--color-surface-muted)] p-3 text-sm"
              >
                {note.body}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Nenhuma anotação ainda.
          </p>
        )}
      </section>
    </aside>
  );
}
