export type RouteProtectionDecision =
  | {
      type: "allow";
    }
  | {
      type: "redirect";
      location: string;
    };

const protectedRoutePrefixes = ["/app", "/day", "/objectives"];

export function decideRouteProtection(
  pathname: string,
  search: string,
  hasAccessToken: boolean,
): RouteProtectionDecision {
  const isProtectedRoute = protectedRoutePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtectedRoute || hasAccessToken) {
    return {
      type: "allow",
    };
  }

  const next = `${pathname}${search}`;

  return {
    type: "redirect",
    location: `/login?next=${encodeURIComponent(next)}`,
  };
}
