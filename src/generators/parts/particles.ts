/**
 * Particle Generation Functions
 * Core building blocks for firework animations using CSS classes
 */

import type { FireworkColorName } from '../../constants';
import type { Position } from './shapes';

// ============================================================================
// Theme-specific Trail and Particle Functions (used by kata/matsuri themes)
// ============================================================================

export interface ThemeTrailConfig {
  x: number;
  startY: number;
  endY: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopInterval: number;
  id?: string;
}

/**
 * Generates a trail with CSS class-based timing for theme animations
 * Uses CSS custom properties for per-element timing/direction
 */
export function generateThemeTrail(config: ThemeTrailConfig): string {
  const { x, startY, endY, color, duration, delay, loopInterval, id } = config;
  const trailId = id ? ` id="${id}"` : '';
  const riseY = endY - startY;
  const t0 = delay / loopInterval;
  const t1 = (delay + duration) / loopInterval;

  return `<line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
    stroke="url(#glow-${color})" stroke-width="3" stroke-linecap="round"
    class="trail" style="--rise-y:${riseY}px;--t0:${t0.toFixed(4)};--t1:${t1.toFixed(4)};--dur:${loopInterval}s"/>`;
}

export interface ThemeParticleConfig {
  cx: number;
  cy: number;
  particleCount: number;
  distance: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopInterval: number;
  applyGlow?: boolean;
  id?: string;
  initialRadius?: number;
}

/**
 * Generates particles with CSS class-based timing for theme animations
 * Particles expand outward using CSS custom properties for direction
 */
export function generateThemeParticles(config: ThemeParticleConfig): string {
  const {
    cx,
    cy,
    particleCount,
    distance,
    color,
    duration,
    delay,
    loopInterval,
    id,
    initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0 = delay / loopInterval;
  const t1 = (delay + duration) / loopInterval;
  const r = Math.round(initialRadius * 2.5);

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      class="particle" style="--dx:${dx}px;--dy:${dy}px;--t0:${t0.toFixed(4)};--t1:${t1.toFixed(4)};--dur:${loopInterval}s"/>`
    );
  }

  return `<g${groupId} class="firework-particles">\n${particles.join('\n')}\n  </g>`;
}

/**
 * Generates a spark/twinkle effect using CSS class
 */
export function generateSpark(
  cx: number,
  cy: number,
  color: FireworkColorName,
  delay: number,
  loopDuration: number
): string {
  const t0 = delay / loopDuration;
  const t1 = (delay + 0.3) / loopDuration;

  return `<circle cx="${cx}" cy="${cy}" r="0" fill="white"
    class="spark" style="--t0:${t0.toFixed(3)};--t1:${t1.toFixed(3)};--max-r:8;--dur:${loopDuration}s"/>`;
}

// ============================================================================
// Japanese Firework Theme - Particle Generation Functions (CSS-based)
// ============================================================================

export interface RotatingParticleConfig {
  cx: number;
  cy: number;
  particleCount: number;
  distance: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopDuration: number;
  rotationSpeed?: number;
  applyGlow?: boolean;
  id?: string;
}

/**
 * Generates particles (simplified from rotating SMIL to standard burst in CSS)
 * Rotation was SMIL-specific; CSS version uses standard radial burst
 */
export function generateRotatingParticles(config: RotatingParticleConfig): string {
  const {
    cx,
    cy,
    particleCount,
    distance,
    color,
    duration,
    delay,
    loopDuration,
    id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0 = delay / loopDuration;
  const t1 = (delay + duration) / loopDuration;
  const r = 8;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      class="particle" style="--dx:${dx}px;--dy:${dy}px;--t0:${t0.toFixed(3)};--t1:${t1.toFixed(3)};--dur:${loopDuration}s"/>`
    );
  }

  return `<g${groupId} class="rotating-particles">\n${particles.join('\n')}\n  </g>`;
}

export interface GravityParticleConfig {
  cx: number;
  cy: number;
  particleCount: number;
  distance: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopDuration: number;
  gravityDrop?: number;
  applyGlow?: boolean;
  id?: string;
}

/**
 * Generates particles with gravity effect (Kankiku/Weeping Willow style)
 * Particles expand then droop downward using CSS custom properties
 */
export function generateGravityParticles(config: GravityParticleConfig): string {
  const {
    cx,
    cy,
    particleCount,
    distance,
    color,
    duration,
    delay,
    loopDuration,
    gravityDrop = 40,
    id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0 = delay / loopDuration;
  const t1 = (delay + duration * 0.4) / loopDuration;
  const t2 = (delay + duration) / loopDuration;
  const r = 10;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      class="particle-gravity" style="--dx:${dx}px;--dy:${dy}px;--t0:${t0.toFixed(3)};--t1:${t1.toFixed(3)};--t2:${t2.toFixed(3)};--drop:${gravityDrop}px;--dur:${loopDuration}s"/>`
    );
  }

  return `<g${groupId} class="gravity-particles">\n${particles.join('\n')}\n  </g>`;
}

export interface ShapedParticleConfig {
  cx: number;
  cy: number;
  positions: Position[];
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopDuration: number;
  applyGlow?: boolean;
  id?: string;
  initialRadius?: number;
}

/**
 * Generates particles at custom positions (Heart/Star shapes)
 * Uses pre-calculated positions from getHeartPositions or getStarPositions
 */
export function generateShapedParticles(config: ShapedParticleConfig): string {
  const {
    cx,
    cy,
    positions,
    color,
    duration,
    delay,
    loopDuration,
    id,
    initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0 = delay / loopDuration;
  const t1 = (delay + duration) / loopDuration;
  const r = Math.round(initialRadius * 2.5);

  const particles: string[] = [];

  for (let i = 0; i < positions.length; i++) {
    const { dx, dy } = positions[i];
    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      class="particle" style="--dx:${dx}px;--dy:${dy}px;--t0:${t0.toFixed(3)};--t1:${t1.toFixed(3)};--dur:${loopDuration}s"/>`
    );
  }

  return `<g${groupId} class="shaped-particles">\n${particles.join('\n')}\n  </g>`;
}

export interface ReflectionConfig {
  cx: number;
  cy: number;
  waterY: number;
  particleCount: number;
  distance: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopDuration: number;
  id?: string;
}

/**
 * Generates lightweight water reflection effect (Suwa Lake style)
 * Only draws reflection points using CSS classes, not full mirror
 */
export function generateReflectionPoints(config: ReflectionConfig): string {
  const {
    cx,
    cy,
    waterY,
    particleCount,
    distance,
    color,
    duration,
    delay,
    loopDuration,
    id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const reflectionY = waterY + 15;
  const t0 = delay / loopDuration;
  const t1 = (delay + duration) / loopDuration;
  const r = 10;

  const reflections: string[] = [];

  const reflectionCount = Math.floor(particleCount / 2);
  for (let i = 0; i < reflectionCount; i++) {
    const angle = Math.PI * (0.2 + (i / reflectionCount) * 0.6);
    const dx = Math.round(Math.cos(angle) * distance * 0.9);
    const yOffset = Math.round(Math.sin(angle) * distance * 0.25);
    const particleY = reflectionY + yOffset;
    const driftY = Math.round(Math.sin(angle) * distance * 0.15);

    reflections.push(
      `    <circle cx="${cx}" cy="${particleY}" r="${r}" fill="url(#glow-${color})"
      class="particle" style="--dx:${dx}px;--dy:${driftY}px;--t0:${t0.toFixed(3)};--t1:${t1.toFixed(3)};--dur:${loopDuration}s"/>`
    );
  }

  return `<g${groupId} class="water-reflection" opacity="1.0">\n${reflections.join('\n')}\n  </g>`;
}
