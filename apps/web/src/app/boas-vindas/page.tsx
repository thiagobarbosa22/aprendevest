import { redirect } from "next/navigation";

import { OnboardingForm } from "../_components/onboarding-form";
import { requireUser } from "../../lib/auth/guards";

export const metadata = { title: "Seu objetivo" };

export default async function WelcomePage() {
  const user = await requireUser();
  if (user.onboardingCompletedAt) redirect("/app");

  return (
    <main id="conteudo-principal" className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-secondary)]">
        Passo 1 de 2
      </p>
      <h1 className="mt-3 text-3xl font-bold">
        Olá, {user.displayName}. Qual é seu objetivo?
      </h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        Você poderá ajustar tudo depois. O plano respeita seu tempo e seus
        descansos.
      </p>
      <OnboardingForm />
    </main>
  );
}
