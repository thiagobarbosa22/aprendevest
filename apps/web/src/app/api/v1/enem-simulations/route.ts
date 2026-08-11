import { enemSimulationStartSchema } from "@aprendevest/contracts";
import { startEnemSimulation } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";
import { rateLimitRequest } from "../../../../lib/security/rate-limit";

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "enem-simulation-start", 20);
  if (!rate.allowed)
    return Response.json(
      { error: "Limite temporário atingido." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = enemSimulationStartSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json({ error: "Configuração inválida." }, { status: 400 });
  try {
    return Response.json(await startEnemSimulation(user.userId, parsed.data), {
      status: 201,
    });
  } catch (error) {
    console.error("enem-simulation-start failed", error);
    return Response.json(
      {
        error:
          "Não foi possível carregar a prova do ENEM agora. Tente novamente em instantes.",
      },
      { status: 409 },
    );
  }
}
