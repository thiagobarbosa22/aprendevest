import Link from "next/link";

import { deleteAccount, logout } from "../../actions/auth";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Perfil e privacidade" };

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/app" className="text-sm text-[var(--color-primary)]">
        ← Voltar para Hoje
      </Link>
      <h1 className="mt-8 text-3xl font-bold">Perfil e privacidade</h1>
      <dl className="mt-8 grid gap-4 rounded-xl border border-[var(--color-border)] p-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Nome</dt>
          <dd className="font-semibold">{user.displayName}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">E-mail</dt>
          <dd className="font-semibold">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Papel</dt>
          <dd className="font-semibold">{user.role}</dd>
        </div>
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Seus dados</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Baixe uma cópia estruturada dos dados de conta e consentimentos.
        </p>
        <a
          href="/api/v1/privacy/export"
          download
          className="mt-4 inline-block rounded-lg bg-[var(--color-primary)] px-4 py-3 font-semibold text-white"
        >
          Exportar meus dados
        </a>
      </section>
      <section className="mt-12 rounded-xl border border-red-300 p-6">
        <h2 className="text-xl font-semibold text-red-800">Excluir conta</h2>
        <p className="mt-2 text-sm">
          A conta será bloqueada imediatamente e entrará no fluxo de exclusão e
          anonimização.
        </p>
        <form action={deleteAccount} className="mt-4">
          <button className="rounded-lg bg-red-700 px-4 py-3 font-semibold text-white">
            Solicitar exclusão
          </button>
        </form>
      </section>
      <form action={logout} className="mt-8">
        <button className="text-sm underline">Sair da conta</button>
      </form>
    </main>
  );
}
