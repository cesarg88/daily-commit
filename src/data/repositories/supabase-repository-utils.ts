import type { PostgrestError } from "@supabase/supabase-js";

export class SupabaseRepositoryError extends Error {
  constructor(message: string, cause?: PostgrestError | Error) {
    super(message);
    this.name = "SupabaseRepositoryError";
    this.cause = cause;
  }
}

export async function requireData<T>(
  operation: PromiseLike<{ data: T | null; error: PostgrestError | null }>,
  message: string,
): Promise<NonNullable<T>> {
  const { data, error } = await operation;

  if (error) {
    throw new SupabaseRepositoryError(message, error);
  }

  if (data === null) {
    throw new SupabaseRepositoryError(`${message}: no data returned`);
  }

  return data as NonNullable<T>;
}

export async function requireNoError(
  operation: PromiseLike<{ error: PostgrestError | null }>,
  message: string,
): Promise<void> {
  const { error } = await operation;

  if (error) {
    throw new SupabaseRepositoryError(message, error);
  }
}
