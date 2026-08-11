"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/app", label: "Hoje" },
  { href: "/materias", label: "Aulas" },
  { href: "/app/plano", label: "Meu plano" },
  { href: "/app/simulados", label: "Simulados" },
  { href: "/app/revisao", label: "Revisão" },
  { href: "/app/desempenho", label: "Desempenho" },
  { href: "/app/redacao", label: "Redação" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação de estudos"
      className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"
    >
      {links.map((link) => {
        const active =
          link.href === "/app"
            ? pathname === "/app"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "text-[var(--color-primary)] underline underline-offset-4"
                : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
