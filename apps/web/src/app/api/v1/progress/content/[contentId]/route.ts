import { contentProgressSchema } from "@aprendevest/contracts";
import { getContentProgress, saveContentProgress } from "@aprendevest/db";

import { getCurrentUser } from "../../../../../../lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const { contentId } = await context.params;
  return Response.json(await getContentProgress(user.userId, contentId), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const { contentId } = await context.params;
  const parsed = contentProgressSchema.safeParse({
    ...(await request.json()),
    contentId,
  });
  if (!parsed.success) {
    return Response.json(
      { error: "Progresso inválido.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  return Response.json(await saveContentProgress(user.userId, parsed.data));
}
