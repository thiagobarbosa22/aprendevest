"use client";

import { useActionState } from "react";

import { createLesson, type ContentFormState } from "../actions/content";

export function LessonForm({
  modules,
  topics,
}: {
  modules: Array<{ id: string; title: string }>;
  topics: Array<{ id: string; name: string }>;
}) {
  const [state, action, pending] = useActionState(
    createLesson,
    {} as ContentFormState,
  );
  return (
    <form
      action={action}
      className="mt-6 grid gap-4 rounded-xl border border-[var(--color-border)] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 font-semibold">
          Módulo
          <select
            name="moduleId"
            className="min-h-11 rounded-lg border bg-[var(--color-surface)] px-3 font-normal"
            required
          >
            {modules.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 font-semibold">
          Tópico
          <select
            name="topicId"
            className="min-h-11 rounded-lg border bg-[var(--color-surface)] px-3 font-normal"
            required
          >
            {topics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="title" label="Título" />
        <Field name="slug" label="Slug" />
      </div>
      <label className="grid gap-1 font-semibold">
        Resumo
        <textarea
          name="summary"
          rows={3}
          className="rounded-lg border bg-[var(--color-surface)] p-3 font-normal"
          required
        />
      </label>
      <label className="grid gap-1 font-semibold">
        Objetivos, um por linha
        <textarea
          name="objectives"
          rows={3}
          className="rounded-lg border bg-[var(--color-surface)] p-3 font-normal"
          required
        />
      </label>
      <label className="grid gap-1 font-semibold">
        Texto inicial da aula
        <textarea
          name="introduction"
          rows={6}
          className="rounded-lg border bg-[var(--color-surface)] p-3 font-normal"
          required
        />
      </label>
      <label className="grid gap-1 font-semibold">
        Versão acessível em texto
        <textarea
          name="accessibleText"
          rows={4}
          className="rounded-lg border bg-[var(--color-surface)] p-3 font-normal"
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="estimatedMinutes"
          label="Tempo estimado (min)"
          type="number"
        />
        <Field name="sourceUrl" label="Fonte" type="url" />
      </div>
      <label className="grid gap-1 font-semibold">
        Direitos
        <select
          name="rightsStatus"
          className="min-h-11 rounded-lg border bg-[var(--color-surface)] px-3 font-normal"
        >
          <option value="platform_authored">Autoral da plataforma</option>
          <option value="official_link">Link oficial</option>
          <option value="authorized">Autorizado</option>
        </select>
      </label>
      {state.errors ? (
        <p role="alert" className="text-sm text-red-700">
          Revise os campos. Módulo, tópico, fonte, texto acessível e objetivos
          são obrigatórios.
        </p>
      ) : null}
      {state.message ? (
        <p
          role="status"
          className={state.success ? "text-emerald-700" : "text-red-700"}
        >
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending || modules.length === 0 || topics.length === 0}
        className="min-h-11 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar aula"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1 font-semibold">
      {label}
      <input
        name={name}
        type={type}
        className="min-h-11 rounded-lg border bg-[var(--color-surface)] px-3 font-normal"
        required
      />
    </label>
  );
}
