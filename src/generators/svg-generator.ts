/**
 * SVG Generator (Integration)
 * Combines all SVG components to generate complete fireworks animation
 */

import type { FireworksLevel } from '../services/fireworks-level';
import { generateNightSky } from './svg-background';
import { generateUserOverlay } from './svg-overlay';
import {
  generateFireworkLevel1,
  generateFireworkLevel2,
  generateFireworkLevel3,
  generateFireworkLevel4,
  generateFireworkLevel5,
} from './svg-firework-levels';

// Default canvas dimensions
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 200;

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
}

/**
 * Generates the firework animation for a specific level
 * Level 0 returns empty string (stars only)
 */
function generateFireworkForLevel(
  level: FireworksLevel,
  width: number,
  height: number
): string {
  const config = {
    canvasWidth: width,
    canvasHeight: height,
  };

  switch (level) {
    case 0:
      return ''; // Level 0: Silent night, no fireworks
    case 1:
      return generateFireworkLevel1(config);
    case 2:
      return generateFireworkLevel2(config);
    case 3:
      return generateFireworkLevel3(config);
    case 4:
      return generateFireworkLevel4(config);
    case 5:
      return generateFireworkLevel5(config);
    default:
      return '';
  }
}

/**
 * Generates complete fireworks SVG with all components
 *
 * Layer order (bottom to top):
 * 1. Night sky background with stars
 * 2. Firework animations (level-specific)
 * 3. User information overlay
 */
export function generateFireworksSVG(config: FireworksSVGConfig): string {
  const {
    username,
    commits,
    level,
    levelName,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
  } = config;

  // Generate each layer
  const nightSky = generateNightSky({ level, username, width, height });
  const fireworks = generateFireworkForLevel(level, width, height);
  const overlay = generateUserOverlay({ username, commits, levelName, width, height });

  // Combine all layers into complete SVG
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${nightSky}
  ${fireworks}
  ${overlay}
</svg>`;
}
