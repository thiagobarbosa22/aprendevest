"use client";

import { useActionState } from "react";

import { login, signup, type AuthFormState } from "../actions/auth";

const initialState: AuthFormState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(
    mode === "signup" ? signup : login,
    initialState,
  );
  const isSignup = mode === "signup";

  return (
    <form action={action} className="mt-8 grid gap-5" noValidate>
      {isSignup ? (
        <Field
          id="name"
          label="Nome"
          autoComplete="name"
          errors={state.errors?.name}
        />
      ) : null}
      <Field
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        errors={state.errors?.email}
      />
      <Field
        id="password"
        label="Senha"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        hint={
          isSignup
            ? "Use pelo menos 10 caracteres, com letras e números."
            : undefined
        }
        errors={state.errors?.password}
      />
      {isSignup ? (
        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              className="mt-1 h-4 w-4"
              type="checkbox"
              name="privacyAccepted"
            />
            <span>
              Li e aceito a Política de Privacidade. Meus dados serão usados
              apenas para oferecer e melhorar minha experiência de estudo.
            </span>
          </label>
          <Errors messages={state.errors?.privacyAccepted} />
        </div>
      ) : null}
      {state.message ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-lg bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Aguarde…" : isSignup ? "Criar minha conta" : "Entrar"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  hint,
  errors,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  hint?: string;
  errors?: string[];
}) {
  const describedBy = [
    hint ? `${id}-hint` : "",
    errors?.length ? `${id}-error` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors?.length)}
        aria-describedby={describedBy || undefined}
        className="min-h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
      />
      {hint ? (
        <p
          id={`${id}-hint`}
          className="mt-1 text-xs text-[var(--color-text-muted)]"
        >
          {hint}
        </p>
      ) : null}
      <Errors id={`${id}-error`} messages={errors} />
    </div>
  );
}

function Errors({ id, messages }: { id?: string; messages?: string[] }) {
  return messages?.length ? (
    <ul id={id} className="mt-1 text-sm text-red-700">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  ) : null;
}
