"use client";

import { useActionState } from "react";

import { createExam, type CatalogFormState } from "../actions/catalog";

const initialState: CatalogFormState = {};

export function ExamForm() {
  const [state, action, pending] = useActionState(createExam, initialState);
  const fields = [
    ["name", "Nome oficial", "Exame Nacional do Ensino Médio"],
    ["acronym", "Sigla", "ENEM"],
    ["slug", "Slug", "enem"],
    ["institution", "Instituição", "INEP"],
    ["board", "Banca", "INEP"],
    ["region", "Região", "Brasil"],
    ["officialUrl", "Link oficial", "https://..."],
    ["sourceUrl", "Fonte dos metadados", "https://..."],
  ] as const;

  return (
    <form
      action={action}
      className="mt-6 grid gap-4 rounded-xl border border-[var(--color-border)] p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label, placeholder]) => (
          <label key={name} className="grid gap-1 text-sm font-semibold">
            {label}
            <input
              name={name}
              placeholder={placeholder}
              className="min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-normal"
              required
            />
            {state.errors?.[name]?.map((error) => (
              <span className="font-normal text-red-700" key={error}>
                {error}
              </span>
            ))}
          </label>
        ))}
      </div>
      <label className="grid gap-1 text-sm font-semibold">
        Resumo público
        <textarea
          name="summary"
          rows={4}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-normal"
          required
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Situação dos direitos
        <select
          name="rightsStatus"
          className="min-h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-normal"
        >
          <option value="official_link">Somente link oficial</option>
          <option value="authorized">Material autorizado</option>
          <option value="platform_authored">
            Conteúdo autoral da plataforma
          </option>
        </select>
      </label>
      {state.message ? (
        <p
          role="status"
          className={state.success ? "text-emerald-700" : "text-red-700"}
        >
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="min-h-11 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar rascunho"}
      </button>
    </form>
  );
}
