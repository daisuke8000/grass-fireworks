/**
 * Fireworks Level Calculator
 * Determines the fireworks display level based on contribution count
 *
 * Supports dual theme system:
 * - kata (型): Traditional firework types
 * - matsuri (祭): Famous firework festivals
 */

import type { ThemeName } from './theme-selector';

export type FireworksLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Level names in English (default/original)
 */
export const LEVEL_NAMES: Record<FireworksLevel, string> = {
  0: 'Silent Night',
  1: 'Getting Started',
  2: 'Good Progress',
  3: 'Productive Day',
  4: 'On Fire',
  5: 'Legendary',
};

/**
 * Level names for Kata theme (型 - Traditional firework types)
 */
export const LEVEL_NAMES_KATA: Record<FireworksLevel, string> = {
  0: '静夜',
  1: '和火',
  2: '牡丹',
  3: '蜂',
  4: '冠菊',
  5: '錦冠千輪',
};

/**
 * Level names for Matsuri theme (祭 - Famous firework festivals)
 */
export const LEVEL_NAMES_MATSURI: Record<FireworksLevel, string> = {
  0: '静夜',
  1: '線香花火',
  2: '隅田川',
  3: '土浦',
  4: '諏訪湖',
  5: '長岡',
};

/**
 * Calculates the fireworks level based on contribution count
 *
 * Levels:
 * - 0: 0 commits (Silent night)
 * - 1: 1-3 commits (Small)
 * - 2: 4-7 commits (Medium)
 * - 3: 8-15 commits (Large + colorful)
 * - 4: 16-29 commits (Continuous)
 * - 5: 30+ commits (Legendary)
 */
export function calculateLevel(commits: number): FireworksLevel {
  if (commits <= 0) return 0;
  if (commits <= 3) return 1;
  if (commits <= 7) return 2;
  if (commits <= 15) return 3;
  if (commits <= 29) return 4;
  return 5;
}

/**
 * Gets the display name for a fireworks level
 * Supports theme-specific names
 *
 * @param level - The fireworks level (0-5)
 * @param theme - Optional theme name ('kata' or 'matsuri')
 * @returns Display name for the level
 */
export function getLevelName(level: FireworksLevel, theme?: ThemeName): string {
  if (theme === 'kata') {
    return LEVEL_NAMES_KATA[level];
  }
  if (theme === 'matsuri') {
    return LEVEL_NAMES_MATSURI[level];
  }
  // Default: English names (backward compatibility)
  return LEVEL_NAMES[level];
}
