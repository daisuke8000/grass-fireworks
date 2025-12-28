/**
 * Theme Selector Service
 * Daily theme selection between "kata" (型) and "matsuri" (祭)
 */

export type ThemeName = 'kata' | 'matsuri';

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Selects theme based on date (daily switching)
 * Even days: kata, Odd days: matsuri
 */
export function selectThemeByDate(date: Date = new Date()): ThemeName {
  const dayOfYear = getDayOfYear(date);
  return dayOfYear % 2 === 0 ? 'kata' : 'matsuri';
}

export function isValidTheme(theme: string): theme is ThemeName {
  return theme === 'kata' || theme === 'matsuri';
}
