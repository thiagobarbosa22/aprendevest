import { findOrCreateOAuthUser } from "@aprendevest/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSession } from "../../../../../lib/auth/session";
import { rateLimitRequest } from "../../../../../lib/security/rate-limit";

const privacyPolicyVersion = "2026-08-11";

type GoogleTokenResponse = { access_token: string };
type GoogleProfile = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

export async function GET(request: Request) {
  const appUrl = process.env.APP_URL ?? new URL(request.url).origin;
  const rate = rateLimitRequest(request, "google-oauth-callback", 20);
  if (!rate.allowed) {
    return NextResponse.redirect(new URL("/entrar?erro=limite", appUrl));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/entrar?erro=google-invalido", appUrl),
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/entrar?erro=google-nao-configurado", appUrl),
    );
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) throw new Error("Falha ao trocar o código Google.");
    const token = (await tokenResponse.json()) as GoogleTokenResponse;

    const profileResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${token.access_token}` } },
    );
    if (!profileResponse.ok) throw new Error("Falha ao buscar perfil Google.");
    const profile = (await profileResponse.json()) as GoogleProfile;
    if (!profile.email) throw new Error("Conta Google sem e-mail.");

    const { user, isNew } = await findOrCreateOAuthUser({
      provider: "google",
      providerAccountId: profile.sub,
      email: profile.email,
      displayName:
        profile.name?.trim() || profile.email.split("@")[0] || profile.email,
      emailVerified: Boolean(profile.email_verified),
      policyVersion: privacyPolicyVersion,
    });

    await createSession(user.id);
    return NextResponse.redirect(
      new URL(isNew ? "/boas-vindas" : "/app", appUrl),
    );
  } catch {
    return NextResponse.redirect(new URL("/entrar?erro=google-falhou", appUrl));
  }
}
