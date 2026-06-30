import "server-only";

import { SupabaseDayRepository } from "./supabase-day-repository";
import { SupabaseObjectiveRepository } from "./supabase-objective-repository";
import { createSupabaseAuthenticatedServerClient } from "../supabase/server-clients";

export function createObjectiveRepositoryForUserSession(accessToken: string) {
  return new SupabaseObjectiveRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}

export function createDayRepositoryForUserSession(accessToken: string) {
  return new SupabaseDayRepository(
    createSupabaseAuthenticatedServerClient(accessToken),
  );
}
