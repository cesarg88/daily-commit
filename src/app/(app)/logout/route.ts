import { NextRequest, NextResponse } from "next/server";
import {
  authCookieNames,
  getExpiredAuthCookieOptions,
} from "@/data/auth/session-cookies";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });

  response.cookies.set(
    authCookieNames.accessToken,
    "",
    getExpiredAuthCookieOptions(),
  );
  response.cookies.set(
    authCookieNames.refreshToken,
    "",
    getExpiredAuthCookieOptions(),
  );

  return response;
}
