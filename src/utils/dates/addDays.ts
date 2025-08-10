/**
 * Adds a specified number of business days (excluding weekends) to a given date.
 *
 * @param {string} date - The starting date as a string (should be in a valid format).
 * @param {number} days - The number of days to add.
 * @returns {Date} The new date with the added days, adjusted to avoid weekends.
 */

export function addBusinessDays(date: string, days: number): Date {
  const result = new Date(date); // Create a new Date object to avoid mutating the original
  result.setDate(result.getDate() + days); // Add the specified number of days

  // Adjust if the resulting date falls on a weekend
  while (result.getDay() === 6 || result.getDay() === 0) {
    // 6 = Saturday, 0 = Sunday
    result.setDate(result.getDate() + 1); // Move to the next day
  }

  return result;
}
