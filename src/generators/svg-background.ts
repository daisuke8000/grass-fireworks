/**
 * SVG Background Generator
 * Generates night sky background with twinkling stars using SMIL animations
 */

import type { FireworksLevel } from '../services/fireworks-level';
import { CANVAS, STARS } from '../constants';
import { createSeededRandom, stringToSeed } from '../utils/random';

// Gradient colors
const GRADIENT_TOP = '#0d1117';
const GRADIENT_BOTTOM = '#161b22';

export interface StarConfig {
  isLegendary?: boolean;
  seed?: number;
  width?: number;
  height?: number;
}

export interface NightSkyConfig {
  level: FireworksLevel;
  username?: string;
  width?: number;
  height?: number;
}

/**
 * Generates the gradient background SVG elements
 */
export function generateBackground(
  width: number = CANVAS.DEFAULT_WIDTH,
  height: number = CANVAS.DEFAULT_HEIGHT
): string {
  return `<defs>
    <linearGradient id="nightSkyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${GRADIENT_TOP}" />
      <stop offset="100%" style="stop-color:${GRADIENT_BOTTOM}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#nightSkyGradient)" />`;
}

/**
 * Generates twinkling stars with SMIL animations
 */
export function generateStars(config: StarConfig = {}): string {
  const {
    isLegendary = false,
    seed = Date.now(),
    width = CANVAS.DEFAULT_WIDTH,
    height = CANVAS.DEFAULT_HEIGHT,
  } = config;
  const starCount = isLegendary ? STARS.LEGENDARY_COUNT : STARS.DEFAULT_COUNT;
  const random = createSeededRandom(seed);

  const stars: string[] = [];

  for (let i = 0; i < starCount; i++) {
    const cx = Math.floor(random() * width);
    const cy = Math.floor(random() * height);
    const beginTime = (random() * 2).toFixed(1); // Stagger animation start 0-2s

    stars.push(`<circle cx="${cx}" cy="${cy}" r="${STARS.RADIUS}" fill="${STARS.COLOR}">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="${beginTime}s" repeatCount="indefinite" />
    </circle>`);
  }

  return stars.join('\n    ');
}

/**
 * Generates complete night sky with background and stars
 */
export function generateNightSky(config: NightSkyConfig): string {
  const {
    level,
    username = 'default',
    width = CANVAS.DEFAULT_WIDTH,
    height = CANVAS.DEFAULT_HEIGHT,
  } = config;
  const isLegendary = level === 5;
  const seed = stringToSeed(username);

  const background = generateBackground(width, height);
  const stars = generateStars({ isLegendary, seed, width, height });

  return `<g id="night-sky">
    ${background}
    ${stars}
  </g>`;
}
