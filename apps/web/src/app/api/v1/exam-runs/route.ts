import { startExamRun, getPaperQuestions } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";
import { rateLimitRequest } from "../../../../lib/security/rate-limit";
export async function POST(request: Request) {
  const rate = rateLimitRequest(request, "exam-start", 20);
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
  const { paperId } = (await request.json()) as { paperId?: string };
  if (!paperId)
    return Response.json({ error: "Prova inválida." }, { status: 400 });
  try {
    const run = await startExamRun(user.userId, paperId);
    return Response.json(
      { run, questions: await getPaperQuestions(paperId) },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Não foi possível iniciar a prova." },
      { status: 409 },
    );
  }
}
