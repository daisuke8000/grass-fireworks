/**
 * Theme Selector Service
 * Daily theme selection between "kata" (型) and "matsuri" (祭)
 */

import { getDayOfYear } from '../utils/date';

export type ThemeName = 'kata' | 'matsuri';

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
