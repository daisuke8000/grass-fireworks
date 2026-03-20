/**
 * Particle Generation Functions
 * Core building blocks for firework animations using SMIL.
 *
 * Uses <animate> / <animateTransform> for motion (cross-browser reliable)
 * and fill="url(#glow-{color})" radialGradient for glow effects
 * (replaces the old feGaussianBlur filter approach).
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
 * Generates a rising trail with SMIL keyTimes-based timing
 * All animations share the same loop, synchronized via keyTimes
 */
export function generateThemeTrail(config: ThemeTrailConfig): string {
  const { x, startY, endY, color, duration, delay, loopInterval, id } = config;
  const trailId = id ? ` id="${id}"` : '';

  const trailEnd = (delay + duration) / loopInterval;
  const fadeEnd = Math.min((delay + duration + 0.3) / loopInterval, 0.99);

  return `<line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="url(#glow-${color})" stroke-width="3" stroke-linecap="round" opacity="0">
    <animate attributeName="y2"
             values="${startY};${startY};${endY};${endY}"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${trailEnd.toFixed(4)};1"
             calcMode="spline"
             keySplines="0 0 1 1;0.4 0 0.2 1;0 0 1 1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="y1"
             values="${startY};${startY};${startY};${endY};${endY}"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${((delay + duration * 0.5) / loopInterval).toFixed(4)};${fadeEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="opacity"
             values="0;0;1;0.8;0;0"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${((delay + 0.05) / loopInterval).toFixed(4)};${trailEnd.toFixed(4)};${fadeEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
  </line>`;
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
 * Generates burst particles with SMIL keyTimes-based timing
 * Particles expand, shrink, and fade in sync with the loop
 */
export function generateThemeParticles(config: ThemeParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopInterval, id, initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';

  const explosionStart = delay / loopInterval;
  const explosionEnd = (delay + duration) / loopInterval;
  const r = Math.round(initialRadius * 2.5);

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${explosionStart.toFixed(4)};${explosionEnd.toFixed(4)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0 0.9 0.3 1;0 0 1 1"
                        dur="${loopInterval}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.7;0;0"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.05) / loopInterval).toFixed(4)};${((delay + duration * 0.7) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)};1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="${r};${r};${r};${Math.round(r * 0.3)};${Math.round(r * 0.3)}"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.1) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)};1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="firework-particles">\n${particles.join('\n')}\n  </g>`;
}

/**
 * Generates a spark/twinkle flash effect using SMIL
 */
export function generateSpark(
  cx: number, cy: number, color: FireworkColorName,
  delay: number, loopDuration: number
): string {
  const sparkDuration = 0.3;
  const sparkStart = delay / loopDuration;
  const sparkEnd = (delay + sparkDuration) / loopDuration;

  return `<circle cx="${cx}" cy="${cy}" r="0" fill="white" opacity="0">
    <animate attributeName="r"
             values="0;0;8;0;0"
             keyTimes="0;${sparkStart.toFixed(3)};${((sparkStart + sparkEnd) / 2).toFixed(3)};${sparkEnd.toFixed(3)};1"
             dur="${loopDuration}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="opacity"
             values="0;0;1;0;0"
             keyTimes="0;${sparkStart.toFixed(3)};${((sparkStart + sparkEnd) / 2).toFixed(3)};${sparkEnd.toFixed(3)};1"
             dur="${loopDuration}s" begin="0s"
             repeatCount="indefinite" />
  </circle>`;
}

// ============================================================================
// Japanese Firework Theme - Particle Generation Functions
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
 * Generates rotating particles (Hachi/Bee style) using SMIL
 * Particles rotate as they expand outward
 */
export function generateRotatingParticles(config: RotatingParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopDuration,
    rotationSpeed = 720, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const r = 8;

  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${explosionStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0 0.9 0.3 1;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animateTransform attributeName="transform"
                        type="rotate"
                        values="0 ${cx} ${cy};0 ${cx} ${cy};${rotationSpeed} ${cx} ${cy};${rotationSpeed} ${cx} ${cy}"
                        keyTimes="0;${explosionStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite"
                        additive="sum" />
      <animate attributeName="opacity"
               values="0;0;1;0;0"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="${r};${r};${r};${Math.round(r * 0.3)};${Math.round(r * 0.3)}"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
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
 * Generates particles with gravity effect (Kankiku/Weeping Willow style) using SMIL
 * Particles expand then droop downward
 */
export function generateGravityParticles(config: GravityParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopDuration, gravityDrop = 40, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const r = 10;

  const explosionStart = delay / loopDuration;
  const expandEnd = (delay + duration * 0.4) / loopDuration;
  const droopEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);
    const finalDy = dy + gravityDrop;

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${finalDy};${dx} ${finalDy}"
                        keyTimes="0;${explosionStart.toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0 0.9 0.3 1;0.5 0 1 0.5;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.8;0;0"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="${r};${r};${r};${Math.round(r * 0.5)};${Math.round(r * 0.25)};${Math.round(r * 0.25)}"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
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
 * Generates particles at custom positions (Heart/Star shapes) using SMIL
 */
export function generateShapedParticles(config: ShapedParticleConfig): string {
  const {
    cx, cy, positions, color, duration, delay,
    loopDuration, id, initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const r = Math.round(initialRadius * 2.5);

  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < positions.length; i++) {
    const { dx, dy } = positions[i];
    const particleDelay = delay + (i * 0.02);
    const pStart = particleDelay / loopDuration;

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${pStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0 0.9 0.3 1;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0;0"
               keyTimes="0;${pStart.toFixed(3)};${((particleDelay + 0.08) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
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
 * Generates water reflection effect (Suwa Lake style) using SMIL
 */
export function generateReflectionPoints(config: ReflectionConfig): string {
  const {
    cx, cy, waterY, particleCount, distance, color,
    duration, delay, loopDuration, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const r = 10;

  const reflectionY = waterY + 15;
  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const reflections: string[] = [];
  const reflectionCount = Math.floor(particleCount / 2);

  for (let i = 0; i < reflectionCount; i++) {
    const angle = Math.PI * (0.2 + (i / reflectionCount) * 0.6);
    const dx = Math.round(Math.cos(angle) * distance * 0.9);
    const yOffset = Math.round(Math.sin(angle) * distance * 0.25);
    const particleY = reflectionY + yOffset;
    const driftY = Math.round(Math.sin(angle) * distance * 0.15);

    reflections.push(`    <circle cx="${cx}" cy="${particleY}" r="${r}" fill="url(#glow-${color})" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${driftY};${dx} ${driftY}"
                        keyTimes="0;${explosionStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.6;0;0"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.15) / loopDuration).toFixed(3)};${((delay + duration * 0.5) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="water-reflection" opacity="1.0">\n${reflections.join('\n')}\n  </g>`;
}
