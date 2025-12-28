/**
 * SVG Firework Parts Generator
 * Core building blocks for firework animations using SMIL
 *
 * Improved version with:
 * - Smooth infinite loop animations
 * - Trail fade-out after explosion
 * - Particle size animation (shrinking)
 * - Easing functions for natural motion
 * - Enhanced glow effects
 */

import { FIREWORK_COLORS, type FireworkColorName } from '../constants';

// Re-export for backwards compatibility
export { FIREWORK_COLORS, type FireworkColorName };

/**
 * Position offset for particle placement
 */
export interface Position {
  dx: number;
  dy: number;
}

/**
 * Calculates circular particle positions (default explosion pattern)
 */
export function getCirclePositions(count: number, radius: number): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    positions.push({
      dx: Math.round(Math.cos(angle) * radius),
      dy: Math.round(Math.sin(angle) * radius),
    });
  }
  return positions;
}

/**
 * Calculates heart-shaped particle positions (Sumida River style)
 * Based on parametric equation: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
 */
export function getHeartPositions(count: number, scale: number): Position[] {
  const positions: Position[] = [];
  for (let i = 0; i < count; i++) {
    const t = (2 * Math.PI * i) / count;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    positions.push({
      dx: Math.round(x * scale),
      dy: Math.round(y * scale),
    });
  }
  return positions;
}

/**
 * Calculates star-shaped particle positions (5-pointed star)
 */
export function getStarPositions(count: number, outerRadius: number, innerRadius: number): Position[] {
  const positions: Position[] = [];
  const points = 5;
  const totalPoints = points * 2;

  for (let i = 0; i < count; i++) {
    const pointIndex = i % totalPoints;
    const angle = (2 * Math.PI * pointIndex) / totalPoints - Math.PI / 2;
    const radius = pointIndex % 2 === 0 ? outerRadius : innerRadius;
    positions.push({
      dx: Math.round(Math.cos(angle) * radius),
      dy: Math.round(Math.sin(angle) * radius),
    });
  }
  return positions;
}

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
 * Generates a trail with keyTimes-based timing for theme animations
 * All animations share the same loop, synchronized via keyTimes
 */
export function generateThemeTrail(config: ThemeTrailConfig): string {
  const { x, startY, endY, color, duration, delay, loopInterval, id } = config;
  const colorValue = FIREWORK_COLORS[color];
  const trailId = id ? ` id="${id}"` : '';

  const trailEnd = (delay + duration) / loopInterval;
  const fadeEnd = Math.min((delay + duration + 0.3) / loopInterval, 0.99);

  return `<line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="${colorValue}" stroke-width="3" stroke-linecap="round" opacity="0">
    <animate attributeName="y2"
             values="${startY};${startY};${endY};${endY}"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${trailEnd.toFixed(4)};1"
             calcMode="spline"
             keySplines="0 0 1 1;0.1 0.8 0.2 1;0 0 1 1"
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
 * Generates particles with keyTimes-based timing for theme animations
 * Particles expand, shrink, and fade in sync with the loop
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
    applyGlow = true,
    id,
    initialRadius = 4,
  } = config;
  const colorValue = FIREWORK_COLORS[color];
  const filterAttr = applyGlow ? ' filter="url(#fireworkGlow)"' : '';
  const groupId = id ? ` id="${id}"` : '';

  const explosionStart = delay / loopInterval;
  const explosionEnd = (delay + duration) / loopInterval;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${initialRadius}" fill="${colorValue}"${filterAttr} opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${explosionStart.toFixed(4)};${explosionEnd.toFixed(4)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.1 0.8 0.3 1;0 0 1 1"
                        dur="${loopInterval}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.7;0;0"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.05) / loopInterval).toFixed(4)};${((delay + duration * 0.7) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)};1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="${initialRadius};${initialRadius};${initialRadius};${initialRadius * 0.3};${initialRadius * 0.3}"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.1) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)};1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="firework-particles">
${particles.join('\n')}
  </g>`;
}

/**
 * Generates glow filter for firework effects
 * Enhanced glow with color tint for more vibrant look
 */
export function generateGlowFilter(): string {
  return `<filter id="fireworkGlow" x="-100%" y="-100%" width="300%" height="300%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
    <feColorMatrix in="blur" type="saturate" values="2" result="saturated" />
    <feMerge>
      <feMergeNode in="saturated" />
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>`;
}

/**
 * Generates a spark/twinkle effect for enhanced visual
 */
export function generateSpark(
  cx: number,
  cy: number,
  color: FireworkColorName,
  delay: number,
  loopDuration: number
): string {
  const colorValue = FIREWORK_COLORS[color];
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
// Japanese Firework Theme - New Particle Generation Functions
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
 * Generates rotating particles (Hachi/Bee style)
 * Particles rotate as they expand outward
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
    rotationSpeed = 720,
    applyGlow = false,
    id,
  } = config;
  const colorValue = FIREWORK_COLORS[color];
  const filterAttr = applyGlow ? ' filter="url(#fireworkGlow)"' : '';
  const groupId = id ? ` id="${id}"` : '';

  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="3" fill="${colorValue}"${filterAttr} opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${explosionStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.3 0.7 0.4 1;0 0 1 1"
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
               values="3;3;3;1;1"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="rotating-particles">
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
 * Generates particles with gravity effect (Kankiku/Weeping Willow style)
 * Particles expand then droop downward
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
    applyGlow = false,
    id,
  } = config;
  const colorValue = FIREWORK_COLORS[color];
  const filterAttr = applyGlow ? ' filter="url(#fireworkGlow)"' : '';
  const groupId = id ? ` id="${id}"` : '';

  const explosionStart = delay / loopDuration;
  const expandEnd = (delay + duration * 0.4) / loopDuration;
  const droopEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);
    const finalDy = dy + gravityDrop;

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="4" fill="${colorValue}"${filterAttr} opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${finalDy};${dx} ${finalDy}"
                        keyTimes="0;${explosionStart.toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.2 0.8 0.4 1;0.4 0 0.6 1;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.8;0;0"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="4;4;4;2;1;1"
               keyTimes="0;${explosionStart.toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${expandEnd.toFixed(3)};${droopEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="gravity-particles">
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
    applyGlow = false,
    id,
    initialRadius = 4,
  } = config;
  const colorValue = FIREWORK_COLORS[color];
  const filterAttr = applyGlow ? ' filter="url(#fireworkGlow)"' : '';
  const groupId = id ? ` id="${id}"` : '';

  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const particles: string[] = [];

  for (let i = 0; i < positions.length; i++) {
    const { dx, dy } = positions[i];
    const particleDelay = delay + (i * 0.02);
    const pStart = particleDelay / loopDuration;

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${initialRadius}" fill="${colorValue}"${filterAttr} opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${pStart.toFixed(3)};${explosionEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.1 0.8 0.3 1;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0;0"
               keyTimes="0;${pStart.toFixed(3)};${((particleDelay + 0.08) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g${groupId} class="shaped-particles">
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
 * Generates lightweight water reflection effect (Suwa Lake style)
 * Only draws reflection points, not full mirror
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
  const colorValue = FIREWORK_COLORS[color];
  const groupId = id ? ` id="${id}"` : '';

  // Position reflection just below water surface, not too deep
  const reflectionY = waterY + 15;
  const explosionStart = delay / loopDuration;
  const explosionEnd = (delay + duration) / loopDuration;

  const reflections: string[] = [];

  // Only use particles from lower half of explosion (those that would reflect)
  const reflectionCount = Math.floor(particleCount / 2);
  for (let i = 0; i < reflectionCount; i++) {
    // Spread across lower semicircle for more natural look
    const angle = Math.PI * (0.2 + (i / reflectionCount) * 0.6); // 0.2π to 0.8π range
    const dx = Math.round(Math.cos(angle) * distance * 0.9);
    // Vary Y position based on angle - creates scattered effect instead of band
    const yOffset = Math.round(Math.sin(angle) * distance * 0.25);
    const particleY = reflectionY + yOffset;

    // Small downward drift for reflection animation
    const driftY = Math.round(Math.sin(angle) * distance * 0.15);
    reflections.push(`    <circle cx="${cx}" cy="${particleY}" r="4" fill="${colorValue}" filter="url(#fireworkGlow)" opacity="0">
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

  return `<g${groupId} class="water-reflection" opacity="1.0">
${reflections.join('\n')}
  </g>`;
}

/**
 * Generates water surface line for Suwa Lake theme
 */
export function generateWaterSurface(width: number, waterY: number): string {
  return `<g class="water-surface">
    <line x1="0" y1="${waterY}" x2="${width}" y2="${waterY}"
          stroke="#3a5a8c" stroke-width="2" opacity="0.8"/>
    <rect x="0" y="${waterY}" width="${width}" height="50"
          fill="url(#waterGradient)" opacity="0.15"/>
  </g>`;
}

/**
 * Generates water gradient definition for Suwa Lake theme
 */
export function generateWaterGradient(): string {
  return `<linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style="stop-color:#0a1628;stop-opacity:0.6"/>
    <stop offset="100%" style="stop-color:#061224;stop-opacity:0.3"/>
  </linearGradient>`;
}

export interface BackgroundFireworksConfig {
  canvasWidth: number;
  canvasHeight: number;
  count: number;
  loopDuration: number;
  seed?: number;
}

/**
 * Simple seeded random for reproducible "random" positions
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Generates small background fireworks for ambient effect
 * Creates depth and visual interest without overwhelming main fireworks
 */
export function generateBackgroundFireworks(config: BackgroundFireworksConfig): string {
  const { canvasWidth, canvasHeight, count, loopDuration, seed = 42 } = config;
  const random = seededRandom(seed);

  const colors: FireworkColorName[] = ['blue', 'purple', 'cyan', 'pink', 'green'];
  const elements: string[] = [];

  for (let i = 0; i < count; i++) {
    // Pseudo-random positions (edges and corners, avoiding center)
    const xRatio = random();
    const x = Math.round(canvasWidth * (xRatio < 0.5 ? xRatio * 0.35 : 0.65 + xRatio * 0.35));
    const y = Math.round(canvasHeight * (0.2 + random() * 0.4));

    // Staggered timing throughout the loop
    const delay = (i / count) * loopDuration * 0.8;
    const trailDuration = 0.4;
    const explosionDelay = delay + trailDuration;
    const explosionDuration = 0.5;

    const color = colors[i % colors.length];
    const colorValue = FIREWORK_COLORS[color];
    const particleCount = 6;
    const distance = 20 + Math.round(random() * 15);

    // Small trail
    const trailEnd = (delay + trailDuration) / loopDuration;
    const fadeEnd = Math.min((delay + trailDuration + 0.2) / loopDuration, 0.99);
    const startY = canvasHeight;

    elements.push(`<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="${colorValue}" stroke-width="1" stroke-linecap="round" opacity="0">
    <animate attributeName="y2"
             values="${startY};${startY};${y};${y}"
             keyTimes="0;${(delay / loopDuration).toFixed(4)};${trailEnd.toFixed(4)};1"
             dur="${loopDuration}s" begin="0s" repeatCount="indefinite" />
    <animate attributeName="opacity"
             values="0;0;0.6;0.3;0;0"
             keyTimes="0;${(delay / loopDuration).toFixed(4)};${((delay + 0.05) / loopDuration).toFixed(4)};${trailEnd.toFixed(4)};${fadeEnd.toFixed(4)};1"
             dur="${loopDuration}s" begin="0s" repeatCount="indefinite" />
  </line>`);

    // Small explosion particles
    const expStart = explosionDelay / loopDuration;
    const expEnd = (explosionDelay + explosionDuration) / loopDuration;

    for (let j = 0; j < particleCount; j++) {
      const angle = (2 * Math.PI * j) / particleCount;
      const dx = Math.round(Math.cos(angle) * distance);
      const dy = Math.round(Math.sin(angle) * distance);

      elements.push(`<circle cx="${x}" cy="${y}" r="1.5" fill="${colorValue}" opacity="0">
      <animateTransform attributeName="transform" type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${expStart.toFixed(4)};${expEnd.toFixed(4)};1"
                        dur="${loopDuration}s" begin="0s" repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;0.7;0;0"
               keyTimes="0;${expStart.toFixed(4)};${((explosionDelay + 0.08) / loopDuration).toFixed(4)};${expEnd.toFixed(4)};1"
               dur="${loopDuration}s" begin="0s" repeatCount="indefinite" />
    </circle>`);
    }
  }

  return `<g class="background-fireworks" opacity="0.6">
  ${elements.join('\n  ')}
</g>`;
}

// ============================================================================
// Niagara Effect (Extra - Large waterfall of light)
// ============================================================================

export type NiagaraColorPattern = 'rainbow' | 'gold' | 'sakura' | 'ocean' | 'sunset';

const NIAGARA_PATTERNS: Record<NiagaraColorPattern, string[]> = {
  rainbow: ['#f85149', '#f0883e', '#d29922', '#39d353', '#58a6ff', '#bc8cff'],
  gold: ['#ffd700', '#f7e7ce', '#ffffff'],
  sakura: ['#f778ba', '#ffb7c5', '#ffffff'],
  ocean: ['#39c5cf', '#58a6ff', '#bc8cff'],
  sunset: ['#f85149', '#f0883e', '#d29922'],
};

const NIAGARA_PATTERN_NAMES: NiagaraColorPattern[] = ['rainbow', 'gold', 'sakura', 'ocean', 'sunset'];

export interface NiagaraEffectConfig {
  canvasWidth: number;
  canvasHeight: number;
  loopDuration: number;
  colorPattern?: NiagaraColorPattern;
  seed?: number;
}

/**
 * Generates Niagara waterfall effect (Extra effect)
 * Creates a cascade of falling sparks across the top of the canvas
 */
export function generateNiagaraEffect(config: NiagaraEffectConfig): string {
  const { canvasWidth, canvasHeight, loopDuration, seed = 42 } = config;
  const random = seededRandom(seed);

  // Select color pattern (random if not specified)
  const patternName = config.colorPattern ?? NIAGARA_PATTERN_NAMES[Math.floor(random() * NIAGARA_PATTERN_NAMES.length)];
  const colors = NIAGARA_PATTERNS[patternName];

  const elements: string[] = [];

  // Niagara parameters - "光の大瀑布" effect (bottom half)
  const wireY = Math.floor(canvasHeight * 0.5); // Wire at middle, waterfall falls to bottom
  const streamSpacing = 3; // Dense spacing for thick curtain
  const streamCount = Math.floor(canvasWidth / streamSpacing);
  const streamHeight = canvasHeight * 0.50; // 50% of canvas - flows to bottom edge
  const dashLength = 20; // Longer sparks
  const gapLength = 5; // Shorter gaps for denser flow
  const totalDash = dashLength + gapLength;

  // Enhanced glow filter for dramatic effect
  const glowId = `niagaraGlow-${seed}`;
  const gradientId = `niagaraFade-${seed}`;
  const colorGradientId = `niagaraColor-${seed}`;

  // Build vertical color gradient stops
  const colorStops = colors.map((color, i) => {
    const offset = (i / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}"/>`;
  }).join('\n      ');

  elements.push(`<defs>
    <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="${colorGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      ${colorStops}
    </linearGradient>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="40%" stop-color="white" stop-opacity="0.9"/>
      <stop offset="80%" stop-color="white" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <mask id="niagaraMask-${seed}">
      <rect x="0" y="${wireY}" width="${canvasWidth}" height="${streamHeight + 20}" fill="url(#${gradientId})"/>
    </mask>
  </defs>`);

  // Dramatic top wire with intense glow
  elements.push(`<line x1="-10" y1="${wireY}" x2="${canvasWidth + 10}" y2="${wireY}"
    stroke="${colors[0]}" stroke-width="4" opacity="1" filter="url(#${glowId})">
    <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite"/>
  </line>`);

  // Secondary glow layer for intensity
  elements.push(`<line x1="-10" y1="${wireY}" x2="${canvasWidth + 10}" y2="${wireY}"
    stroke="#ffffff" stroke-width="2" opacity="0.9">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.2s" repeatCount="indefinite"/>
  </line>`);

  // Layer 1: Background glow streams (wider, more transparent) - vertical gradient
  for (let i = 0; i < streamCount; i += 2) {
    const x = i * streamSpacing + streamSpacing / 2;
    const xOffset = (random() - 0.5) * 4;
    const actualX = x + xOffset;
    const actualHeight = streamHeight * (0.9 + random() * 0.2);
    const delay = (i % 12) * 0.03;
    const animDuration = 0.6 + random() * 0.3;

    elements.push(`<line x1="${actualX}" y1="${wireY}" x2="${actualX + (random() - 0.5) * 6}" y2="${wireY + actualHeight}"
      stroke="url(#${colorGradientId})" stroke-width="4" stroke-linecap="round"
      stroke-dasharray="${dashLength * 1.5} ${gapLength}"
      mask="url(#niagaraMask-${seed})"
      opacity="0.4"
      filter="url(#${glowId})">
      <animate attributeName="stroke-dashoffset"
               values="${totalDash * 2};0"
               dur="${animDuration * 1.5}s"
               begin="${delay}s"
               repeatCount="indefinite"/>
    </line>`);
  }

  // Layer 2: Main flowing streams (the core "waterfall") - vertical gradient
  for (let i = 0; i < streamCount; i++) {
    const x = i * streamSpacing + streamSpacing / 2;
    const xOffset = (random() - 0.5) * 2;
    const actualX = x + xOffset;
    const actualHeight = streamHeight * (0.85 + random() * 0.3);
    const delay = (i % 8) * 0.04 + random() * 0.08;
    const strokeWidth = 1.5 + random() * 1.5;
    const animDuration = 0.5 + random() * 0.3;

    elements.push(`<line x1="${actualX}" y1="${wireY}" x2="${actualX + (random() - 0.5) * 3}" y2="${wireY + actualHeight}"
      stroke="url(#${colorGradientId})" stroke-width="${strokeWidth}" stroke-linecap="round"
      stroke-dasharray="${dashLength} ${gapLength}"
      mask="url(#niagaraMask-${seed})"
      opacity="0.9">
      <animate attributeName="stroke-dashoffset"
               values="${totalDash};0"
               dur="${animDuration}s"
               begin="${delay}s"
               repeatCount="indefinite"/>
    </line>`);
  }

  // Layer 3: Bright highlight streams (white/bright accents)
  for (let i = 0; i < streamCount; i += 4) {
    const x = i * streamSpacing + streamSpacing / 2 + 1;
    const actualHeight = streamHeight * (0.7 + random() * 0.2);
    const delay = random() * 0.5;
    const animDuration = 0.4 + random() * 0.2;

    elements.push(`<line x1="${x}" y1="${wireY}" x2="${x + (random() - 0.5) * 2}" y2="${wireY + actualHeight}"
      stroke="#ffffff" stroke-width="1" stroke-linecap="round"
      stroke-dasharray="${dashLength * 0.7} ${gapLength * 1.5}"
      mask="url(#niagaraMask-${seed})"
      opacity="0.8">
      <animate attributeName="stroke-dashoffset"
               values="${totalDash};0"
               dur="${animDuration}s"
               begin="${delay}s"
               repeatCount="indefinite"/>
    </line>`);
  }

  // Layer 4: Falling spark particles for extra dynamism (random color from palette)
  for (let i = 0; i < streamCount; i += 2) {
    const x = i * streamSpacing + streamSpacing / 2;
    const color = colors[Math.floor(random() * colors.length)]; // Random color
    const sparkDelay = random() * loopDuration;
    const actualHeight = streamHeight * 0.8;
    const animDuration = 0.8 + random() * 0.4;
    const xDrift = (random() - 0.5) * 8;

    elements.push(`<circle cx="${x}" cy="${wireY}" r="${1.5 + random()}" fill="${color}" opacity="0">
      <animate attributeName="cy"
               values="${wireY};${wireY + actualHeight}"
               dur="${animDuration}s"
               begin="${sparkDelay}s"
               repeatCount="indefinite"/>
      <animate attributeName="cx"
               values="${x};${x + xDrift}"
               dur="${animDuration}s"
               begin="${sparkDelay}s"
               repeatCount="indefinite"/>
      <animate attributeName="opacity"
               values="0;1;0.8;0.3;0"
               keyTimes="0;0.05;0.3;0.7;1"
               dur="${animDuration}s"
               begin="${sparkDelay}s"
               repeatCount="indefinite"/>
      <animate attributeName="r"
               values="${1.5 + random()};${2 + random()};${0.5}"
               keyTimes="0;0.2;1"
               dur="${animDuration}s"
               begin="${sparkDelay}s"
               repeatCount="indefinite"/>
    </circle>`);
  }

  return `<g class="niagara-effect">
  ${elements.join('\n  ')}
</g>`;
}
