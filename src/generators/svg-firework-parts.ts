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

/**
 * Color palette for fireworks (GitHub contribution graph inspired)
 */
export const FIREWORK_COLORS = {
  green: '#39d353',
  blue: '#58a6ff',
  purple: '#bc8cff',
  orange: '#f0883e',
  pink: '#f778ba',
  yellow: '#d29922',
  cyan: '#39c5cf',
  red: '#f85149',
} as const;

export type FireworkColorName = keyof typeof FIREWORK_COLORS;

export interface TrailConfig {
  /** X position of the trail */
  x: number;
  /** Starting Y position (bottom) */
  startY: number;
  /** Ending Y position (top, explosion point) */
  endY: number;
  /** Color name from palette */
  color: FireworkColorName;
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds */
  delay: number;
  /** Total loop duration (for repeat timing) */
  loopDuration: number;
  /** Optional unique ID for the trail */
  id?: string;
}

export interface ParticleConfig {
  /** Center X position (explosion point) */
  cx: number;
  /** Center Y position (explosion point) */
  cy: number;
  /** Number of particles in the explosion */
  particleCount: number;
  /** Distance particles travel from center */
  distance: number;
  /** Color name from palette */
  color: FireworkColorName;
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds (after trail completes) */
  delay: number;
  /** Total loop duration (for repeat timing) */
  loopDuration: number;
  /** Whether to apply glow filter */
  applyGlow?: boolean;
  /** Optional unique ID prefix for particles */
  id?: string;
  /** Initial particle radius (default: 3) */
  initialRadius?: number;
  /** Final particle radius (default: 1) */
  finalRadius?: number;
}

/**
 * Generates a trail (launch trajectory) for a firework
 * Uses <line> with <animate> for the rising effect
 * Trail fades out after reaching the top
 */
export function generateTrail(config: TrailConfig): string {
  const { x, startY, endY, color, duration, delay, loopDuration, id } = config;
  const colorValue = FIREWORK_COLORS[color];
  const trailId = id ? ` id="${id}"` : '';

  // Trail rises, then fades out
  const fadeDelay = delay + duration; // Start fading when rise completes
  const fadeDuration = 0.3; // Quick fade

  return `<line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="${colorValue}" stroke-width="2" stroke-linecap="round" opacity="0">
    <!-- Rise animation with easing -->
    <animate attributeName="y2"
             values="${startY};${endY};${endY}"
             keyTimes="0;1;1"
             calcMode="spline"
             keySplines="0.4 0 0.2 1;0 0 1 1"
             dur="${loopDuration}s" begin="${delay}s"
             repeatCount="indefinite" />
    <!-- Trail opacity: appear, stay, fade out -->
    <animate attributeName="opacity"
             values="0;1;1;0;0"
             keyTimes="0;0.01;${(duration / loopDuration).toFixed(3)};${((duration + fadeDuration) / loopDuration).toFixed(3)};1"
             dur="${loopDuration}s" begin="${delay}s"
             repeatCount="indefinite" />
    <!-- Trail tip also moves up -->
    <animate attributeName="y1"
             values="${startY};${startY};${endY};${endY}"
             keyTimes="0;${(duration * 0.3 / loopDuration).toFixed(3)};${(duration / loopDuration).toFixed(3)};1"
             dur="${loopDuration}s" begin="${delay}s"
             repeatCount="indefinite" />
  </line>`;
}

/**
 * Generates explosion particles for a firework
 * Uses <circle> with <animateTransform> for radial explosion
 * Particles shrink and fade as they expand outward
 */
export function generateParticles(config: ParticleConfig): string {
  const {
    cx,
    cy,
    particleCount,
    distance,
    color,
    duration,
    delay,
    loopDuration,
    applyGlow = false,
    id,
    initialRadius = 3,
    finalRadius = 1,
  } = config;
  const colorValue = FIREWORK_COLORS[color];
  const filterAttr = applyGlow ? ' filter="url(#fireworkGlow)"' : '';
  const groupId = id ? ` id="${id}"` : '';

  const particles: string[] = [];
  const explosionEnd = (delay + duration) / loopDuration;

  for (let i = 0; i < particleCount; i++) {
    // Calculate angle for even distribution
    const angle = (2 * Math.PI * i) / particleCount;
    // Calculate end position offset
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="${initialRadius}" fill="${colorValue}"${filterAttr} opacity="0">
      <!-- Explosion movement with easing (decelerate) -->
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${(delay / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.2 0.8 0.4 1;0 0 1 1"
                        dur="${loopDuration}s" begin="0s"
                        repeatCount="indefinite" />
      <!-- Opacity: appear on explosion, fade out -->
      <animate attributeName="opacity"
               values="0;0;1;0;0"
               keyTimes="0;${(delay / loopDuration).toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
               repeatCount="indefinite" />
      <!-- Size: shrink as particle expands -->
      <animate attributeName="r"
               values="${initialRadius};${initialRadius};${initialRadius};${finalRadius};${finalRadius}"
               keyTimes="0;${(delay / loopDuration).toFixed(3)};${((delay + 0.1) / loopDuration).toFixed(3)};${explosionEnd.toFixed(3)};1"
               dur="${loopDuration}s" begin="0s"
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
