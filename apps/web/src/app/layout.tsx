import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SkipLink } from "@aprendevest/ui";

import logoPrincipal from "../../../../fotos/logoprincipal.jpg";

import "./globals.css";
import { OfflineStatus } from "./_components/offline-status";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "AprendeVest",
    template: "%s | AprendeVest",
  },
  description:
    "Organize seus estudos, pratique e acompanhe sua evolução para o vestibular.",
  openGraph: {
    title: "AprendeVest",
    description:
      "Organize seus estudos, pratique e acompanhe sua evolução para o vestibular.",
    images: [
      {
        url: logoPrincipal.src,
        width: logoPrincipal.width,
        height: logoPrincipal.height,
        alt: "AprendeVest.com",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <SkipLink targetId="conteudo-principal" />
        <OfflineStatus />
        {children}
      </body>
    </html>
  );
}
