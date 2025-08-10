/**
 * Checks if the current date and time is past a given date and time plus a specified duration.
 *
 * @param givenTime - The date and time to check against.
 * @param timeInMs - The duration in milliseconds to add to the given date. Defaults to 5 minutes (300000 ms).
 * @returns true if the current date and time is greater than the given date plus the specified duration, otherwise false.
 */
export function isPastTime(
  givenTime: Date | string,
  timeInMs = 1000 * 60 * 5
): boolean {
  const date = new Date(givenTime);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  const now = new Date();

  const futureTime = new Date(date.getTime() + timeInMs);

  return now > futureTime;
}
