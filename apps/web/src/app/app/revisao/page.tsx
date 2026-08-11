import { listDueReviews } from "@aprendevest/db";
import Link from "next/link";
import { reviewQuality } from "../../actions/study-plan";
import { requireUser } from "../../../lib/auth/guards";

export const metadata = { title: "Revisão" };
export default async function ReviewPage() {
  const user = await requireUser();
  const items = await listDueReviews(user.userId);
  return (
    <main id="conteudo-principal" className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/app" className="text-sm font-semibold underline">
        ← Hoje
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Revisões de hoje</h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        O intervalo se adapta à sua lembrança, sem zerar seu progresso.
      </p>
      {!items.length ? (
        <p className="mt-8 rounded-xl border p-6">
          Tudo revisado por agora. Volte na próxima sessão.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border p-5">
              <strong>{item.topic ?? "Tópico removido"}</strong>
              <p className="mt-2 text-sm">Quanto você lembrou?</p>
              <form
                action={reviewQuality}
                className="mt-4 flex flex-wrap gap-2"
              >
                <input type="hidden" name="reviewId" value={item.id} />
                {[
                  [1, "Difícil"],
                  [3, "Parcial"],
                  [5, "Fácil"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    name="quality"
                    value={value}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold"
                  >
                    {label}
                  </button>
                ))}
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
