export const MVP_TIMEZONE = "Europe/Madrid";

export function toLocalDateString(
  date: Date,
  timeZone: string = MVP_TIMEZONE,
): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to derive local date parts for MVP timezone.");
  }

  return `${year}-${month}-${day}`;
}

export function getMvpTodayDate(currentDateTime: Date = new Date()): string {
  return toLocalDateString(currentDateTime, MVP_TIMEZONE);
}
