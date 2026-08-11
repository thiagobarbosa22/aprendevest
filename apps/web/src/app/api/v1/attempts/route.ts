import { questionAttemptSchema } from "@aprendevest/contracts";
import { submitQuestionAttempt } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  const parsed = questionAttemptSchema.safeParse(await request.json());
  if (!parsed.success)
    return Response.json(
      { error: "Tentativa inválida.", details: parsed.error.flatten() },
      { status: 400 },
    );
  try {
    return Response.json(
      await submitQuestionAttempt(user.userId, parsed.data),
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível corrigir a questão." },
      { status: 409 },
    );
  }
}
