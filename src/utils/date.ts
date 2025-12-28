/**
 * Date Utilities
 * Common date-related calculations for theme selection and extra effects
 */

/**
 * Calculates the day of year (1-366) for a given date
 *
 * @param date - The date to calculate day of year for
 * @returns Day of year (1-366)
 *
 * @example
 * getDayOfYear(new Date('2024-01-01')); // 1
 * getDayOfYear(new Date('2024-12-31')); // 366 (leap year)
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Checks if a day is a "lucky day" (every 10th day of the year)
 * Used for bonus effects like Niagara fireworks
 *
 * @param date - The date to check
 * @returns true if the day is a lucky day
 *
 * @example
 * isLuckyDay(new Date('2024-01-10')); // true (day 10)
 * isLuckyDay(new Date('2024-01-20')); // true (day 20)
 * isLuckyDay(new Date('2024-01-15')); // false (day 15)
 */
export function isLuckyDay(date: Date = new Date()): boolean {
  return getDayOfYear(date) % 10 === 0;
}
