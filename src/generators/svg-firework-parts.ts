/**
 * SVG Firework Parts Generator
 * Core building blocks for firework animations using SMIL
 *
 * This file re-exports from split modules for backwards compatibility.
 * New code should import directly from ./parts/ for better tree-shaking.
 *
 * @module svg-firework-parts
 * @see ./parts/shapes.ts - Position calculation functions
 * @see ./parts/filters.ts - SVG filter and gradient definitions
 * @see ./parts/particles.ts - Particle generation functions
 * @see ./parts/effects.ts - Background and Niagara effects
 */

// Re-export constants for backwards compatibility
export { FIREWORK_COLORS, type FireworkColorName } from '../constants';

// Re-export all from parts modules
export * from './parts';
