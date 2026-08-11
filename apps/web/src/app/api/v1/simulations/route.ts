import { simulationStartSchema } from "@aprendevest/contracts";
import { startSimulation } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = simulationStartSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json({ error: "Configuração inválida." }, { status: 400 });
  try {
    return Response.json(await startSimulation(user.userId, parsed.data), {
      status: 201,
    });
  } catch {
    return Response.json(
      { error: "Não foi possível iniciar o simulado." },
      { status: 409 },
    );
  }
}
