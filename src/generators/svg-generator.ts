/**
 * SVG Generator (Integration)
 * Combines all SVG components to generate complete fireworks animation
 *
 * Supports dual theme system:
 * - kata (型): Traditional firework types
 * - matsuri (祭): Famous firework festivals
 */

import type { FireworksLevel } from '../services/fireworks-level';
import type { ThemeName } from '../services/theme-selector';
import { CANVAS } from '../constants';
import { generateNightSky } from './svg-background';
import { generateUserOverlay } from './svg-overlay';
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
import { generateBackgroundFireworks, generateNiagaraEffect } from './svg-firework-parts';

export interface FireworksSVGConfig {
  /** GitHub username */
  username: string;
  /** Today's contribution count */
  commits: number;
  /** Calculated fireworks level (0-5) */
  level: FireworksLevel;
  /** Display name for the level */
  levelName: string;
  /** Canvas width (default: 400) */
  width?: number;
  /** Canvas height (default: 200) */
  height?: number;
  /** Theme name (kata or matsuri, optional) */
  theme?: ThemeName;
  /** Extra effect: Niagara firework (triggered by high commits or lucky day) */
  isExtra?: boolean;
}

interface LevelConfig {
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Generates the firework animation for Kata theme
 */
function generateKataFirework(level: FireworksLevel, config: LevelConfig): string {
  switch (level) {
    case 0:
      return ''; // Level 0: Silent night, no fireworks
    case 1:
      return generateKataLevel1(config);
    case 2:
      return generateKataLevel2(config);
    case 3:
      return generateKataLevel3(config);
    case 4:
      return generateKataLevel4(config);
    case 5:
      return generateKataLevel5(config);
    default:
      return '';
  }
}

/**
 * Generates the firework animation for Matsuri theme
 */
function generateMatsuriFirework(level: FireworksLevel, config: LevelConfig): string {
  switch (level) {
    case 0:
      return ''; // Level 0: Silent night, no fireworks
    case 1:
      return generateMatsuriLevel1(config);
    case 2:
      return generateMatsuriLevel2(config);
    case 3:
      return generateMatsuriLevel3(config);
    case 4:
      return generateMatsuriLevel4(config);
    case 5:
      return generateMatsuriLevel5(config);
    default:
      return '';
  }
}

/**
 * Generates the firework animation for a specific level and theme
 */
function generateFireworkForLevel(
  level: FireworksLevel,
  width: number,
  height: number,
  theme: ThemeName
): string {
  const config: LevelConfig = {
    canvasWidth: width,
    canvasHeight: height,
  };

  if (theme === 'matsuri') {
    return generateMatsuriFirework(level, config);
  }
  // Default to kata
  return generateKataFirework(level, config);
}

/**
 * Generates complete fireworks SVG with all components
 *
 * Layer order (bottom to top):
 * 1. Night sky background with stars
 * 2. Firework animations (level-specific, theme-specific)
 * 3. User information overlay
 */
export function generateFireworksSVG(config: FireworksSVGConfig): string {
  const {
    username,
    commits,
    level,
    levelName,
    width = CANVAS.DEFAULT_WIDTH,
    height = CANVAS.DEFAULT_HEIGHT,
    theme,
    isExtra = false,
  } = config;

  // Generate each layer
  const nightSky = generateNightSky({ level, username, width, height });
  const fireworks = generateFireworkForLevel(level, width, height, theme ?? 'kata');
  const overlay = generateUserOverlay({ username, commits, levelName, width, height, isExtra });

  // Background fireworks for levels 1-5 (more for higher levels)
  const bgFireworksCount = level > 0 ? Math.min(level + 1, 4) : 0;
  const bgFireworks = bgFireworksCount > 0
    ? generateBackgroundFireworks({
        canvasWidth: width,
        canvasHeight: height,
        count: bgFireworksCount,
        loopDuration: 4.0,
        seed: level * 17, // Different seed per level for variety
      })
    : '';

  // Extra: Niagara effect (waterfall of sparks from top)
  const niagara = isExtra
    ? generateNiagaraEffect({
        canvasWidth: width,
        canvasHeight: height,
        loopDuration: 4.0,
      })
    : '';

  // Combine all layers into complete SVG
  // Layer order: nightSky → bgFireworks → fireworks → niagara (top) → overlay
  // Niagara is placed on top for maximum "light curtain" impact
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${nightSky}
  ${bgFireworks}
  ${fireworks}
  ${niagara}
  ${overlay}
</svg>`;
}
