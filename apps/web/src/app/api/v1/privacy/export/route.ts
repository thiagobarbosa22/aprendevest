import { getUserPrivacyExport } from "@aprendevest/db";

import { getCurrentUser } from "../../../../../lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Não autenticado." }, { status: 401 });

  const data = await getUserPrivacyExport(user.userId);
  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition":
        'attachment; filename="aprendevest-meus-dados.json"',
    },
  });
}
