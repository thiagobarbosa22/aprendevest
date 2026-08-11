import { questionAttemptSchema } from "@aprendevest/contracts";
import { submitQuestionAttempt } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";
import { rateLimitRequest } from "../../../../lib/security/rate-limit";

export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "attempts", 90);
  if (!rate.allowed)
    return Response.json(
      { error: "Muitas tentativas. Aguarde um momento." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      },
    );
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
