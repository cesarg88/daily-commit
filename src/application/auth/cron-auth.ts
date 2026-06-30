export function isCronRequestAuthorized(
  headers: Pick<Headers, "get">,
  cronSecret: string | undefined,
): boolean {
  if (!cronSecret) {
    return false;
  }

  return headers.get("authorization") === `Bearer ${cronSecret}`;
}
