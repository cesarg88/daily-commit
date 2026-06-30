import { NextRequest, NextResponse } from "next/server";
import { decideRouteProtection } from "@/application/auth/route-protection";
import { authCookieNames } from "@/data/auth/session-cookies";

export function middleware(request: NextRequest) {
  const decision = decideRouteProtection(
    request.nextUrl.pathname,
    request.nextUrl.search,
    Boolean(request.cookies.get(authCookieNames.accessToken)?.value),
  );

  if (decision.type === "redirect") {
    return NextResponse.redirect(new URL(decision.location, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/objectives/:path*"],
};
