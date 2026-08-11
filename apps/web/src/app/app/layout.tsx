import Link from "next/link";

import { logout } from "../actions/auth";
import { AppNav } from "./_components/app-nav";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/app" className="font-bold text-[var(--color-primary)]">
            AprendeVest
          </Link>
          <AppNav />
          <form action={logout}>
            <button className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm font-semibold">
              Sair
            </button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
