/**
 * Theme Selector Service
 * Provides daily theme selection between "kata" (型) and "matsuri" (祭)
 *
 * The theme is determined by the day of year:
 * - Even days: kata (型) - Traditional firework types
 * - Odd days: matsuri (祭) - Famous firework festivals
 */

export type ThemeName = 'kata' | 'matsuri';

export const THEME_DISPLAY_NAMES = {
  kata: '型',
  matsuri: '祭',
} as const;

export const LEVEL_NAMES_KATA = {
  0: '静夜',
  1: '和火',
  2: '牡丹',
  3: '蜂',
  4: '冠菊',
  5: '錦冠千輪',
} as const;

export const LEVEL_NAMES_MATSURI = {
  0: '静夜',
  1: '線香花火',
  2: '隅田川',
  3: '土浦',
  4: '諏訪湖',
  5: '長岡',
} as const;

/**
 * Gets the day of year (1-366) for a given date
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Selects theme based on date (daily switching)
 * Uses day of year as seed for deterministic selection
 *
 * @param date - Date to use for selection (defaults to current date)
 * @returns Theme name ('kata' or 'matsuri')
 */
export function selectThemeByDate(date: Date = new Date()): ThemeName {
  const dayOfYear = getDayOfYear(date);
  return dayOfYear % 2 === 0 ? 'kata' : 'matsuri';
}

/**
 * Gets the display name for a theme
 */
export function getThemeDisplayName(theme: ThemeName): string {
  return THEME_DISPLAY_NAMES[theme];
}

/**
 * Gets the level name for a specific level and theme
 */
export function getLevelName(level: number, theme: ThemeName): string {
  const names = theme === 'kata' ? LEVEL_NAMES_KATA : LEVEL_NAMES_MATSURI;
  return names[level as keyof typeof names] || `Level ${level}`;
}

/**
 * Validates if a string is a valid theme name
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return theme === 'kata' || theme === 'matsuri';
}
