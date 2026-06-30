import "server-only";

import { SupabaseObjectiveRepository } from "./supabase-objective-repository";
import { createSupabaseAuthenticatedServerClient } from "../supabase/server-clients";

export function createObjectiveRepositoryForUserSession(accessToken: string) {
  return new SupabaseObjectiveRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}
