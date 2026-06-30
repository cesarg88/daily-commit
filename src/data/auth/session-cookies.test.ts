import { describe, expect, it } from "vitest";
import {
  authCookieNames,
  getAuthCookieOptions,
  getExpiredAuthCookieOptions,
} from "./session-cookies";

describe("auth session cookies", () => {
  it("uses httpOnly cookies for Supabase session tokens", () => {
    expect(authCookieNames).toEqual({
      accessToken: "daily_commit_access_token",
      refreshToken: "daily_commit_refresh_token",
    });
    expect(getAuthCookieOptions(3600)).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 3600,
    });
  });

  it("expires auth cookies on logout", () => {
    expect(getExpiredAuthCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  });
});
