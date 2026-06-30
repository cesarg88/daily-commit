import { describe, expect, it } from "vitest";
import { authenticateFounder } from "./founder-auth";

describe("authenticateFounder", () => {
  it("authenticates an allowed founder account", async () => {
    await expect(
      authenticateFounder(
        {
          email: "founder@example.com",
          password: "password",
        },
        ["founder@example.com"],
        {
          async signInWithPassword() {
            return {
              data: {
                session: {
                  access_token: "access-token",
                  refresh_token: "refresh-token",
                  expires_in: 3600,
                },
                user: {
                  email: "founder@example.com",
                },
              },
              error: null,
            };
          },
        },
      ),
    ).resolves.toEqual({
      status: "authenticated",
      session: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        expiresIn: 3600,
        userEmail: "founder@example.com",
      },
    });
  });

  it("rejects a valid Supabase account that is not allowlisted", async () => {
    await expect(
      authenticateFounder(
        {
          email: "other@example.com",
          password: "password",
        },
        ["founder@example.com"],
        {
          async signInWithPassword() {
            return {
              data: {
                session: {
                  access_token: "access-token",
                  refresh_token: "refresh-token",
                  expires_in: 3600,
                },
                user: {
                  email: "other@example.com",
                },
              },
              error: null,
            };
          },
        },
      ),
    ).resolves.toEqual({
      status: "rejected",
      reason: "not_allowlisted",
    });
  });

  it("rejects login when the founder allowlist is not configured", async () => {
    await expect(
      authenticateFounder(
        {
          email: "founder@example.com",
          password: "password",
        },
        [],
        {
          async signInWithPassword() {
            throw new Error("Sign-in should not run without an allowlist.");
          },
        },
      ),
    ).resolves.toEqual({
      status: "rejected",
      reason: "allowlist_not_configured",
    });
  });
});
