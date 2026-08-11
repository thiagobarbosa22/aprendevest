import Link from "next/link";

import { AuthForm } from "../_components/auth-form";

export const metadata = { title: "Entrar" };

const errorMessages: Record<string, string> = {
  "google-invalido":
    "Não foi possível confirmar o login com Google. Tente novamente.",
  "google-nao-configurado": "Login com Google está indisponível no momento.",
  "google-falhou": "Não foi possível entrar com Google agora. Tente novamente.",
  limite: "Muitas tentativas. Aguarde um instante antes de tentar de novo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const errorMessage = erro ? errorMessages[erro] : undefined;
  return (
    <main id="conteudo-principal" className="mx-auto max-w-lg px-6 py-12">
      <Link href="/" className="text-sm text-[var(--color-primary)]">
        ← Voltar ao início
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Entre no AprendeVest</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Retome seu plano de onde parou.
      </p>
      {errorMessage ? (
        <p
          role="alert"
          className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800"
        >
          {errorMessage}
        </p>
      ) : null}
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
