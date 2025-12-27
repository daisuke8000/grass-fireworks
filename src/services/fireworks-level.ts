/**
 * Fireworks Level Calculator
 * Determines the fireworks display level based on contribution count
 */

export type FireworksLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Level names in English
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
 */
export function getLevelName(level: FireworksLevel): string {
  return LEVEL_NAMES[level];
}
