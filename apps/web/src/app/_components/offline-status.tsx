"use client";

import { useEffect, useState } from "react";

export function OfflineStatus() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <p
      role="status"
      className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950"
    >
      Você está offline. Provas e simulados preservam respostas locais até a
      conexão voltar.
    </p>
  );
}
