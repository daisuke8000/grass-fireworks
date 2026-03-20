/**
 * Centralized constants for grass-fireworks
 * Consolidates magic numbers from across the codebase
 */

// =============================================================================
// Canvas Dimensions
// =============================================================================

export const CANVAS = {
  /** Default SVG width */
  DEFAULT_WIDTH: 400,
  /** Default SVG height */
  DEFAULT_HEIGHT: 200,
  /** Minimum allowed width */
  MIN_WIDTH: 200,
  /** Maximum allowed width */
  MAX_WIDTH: 800,
  /** Minimum allowed height */
  MIN_HEIGHT: 100,
  /** Maximum allowed height */
  MAX_HEIGHT: 400,
} as const;

// =============================================================================
// Cache Configuration
// =============================================================================

export const CACHE = {
  /** Fireworks endpoint cache TTL in seconds (1 hour) */
  TTL_FIREWORKS: 3600,
  /** Demo endpoint cache TTL in seconds (1 year - immutable) */
  TTL_DEMO: 31536000,
} as const;

// =============================================================================
// GitHub API Configuration
// =============================================================================

export const GITHUB_API = {
  /** Default timeout in milliseconds */
  DEFAULT_TIMEOUT_MS: 10000,
} as const;

// =============================================================================
// Star Configuration (Night Sky)
// =============================================================================

export const STARS = {
  /** Default star count for normal levels */
  DEFAULT_COUNT: 25,
  /** Star count for legendary level (level 5) */
  LEGENDARY_COUNT: 35,
  /** Star fill color */
  COLOR: '#8b949e',
  /** Star radius */
  RADIUS: 2,
} as const;

// =============================================================================
// Animation Timing
// =============================================================================

export const ANIMATION = {
  /** Default loop duration in seconds */
  DEFAULT_LOOP_DURATION: 4.0,
  /** Star twinkle duration in seconds */
  STAR_TWINKLE_DURATION: '2s',
} as const;

// =============================================================================
// Easing Curves (CSS cubic-bezier)
// =============================================================================

export const EASING = {
  /** Trail launch: fast acceleration → deceleration at apex */
  RISE: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Particle explosion: instant acceleration → slow decay */
  BURST: 'cubic-bezier(0.0, 0.9, 0.3, 1)',
  /** Gravity fall: gentle acceleration (natural drop) */
  GRAVITY: 'cubic-bezier(0.5, 0, 1, 0.5)',
  /** Fade out: fast dim → slow afterglow */
  FADE: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// =============================================================================
// Color Palette
// =============================================================================

/**
 * Color palette for fireworks
 * Includes GitHub contribution colors + Japanese traditional firework colors
 */
export const FIREWORK_COLORS = {
  // GitHub contribution colors
  green: '#39d353',
  blue: '#58a6ff',
  purple: '#bc8cff',
  orange: '#f0883e',
  pink: '#f472b6',
  yellow: '#fbbf24',
  cyan: '#39c5cf',
  red: '#f85149',
  // Japanese traditional firework colors (和火・伝統色)
  gold: '#f59e0b',
  silver: '#e2e8f0',
  wabi: '#e8834a',
  sakura: '#ffb7c5',
  white: '#ffffff',
  champagne: '#f7e7ce',
  crimson: '#ef4444',
} as const;

export type FireworkColorName = keyof typeof FIREWORK_COLORS;
