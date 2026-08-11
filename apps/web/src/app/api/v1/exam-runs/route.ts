import { startExamRun, getPaperQuestions } from "@aprendevest/db";
import { getCurrentUser } from "../../../../lib/auth/session";
export async function POST(request: Request) {
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
