import Link from "next/link";

import { AuthForm } from "../_components/auth-form";

export const metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <main id="conteudo-principal" className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Voltar ao início
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Comece sua jornada</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Defina seu objetivo e receba uma trilha inicial realista.
      </p>
      <AuthForm mode="signup" />
      <p className="mt-6 text-sm">
        Já tem conta?{" "}
        <Link
          className="font-semibold text-[var(--color-primary)]"
          href="/entrar"
        >
          Entrar
        </Link>
      </p>
    </main>
  );
}
