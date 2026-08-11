import { simulationUpdateSchema } from "@aprendevest/contracts";
import { updateSimulation } from "@aprendevest/db";
import { getCurrentUser } from "../../../../../lib/auth/session";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = simulationUpdateSchema.safeParse({
    ...(await request.json()),
    runId: (await context.params).runId,
  });
  if (!parsed.success)
    return Response.json({ error: "Autosave inválido." }, { status: 400 });
  try {
    return Response.json(await updateSimulation(user.userId, parsed.data));
  } catch {
    return Response.json({ error: "Simulado indisponível." }, { status: 409 });
  }
}
