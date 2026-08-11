"use client";

import { useActionState } from "react";

import { finishOnboarding, type AuthFormState } from "../actions/auth";

const initialState: AuthFormState = {};

export function OnboardingForm() {
  const [state, action, pending] = useActionState(
    finishOnboarding,
    initialState,
  );

  return (
    <form action={action} className="mt-8 grid gap-6">
      <div>
        <label htmlFor="targetCourse" className="mb-2 block font-semibold">
          Curso desejado
        </label>
        <input
          id="targetCourse"
          name="targetCourse"
          className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3"
          placeholder="Ex.: Medicina"
          required
        />
      </div>
      <fieldset>
        <legend className="font-semibold">Vestibulares-alvo</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {["ENEM", "FUVEST", "UNICAMP", "UNESP"].map((exam) => (
            <label
              key={exam}
              className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] p-3"
            >
              <input type="checkbox" name="targetExams" value={exam} /> {exam}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="weeklyMinutes" className="mb-2 block font-semibold">
          Tempo disponível por semana
        </label>
        <select
          id="weeklyMinutes"
          name="weeklyMinutes"
          className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3"
        >
          <option value="180">3 horas</option>
          <option value="300">5 horas</option>
          <option value="600">10 horas</option>
          <option value="900">15 horas</option>
        </select>
      </div>
      <div>
        <label htmlFor="currentLevel" className="mb-2 block font-semibold">
          Nível atual
        </label>
        <select
          id="currentLevel"
          name="currentLevel"
          className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3"
        >
          <option value="beginner">Estou construindo a base</option>
          <option value="intermediate">Já estudei parte do conteúdo</option>
          <option value="advanced">Quero foco em prática avançada</option>
        </select>
      </div>
      <div>
        <label htmlFor="ageGroup" className="mb-2 block font-semibold">
          Faixa etária
        </label>
        <select
          id="ageGroup"
          name="ageGroup"
          className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3"
        >
          <option value="undisclosed">Prefiro não informar</option>
          <option value="minor">Menor de 18 anos</option>
          <option value="adult">18 anos ou mais</option>
        </select>
      </div>
      {state.message ? (
        <p role="alert" className="text-sm text-red-700">
          {state.message}
        </p>
      ) : null}
      {state.errors ? (
        <p role="alert" className="text-sm text-red-700">
          Revise os campos e selecione ao menos um vestibular.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Criando sua trilha…" : "Receber trilha inicial"}
      </button>
    </form>
  );
}
