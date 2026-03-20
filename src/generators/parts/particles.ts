/**
 * Particle Generation Functions
 * Core building blocks for firework animations using CSS @keyframes.
 *
 * Each function generates inline <style> blocks with timing-specific keyframes.
 * Keyframe names encode timing (e.g., "r-0-15" = rise from 0% to 15%).
 * CSS custom properties (--dx, --dy, --rise-y, --drop) provide per-element
 * direction in keyframe VALUES (valid CSS), while timing is baked into
 * static keyframe SELECTORS (required by CSS spec).
 */

import { EASING, type FireworkColorName } from '../../constants';
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
 * Generates a rising trail with inline CSS keyframes
 */
export function generateThemeTrail(config: ThemeTrailConfig): string {
  const { x, startY, endY, color, duration, delay, loopInterval, id } = config;
  const trailId = id ? ` id="${id}"` : '';
  const riseY = endY - startY;
  const t0p = Math.round((delay / loopInterval) * 100);
  const t1p = Math.round(((delay + duration) / loopInterval) * 100);
  const fadeP = Math.min(t1p + 5, 99);
  const kf = `r-${t0p}-${t1p}`;

  return `<g>
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translateY(0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translateY(var(--rise-y));opacity:.8}${fadeP}%{opacity:0}100%{opacity:0}}</style>
  <line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
    stroke="url(#glow-${color})" stroke-width="3" stroke-linecap="round"
    style="--rise-y:${riseY}px;animation:${kf} ${loopInterval}s ${EASING.RISE} infinite"/>
</g>`;
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
 * Generates burst particles with inline CSS keyframes
 */
export function generateThemeParticles(config: ThemeParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopInterval, id, initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0p = Math.round((delay / loopInterval) * 100);
  const t1p = Math.round(((delay + duration) / loopInterval) * 100);
  const fadeP = Math.min(t1p + 5, 99);
  const r = Math.round(initialRadius * 2.5);
  const kf = `b-${t0p}-${t1p}`;

  const particles: string[] = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      style="--dx:${dx}px;--dy:${dy}px;animation:${kf} ${loopInterval}s ${EASING.BURST} infinite"/>`
    );
  }

  return `<g${groupId} class="firework-particles">
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translate(0,0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translate(var(--dx),var(--dy));opacity:.7}${fadeP}%{opacity:0}100%{opacity:0}}</style>
${particles.join('\n')}
  </g>`;
}

/**
 * Generates a spark/twinkle flash effect
 */
export function generateSpark(
  cx: number, cy: number, color: FireworkColorName,
  delay: number, loopDuration: number
): string {
  const t0p = Math.round((delay / loopDuration) * 100);
  const t1p = Math.round(((delay + 0.3) / loopDuration) * 100);
  const midP = Math.round((t0p + t1p) / 2);
  const kf = `sp-${t0p}-${t1p}`;

  return `<g>
  <style>@keyframes ${kf}{0%,${t0p}%{opacity:0;r:0}${midP}%{opacity:1;r:8}${t1p}%{opacity:0;r:0}100%{opacity:0}}</style>
  <circle cx="${cx}" cy="${cy}" r="0" fill="white"
    style="animation:${kf} ${loopDuration}s ease-out infinite"/>
</g>`;
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
 * Generates burst particles (simplified from rotating SMIL)
 */
export function generateRotatingParticles(config: RotatingParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopDuration, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0p = Math.round((delay / loopDuration) * 100);
  const t1p = Math.round(((delay + duration) / loopDuration) * 100);
  const fadeP = Math.min(t1p + 5, 99);
  const r = 8;
  const kf = `b-${t0p}-${t1p}`;

  const particles: string[] = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      style="--dx:${dx}px;--dy:${dy}px;animation:${kf} ${loopDuration}s ${EASING.BURST} infinite"/>`
    );
  }

  return `<g${groupId} class="rotating-particles">
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translate(0,0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translate(var(--dx),var(--dy));opacity:.7}${fadeP}%{opacity:0}100%{opacity:0}}</style>
${particles.join('\n')}
  </g>`;
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
 * Generates particles with gravity droop effect (Kankiku/Weeping Willow)
 */
export function generateGravityParticles(config: GravityParticleConfig): string {
  const {
    cx, cy, particleCount, distance, color,
    duration, delay, loopDuration, gravityDrop = 40, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0p = Math.round((delay / loopDuration) * 100);
  const t1p = Math.round(((delay + duration * 0.4) / loopDuration) * 100);
  const t2p = Math.round(((delay + duration) / loopDuration) * 100);
  const fadeP = Math.min(t2p + 3, 99);
  const r = 10;
  const kf = `bg-${t0p}-${t1p}-${t2p}`;

  const particles: string[] = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      style="--dx:${dx}px;--dy:${dy}px;--drop:${gravityDrop}px;animation:${kf} ${loopDuration}s ${EASING.BURST} infinite"/>`
    );
  }

  return `<g${groupId} class="gravity-particles">
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translate(0,0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translate(var(--dx),var(--dy));opacity:.8}${t2p}%{transform:translate(var(--dx),calc(var(--dy) + var(--drop)));opacity:0}${fadeP}%{opacity:0}100%{opacity:0}}</style>
${particles.join('\n')}
  </g>`;
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
 */
export function generateShapedParticles(config: ShapedParticleConfig): string {
  const {
    cx, cy, positions, color, duration, delay,
    loopDuration, id, initialRadius = 4,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const t0p = Math.round((delay / loopDuration) * 100);
  const t1p = Math.round(((delay + duration) / loopDuration) * 100);
  const fadeP = Math.min(t1p + 5, 99);
  const r = Math.round(initialRadius * 2.5);
  const kf = `b-${t0p}-${t1p}`;

  const particles: string[] = [];
  for (let i = 0; i < positions.length; i++) {
    const { dx, dy } = positions[i];
    particles.push(
      `    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#glow-${color})"
      style="--dx:${dx}px;--dy:${dy}px;animation:${kf} ${loopDuration}s ${EASING.BURST} infinite"/>`
    );
  }

  return `<g${groupId} class="shaped-particles">
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translate(0,0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translate(var(--dx),var(--dy));opacity:.7}${fadeP}%{opacity:0}100%{opacity:0}}</style>
${particles.join('\n')}
  </g>`;
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
 * Generates water reflection effect (Suwa Lake style)
 */
export function generateReflectionPoints(config: ReflectionConfig): string {
  const {
    cx, cy, waterY, particleCount, distance, color,
    duration, delay, loopDuration, id,
  } = config;
  const groupId = id ? ` id="${id}"` : '';
  const reflectionY = waterY + 15;
  const t0p = Math.round((delay / loopDuration) * 100);
  const t1p = Math.round(((delay + duration) / loopDuration) * 100);
  const fadeP = Math.min(t1p + 5, 99);
  const r = 10;
  const kf = `b-${t0p}-${t1p}`;

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
      style="--dx:${dx}px;--dy:${driftY}px;animation:${kf} ${loopDuration}s ${EASING.BURST} infinite"/>`
    );
  }

  return `<g${groupId} class="water-reflection" opacity="1.0">
  <style>@keyframes ${kf}{0%,${t0p}%{transform:translate(0,0);opacity:0}${t0p + 1}%{opacity:1}${t1p}%{transform:translate(var(--dx),var(--dy));opacity:.7}${fadeP}%{opacity:0}100%{opacity:0}}</style>
${reflections.join('\n')}
  </g>`;
}
