import { enemSimulationUpdateSchema } from "@aprendevest/contracts";
import { updateEnemSimulation } from "@aprendevest/db";
import { getCurrentUser } from "../../../../../lib/auth/session";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = enemSimulationUpdateSchema.safeParse({
    ...(await request.json()),
    runId: (await context.params).runId,
  });
  if (!parsed.success)
    return Response.json({ error: "Autosave inválido." }, { status: 400 });
  try {
    return Response.json(await updateEnemSimulation(user.userId, parsed.data));
  } catch (error) {
    console.error("enem-simulation-update failed", error);
    return Response.json({ error: "Simulado indisponível." }, { status: 409 });
  }
}
