/**
 * SVG Background Generator
 * Generates night sky background with twinkling stars using SMIL animations
 */

import type { FireworksLevel } from '../services/fireworks-level';

// Default canvas dimensions
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 200;

// Star configuration
const DEFAULT_STAR_COUNT = 25;
const LEGENDARY_STAR_COUNT = 35;
const STAR_COLOR = '#8b949e';
const STAR_RADIUS = 2;

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
 * Simple seeded random number generator (mulberry32)
 * Provides deterministic random values for consistent star positions
 */
function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Converts a string to a numeric seed for random generation
 */
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates the gradient background SVG elements
 */
export function generateBackground(
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT
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
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
  } = config;
  const starCount = isLegendary ? LEGENDARY_STAR_COUNT : DEFAULT_STAR_COUNT;
  const random = seededRandom(seed);

  const stars: string[] = [];

  for (let i = 0; i < starCount; i++) {
    const cx = Math.floor(random() * width);
    const cy = Math.floor(random() * height);
    const beginTime = (random() * 2).toFixed(1); // Stagger animation start 0-2s

    stars.push(`<circle cx="${cx}" cy="${cy}" r="${STAR_RADIUS}" fill="${STAR_COLOR}">
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
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
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
