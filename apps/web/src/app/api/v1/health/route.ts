import { healthResponseSchema } from "@aprendevest/contracts";
import { databaseHealth } from "@aprendevest/db";
import { checkSystemHealth } from "@aprendevest/domain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkSystemHealth(databaseHealth);
  const response = healthResponseSchema.parse({
    ...health,
    service: "web",
    version: process.env.APP_VERSION ?? "0.1.0",
  });

  return NextResponse.json(response, {
    status: response.status === "ok" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
