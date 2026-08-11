import { contentNoteSchema } from "@aprendevest/contracts";
import { addContentNote, listContentNotes } from "@aprendevest/db";

import { getCurrentUser } from "../../../../../../../lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const { contentId } = await context.params;
  return Response.json(await listContentNotes(user.userId, contentId), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ contentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const { contentId } = await context.params;
  const parsed = contentNoteSchema.safeParse({
    ...(await request.json()),
    contentId,
  });
  if (!parsed.success)
    return Response.json({ error: "Anotação inválida." }, { status: 400 });
  return Response.json(await addContentNote(user.userId, parsed.data), {
    status: 201,
  });
}
