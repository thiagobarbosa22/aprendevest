"use client";

import { useActionState } from "react";

import { login, signup, type AuthFormState } from "../actions/auth";

const initialState: AuthFormState = {};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [state, action, pending] = useActionState(
    mode === "signup" ? signup : login,
    initialState,
  );

  return (
    <div className="mt-8">
      <a
        href="/api/auth/google"
        className="flex min-h-11 items-center justify-center gap-3 rounded-lg border border-[var(--color-border)] px-5 py-3 font-semibold hover:bg-[var(--color-surface-muted)]"
      >
        <GoogleIcon />
        Continuar com Google
      </a>
      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase text-[var(--color-text-muted)]">
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--color-border)]" />
      </div>
      <AuthFormFields
        mode={mode}
        state={state}
        action={action}
        pending={pending}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6 29.5 4 24 4c-7.5 0-14 4.2-17.3 10.4z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-1.9 14-5.9l-6.5-5.5C29.4 34.5 26.9 35 24 35c-5.2 0-9.6-3.3-11.3-8l-6.5 5c3.3 6.4 9.9 12 17.8 12z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6h.1l6.5 5.5C37.5 39.3 44 34 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function AuthFormFields({
  mode,
  state,
  action,
  pending,
}: {
  mode: "login" | "signup";
  state: AuthFormState;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const isSignup = mode === "signup";
  return (
    <form action={action} className="grid gap-5" noValidate>
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
