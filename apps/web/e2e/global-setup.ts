import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import path from "node:path";

const url = "http://127.0.0.1:3199";

async function waitForServer(server: ChildProcess) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null)
      throw new Error(`Servidor E2E encerrou com código ${server.exitCode}.`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // O processo ainda está iniciando.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Servidor E2E não respondeu em 30 segundos.");
}

export default async function globalSetup() {
  const nextBin = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const server = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", "3199"],
    {
      cwd: process.cwd(),
      detached: process.platform !== "win32",
      stdio: "ignore",
      windowsHide: true,
    },
  );
  if (!server.pid) throw new Error("Não foi possível iniciar o servidor E2E.");
  server.unref();
  await waitForServer(server);

  return async () => {
    if (process.platform === "win32") {
      spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
        windowsHide: true,
      });
    } else {
      try {
        process.kill(-server.pid!, "SIGTERM");
      } catch {
        // O servidor já encerrou.
      }
    }
  };
}
