import Link from "next/link";

import { AuthForm } from "../_components/auth-form";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main id="conteudo-principal" className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Voltar ao início
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Entre no AprendeVest</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Retome seu plano de onde parou.
      </p>
      <AuthForm mode="login" />
      <p className="mt-6 text-sm">
        Ainda não tem conta?{" "}
        <Link
          className="font-semibold text-[var(--color-primary)]"
          href="/cadastro"
        >
          Criar conta
        </Link>
      </p>
    </main>
  );
}
