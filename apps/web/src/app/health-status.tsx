"use client";

import { useEffect, useState } from "react";
import type { HealthResponse } from "@aprendevest/contracts";
import { StatusBadge, type StatusTone } from "@aprendevest/ui";

type State =
  | { phase: "loading" }
  | { phase: "ready"; data: HealthResponse }
  | { phase: "error" };

const toneByStatus: Record<HealthResponse["status"], StatusTone> = {
  ok: "ok",
  degraded: "degraded",
};

const labelByStatus: Record<HealthResponse["status"], string> = {
  ok: "Sistema operando normalmente",
  degraded: "Sistema com disponibilidade reduzida",
};

export function HealthStatus() {
  const [state, setState] = useState<State>({ phase: "loading" });

  useEffect(() => {
    let active = true;

    fetch("/api/v1/health", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as HealthResponse;
        if (active) setState({ phase: "ready", data });
      })
      .catch(() => {
        if (active) setState({ phase: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  if (state.phase === "loading") {
    return (
      <StatusBadge tone="unknown" label="Verificando status do sistema…" />
    );
  }

  if (state.phase === "error") {
    return (
      <StatusBadge
        tone="degraded"
        label="Não foi possível verificar o status agora"
      />
    );
  }

  return (
    <StatusBadge
      tone={toneByStatus[state.data.status]}
      label={labelByStatus[state.data.status]}
    />
  );
}
