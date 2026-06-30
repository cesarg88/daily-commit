import { isFounderEmailAllowed } from "./founder-allowlist";

export type FounderCredentials = {
  email: string;
  password: string;
};

export type AuthenticatedFounderSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userEmail: string;
};

type SupabaseSignInResult = {
  data: {
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    } | null;
    user: {
      email?: string | null;
    } | null;
  };
  error: {
    message: string;
  } | null;
};

export type FounderAuthDependencies = {
  signInWithPassword(
    credentials: FounderCredentials,
  ): Promise<SupabaseSignInResult>;
};

export type FounderAuthResult =
  | {
      status: "authenticated";
      session: AuthenticatedFounderSession;
    }
  | {
      status: "rejected";
      reason:
        "invalid_credentials" | "not_allowlisted" | "allowlist_not_configured";
    };

export async function authenticateFounder(
  credentials: FounderCredentials,
  allowedEmails: readonly string[],
  dependencies: FounderAuthDependencies,
): Promise<FounderAuthResult> {
  if (allowedEmails.length === 0) {
    return {
      status: "rejected",
      reason: "allowlist_not_configured",
    };
  }

  const { data, error } = await dependencies.signInWithPassword(credentials);

  if (error || !data.session || !data.user?.email) {
    return {
      status: "rejected",
      reason: "invalid_credentials",
    };
  }

  if (!isFounderEmailAllowed(data.user.email, allowedEmails)) {
    return {
      status: "rejected",
      reason: "not_allowlisted",
    };
  }

  return {
    status: "authenticated",
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      userEmail: data.user.email,
    },
  };
}
