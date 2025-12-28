/**
 * Theme Registry
 * Maps theme names and levels to their generator functions
 *
 * This replaces switch statements with a lookup table pattern,
 * improving extensibility and reducing boilerplate.
 */

import type { FireworksLevel } from '../services/fireworks-level';
import type { ThemeName } from '../services/theme-selector';
import {
  generateKataLevel1,
  generateKataLevel2,
  generateKataLevel3,
  generateKataLevel4,
  generateKataLevel5,
} from './themes/kata-levels';
import {
  generateMatsuriLevel1,
  generateMatsuriLevel2,
  generateMatsuriLevel3,
  generateMatsuriLevel4,
  generateMatsuriLevel5,
} from './themes/matsuri-levels';

/**
 * Configuration passed to level generator functions
 */
export interface LevelConfig {
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Type for level generator functions
 */
export type LevelGenerator = (config: LevelConfig) => string;

/**
 * Registry mapping levels (1-5) to their generator functions
 * Level 0 returns empty string (silent night)
 */
type LevelGeneratorMap = {
  [K in Exclude<FireworksLevel, 0>]: LevelGenerator;
};

/**
 * Registry mapping theme names to their level generators
 */
type ThemeRegistry = {
  [T in ThemeName]: LevelGeneratorMap;
};

/**
 * The theme registry - central lookup table for all theme/level combinations
 *
 * Usage:
 * ```typescript
 * const generator = THEME_REGISTRY['kata'][3];
 * const svg = generator({ canvasWidth: 400, canvasHeight: 200 });
 * ```
 */
export const THEME_REGISTRY: ThemeRegistry = {
  kata: {
    1: generateKataLevel1,
    2: generateKataLevel2,
    3: generateKataLevel3,
    4: generateKataLevel4,
    5: generateKataLevel5,
  },
  matsuri: {
    1: generateMatsuriLevel1,
    2: generateMatsuriLevel2,
    3: generateMatsuriLevel3,
    4: generateMatsuriLevel4,
    5: generateMatsuriLevel5,
  },
} as const;

/**
 * Gets the generator function for a specific theme and level
 *
 * @param theme - Theme name ('kata' or 'matsuri')
 * @param level - Fireworks level (0-5)
 * @returns Generator function, or null for level 0
 *
 * @example
 * const generator = getGenerator('matsuri', 3);
 * if (generator) {
 *   const svg = generator({ canvasWidth: 400, canvasHeight: 200 });
 * }
 */
export function getGenerator(
  theme: ThemeName,
  level: FireworksLevel
): LevelGenerator | null {
  if (level === 0) {
    return null; // Level 0: Silent night, no fireworks
  }
  return THEME_REGISTRY[theme][level];
}

/**
 * Generates firework SVG for a given theme and level
 *
 * @param theme - Theme name ('kata' or 'matsuri')
 * @param level - Fireworks level (0-5)
 * @param config - Canvas configuration
 * @returns Generated SVG string, or empty string for level 0
 */
export function generateFirework(
  theme: ThemeName,
  level: FireworksLevel,
  config: LevelConfig
): string {
  const generator = getGenerator(theme, level);
  if (!generator) {
    return '';
  }
  return generator(config);
}

/**
 * Gets all available themes
 */
export function getThemes(): ThemeName[] {
  return Object.keys(THEME_REGISTRY) as ThemeName[];
}

/**
 * Gets all available levels for a theme (excluding 0)
 */
export function getLevels(theme: ThemeName): Exclude<FireworksLevel, 0>[] {
  return Object.keys(THEME_REGISTRY[theme]).map(Number) as Exclude<FireworksLevel, 0>[];
}
