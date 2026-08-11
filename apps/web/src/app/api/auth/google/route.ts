import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { rateLimitRequest } from "../../../../lib/security/rate-limit";

export async function GET(request: Request) {
  const appUrl = process.env.APP_URL ?? new URL(request.url).origin;
  const rate = rateLimitRequest(request, "google-oauth-start", 20);
  if (!rate.allowed) {
    return NextResponse.redirect(new URL("/entrar?erro=limite", appUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/entrar?erro=google-nao-configurado", appUrl),
    );
  }

  const state = randomBytes(24).toString("base64url");
  const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set(
    "redirect_uri",
    `${appUrl}/api/auth/google/callback`,
  );
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
