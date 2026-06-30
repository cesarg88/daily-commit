export const authCookieNames = {
  accessToken: "daily_commit_access_token",
  refreshToken: "daily_commit_refresh_token",
} as const;

export type AuthCookieOptions = {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge?: number;
};

export function getAuthCookieOptions(maxAge?: number): AuthCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function getExpiredAuthCookieOptions(): AuthCookieOptions {
  return getAuthCookieOptions(0);
}
