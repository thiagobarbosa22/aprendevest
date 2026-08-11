import { examRunUpdateSchema } from "@aprendevest/contracts";
import { updateExamRun } from "@aprendevest/db";
import { getCurrentUser } from "../../../../../lib/auth/session";
export async function PATCH(
  request: Request,
  context: { params: Promise<{ runId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = examRunUpdateSchema.safeParse({
    ...(await request.json()),
    runId: (await context.params).runId,
  });
  if (!parsed.success)
    return Response.json({ error: "Autosave inválido." }, { status: 400 });
  try {
    return Response.json(await updateExamRun(user.userId, parsed.data));
  } catch {
    return Response.json({ error: "Aplicação indisponível." }, { status: 409 });
  }
}
