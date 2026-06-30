export function parseFounderEmailAllowlist(
  value: string | undefined,
): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export function isFounderEmailAllowed(
  email: string | null | undefined,
  allowedEmails: readonly string[],
): boolean {
  if (!email) {
    return false;
  }

  return allowedEmails.includes(email.trim().toLowerCase());
}

export function getFounderEmailAllowlist(): string[] {
  return parseFounderEmailAllowlist(process.env.DAILY_COMMIT_FOUNDER_EMAILS);
}
