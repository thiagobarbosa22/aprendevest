import { listFeatureStatuses } from "@aprendevest/db";
import Link from "next/link";
import { requirePermission } from "../../../lib/auth/guards";

export const metadata = { title: "Feature flags" };
export default async function FeatureFlagsPage() {
  await requirePermission("content:create");
  const flags = await listFeatureStatuses();
  return (
    <main id="conteudo-principal" className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin" className="text-sm font-semibold underline">
        ← Administração
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Recursos em expansão</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Alterações são feitas por migração/variável de ambiente auditável
        durante o MVP.
      </p>
      <ul className="mt-8 grid gap-3">
        {flags.map((flag) => (
          <li
            key={flag.key}
            className="flex justify-between rounded-xl border p-4"
          >
            <code>{flag.key}</code>
            <strong
              className={flag.enabled ? "text-emerald-700" : "text-slate-600"}
            >
              {flag.enabled ? "Ativo" : "Desligado"}
            </strong>
          </li>
        ))}
      </ul>
    </main>
  );
}
