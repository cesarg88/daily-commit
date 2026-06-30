import { NextRequest, NextResponse } from "next/server";
import {
  authenticateFounder,
  type FounderAuthResult,
} from "@/application/auth/founder-auth";
import { getFounderEmailAllowlist } from "@/application/auth/founder-allowlist";
import {
  authCookieNames,
  getAuthCookieOptions,
} from "@/data/auth/session-cookies";
import { createSupabaseServerClient } from "@/data/supabase/server-clients";

function getSafeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "/app";
  }

  if (
    value === "/app" ||
    value.startsWith("/app/") ||
    value.startsWith("/app?") ||
    value === "/day" ||
    value.startsWith("/day?") ||
    value === "/objectives" ||
    value.startsWith("/objectives?")
  ) {
    return value;
  }

  return "/app";
}

function redirectToLogin(
  request: NextRequest,
  result: FounderAuthResult,
  next: string,
) {
  const url = new URL("/login", request.url);
  url.searchParams.set("next", next);

  if (result.status === "rejected") {
    url.searchParams.set("error", result.reason);
  }

  return NextResponse.redirect(url, {
    status: 303,
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = getSafeNext(formData.get("next"));
  const supabase = createSupabaseServerClient();

  const result = await authenticateFounder(
    {
      email,
      password,
    },
    getFounderEmailAllowlist(),
    {
      signInWithPassword(credentials) {
        return supabase.auth.signInWithPassword(credentials);
      },
    },
  );

  if (result.status !== "authenticated") {
    return redirectToLogin(request, result, next);
  }

  const response = NextResponse.redirect(new URL(next, request.url), {
    status: 303,
  });

  response.cookies.set(
    authCookieNames.accessToken,
    result.session.accessToken,
    getAuthCookieOptions(result.session.expiresIn),
  );
  response.cookies.set(
    authCookieNames.refreshToken,
    result.session.refreshToken,
    getAuthCookieOptions(60 * 60 * 24 * 30),
  );

  return response;
}
