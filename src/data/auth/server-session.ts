import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getFounderEmailAllowlist,
  isFounderEmailAllowed,
} from "@/application/auth/founder-allowlist";
import { createSupabaseAuthenticatedServerClient } from "@/data/supabase/server-clients";
import { authCookieNames } from "./session-cookies";

export type AuthenticatedFounder = {
  id: string;
  email: string;
  accessToken: string;
};

export async function getAuthenticatedFounder(): Promise<AuthenticatedFounder | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieNames.accessToken)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseAuthenticatedServerClient(accessToken);
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.email) {
    return null;
  }

  if (!isFounderEmailAllowed(data.user.email, getFounderEmailAllowlist())) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
    accessToken,
  };
}

export async function requireAuthenticatedFounder(): Promise<AuthenticatedFounder> {
  const founder = await getAuthenticatedFounder();

  if (!founder) {
    redirect("/login");
  }

  return founder;
}
