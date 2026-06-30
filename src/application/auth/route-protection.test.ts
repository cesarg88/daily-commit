import { describe, expect, it } from "vitest";
import { decideRouteProtection } from "./route-protection";

describe("decideRouteProtection", () => {
  it("redirects unauthenticated app route access to login", () => {
    expect(decideRouteProtection("/app", "?view=today", false)).toEqual({
      type: "redirect",
      location: "/login?next=%2Fapp%3Fview%3Dtoday",
    });
  });

  it("redirects unauthenticated objective catalog access to login", () => {
    expect(decideRouteProtection("/objectives", "", false)).toEqual({
      type: "redirect",
      location: "/login?next=%2Fobjectives",
    });
  });

  it("allows authenticated app route access", () => {
    expect(decideRouteProtection("/app", "", true)).toEqual({
      type: "allow",
    });
  });

  it("does not protect public auth routes", () => {
    expect(decideRouteProtection("/login", "", false)).toEqual({
      type: "allow",
    });
  });
});
