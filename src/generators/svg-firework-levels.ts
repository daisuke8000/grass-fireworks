/**
 * SVG Firework Levels Generator
 * Generates complete firework animations for each level (1-5)
 *
 * Improved version with:
 * - Smooth easing animations (calcMode="spline")
 * - Particle size shrinking
 * - Trail fade-out after explosion
 * - Enhanced visual effects
 */

import {
  FIREWORK_COLORS,
  generateGlowFilter,
  generateSpark,
  type FireworkColorName,
} from './svg-firework-parts';

export interface FireworkLevelConfig {
  /** Canvas width in pixels */
  canvasWidth: number;
  /** Canvas height in pixels */
  canvasHeight: number;
}

// Animation timing constants
const TRAIL_DURATION = 0.6;
const EXPLOSION_DURATION = 0.8;

// Level 1 specific settings
const LEVEL1_LOOP_INTERVAL = 3.5;
const LEVEL1_PARTICLE_COUNT = 8;
const LEVEL1_DISTANCE = 30;
const LEVEL1_COLOR: FireworkColorName = 'green';

// Level 2 specific settings (non-sequential launch)
const LEVEL2_LOOP_INTERVAL = 4;
const LEVEL2_FIREWORKS = [
  { pos: 0.7, delay: 0, particleCount: 14, distance: 50, color: 'blue' as FireworkColorName },
  { pos: 0.3, delay: 0.6, particleCount: 14, distance: 50, color: 'green' as FireworkColorName },
];

// Level 3 specific settings (non-sequential launch)
const LEVEL3_LOOP_INTERVAL = 4;
const LEVEL3_FIREWORKS = [
  { pos: 0.5, delay: 0, particleCount: 20, distance: 70, color: 'purple' as FireworkColorName },
  { pos: 0.25, delay: 0.5, particleCount: 18, distance: 60, color: 'orange' as FireworkColorName },
  { pos: 0.75, delay: 0.9, particleCount: 18, distance: 60, color: 'pink' as FireworkColorName },
];

// Level 4 specific settings (non-sequential launch pattern)
const LEVEL4_LOOP_INTERVAL = 3;
const LEVEL4_COLORS: FireworkColorName[] = ['green', 'blue', 'purple', 'orange', 'cyan'];
// Non-sequential positions and delays for varied visual effect
const LEVEL4_FIREWORKS = [
  { pos: 0.5, delay: 0, particleCount: 20, distance: 70 },    // Center first
  { pos: 0.2, delay: 0.25, particleCount: 14, distance: 50 }, // Left
  { pos: 0.8, delay: 0.4, particleCount: 18, distance: 65 },  // Right
  { pos: 0.35, delay: 0.6, particleCount: 16, distance: 55 }, // Left-center
  { pos: 0.65, delay: 0.75, particleCount: 20, distance: 70 }, // Right-center
];

// Level 5 specific settings (flashy legendary display with smooth fade)
const LEVEL5_LOOP_INTERVAL = 4.5;
const LEVEL5_PRIMARY_PARTICLE_COUNT = 20;
const LEVEL5_PRIMARY_DISTANCE = 90;
const LEVEL5_PRIMARY_DURATION = 1.6; // Extended for smoother fade-out
const LEVEL5_SECONDARY_PARTICLE_COUNT = 4;
const LEVEL5_SECONDARY_DISTANCE = 20;
const LEVEL5_SECONDARY_DELAY = 0.4;
const LEVEL5_CORE_FLASH_SIZE = 25; // Reduced to not overpower particles
const LEVEL5_CORE_FLASH_DURATION = 0.2; // Shorter flash
const LEVEL5_RING_WAVE_SIZE = 110;
const LEVEL5_RING_WAVE_STAGGER = 0.1;
// More surrounding fireworks with non-sequential timing
const LEVEL5_SURROUNDING_FIREWORKS = [
  { pos: 0.15, delay: 0.1, color: 'pink' as FireworkColorName, particleCount: 12, distance: 45 },
  { pos: 0.85, delay: 0.2, color: 'cyan' as FireworkColorName, particleCount: 14, distance: 50 },
  { pos: 0.3, delay: 0.35, color: 'yellow' as FireworkColorName, particleCount: 12, distance: 45 },
  { pos: 0.7, delay: 0.45, color: 'purple' as FireworkColorName, particleCount: 14, distance: 50 },
  { pos: 0.25, delay: 0.6, color: 'green' as FireworkColorName, particleCount: 10, distance: 40 },
  { pos: 0.75, delay: 0.7, color: 'blue' as FireworkColorName, particleCount: 12, distance: 45 },
  { pos: 0.4, delay: 0.85, color: 'red' as FireworkColorName, particleCount: 10, distance: 40 },
  { pos: 0.6, delay: 0.95, color: 'orange' as FireworkColorName, particleCount: 12, distance: 45 },
];
const LEVEL5_MAIN_COLOR: FireworkColorName = 'orange';

/**
 * Generates a smooth trail with easing and proper fade-out
 */
function generateSmoothTrail(config: {
  x: number;
  startY: number;
  endY: number;
  color: FireworkColorName;
  duration: number;
  delay: number;
  loopInterval: number;
  id?: string;
}): string {
  const { x, startY, endY, color, duration, delay, loopInterval, id } = config;
  const colorValue = FIREWORK_COLORS[color];
  const trailId = id ? ` id="${id}"` : '';

  // Calculate keyTimes for animation phases
  const trailEnd = (delay + duration) / loopInterval;
  const fadeEnd = Math.min((delay + duration + 0.3) / loopInterval, 0.99);

  return `<line${trailId} x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="${colorValue}" stroke-width="3" stroke-linecap="round" opacity="0">
    <!-- Rise animation with acceleration -->
    <animate attributeName="y2"
             values="${startY};${startY};${endY};${endY}"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${trailEnd.toFixed(4)};1"
             calcMode="spline"
             keySplines="0 0 1 1;0.1 0.8 0.2 1;0 0 1 1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <!-- Trail shrinks from bottom -->
    <animate attributeName="y1"
             values="${startY};${startY};${startY};${endY};${endY}"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${((delay + duration * 0.5) / loopInterval).toFixed(4)};${fadeEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <!-- Opacity: appear, bright, fade -->
    <animate attributeName="opacity"
             values="0;0;1;0.8;0;0"
             keyTimes="0;${(delay / loopInterval).toFixed(4)};${((delay + 0.05) / loopInterval).toFixed(4)};${trailEnd.toFixed(4)};${fadeEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
  </line>`;
}

/**
 * Generates smooth particles with size animation and easing
 */
function generateSmoothParticles(config: {
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
}): string {
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
      <!-- Explosion with deceleration -->
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${explosionStart.toFixed(4)};${explosionEnd.toFixed(4)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.1 0.8 0.3 1;0 0 1 1"
                        dur="${loopInterval}s" begin="0s"
                        repeatCount="indefinite" />
      <!-- Opacity: flash bright then fade -->
      <animate attributeName="opacity"
               values="0;0;1;0.7;0;0"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.05) / loopInterval).toFixed(4)};${((delay + duration * 0.7) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)};1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
      <!-- Size: shrink as particle moves outward -->
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
 * Generates a complete firework with trail, spark, and explosion
 */
function generateFirework(config: {
  x: number;
  startY: number;
  explosionY: number;
  color: FireworkColorName;
  particleCount: number;
  distance: number;
  trailDelay: number;
  loopInterval: number;
  applyGlow?: boolean;
  id?: string;
  initialRadius?: number;
}): string {
  const {
    x,
    startY,
    explosionY,
    color,
    particleCount,
    distance,
    trailDelay,
    loopInterval,
    applyGlow = true,
    id,
    initialRadius = 4,
  } = config;

  const explosionDelay = trailDelay + TRAIL_DURATION;

  const trail = generateSmoothTrail({
    x,
    startY,
    endY: explosionY,
    color,
    duration: TRAIL_DURATION,
    delay: trailDelay,
    loopInterval,
    id: id ? `${id}-trail` : undefined,
  });

  const spark = generateSpark(x, explosionY, color, explosionDelay, loopInterval);

  const particles = generateSmoothParticles({
    cx: x,
    cy: explosionY,
    particleCount,
    distance,
    color,
    duration: EXPLOSION_DURATION,
    delay: explosionDelay,
    loopInterval,
    applyGlow,
    id: id ? `${id}-particles` : undefined,
    initialRadius,
  });

  return `${trail}\n  ${spark}\n${particles}`;
}

/**
 * Level 1: Small firework, 1 shot, center position
 */
export function generateFireworkLevel1(config: FireworkLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;

  const x = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  const firework = generateFirework({
    x,
    startY,
    explosionY,
    color: LEVEL1_COLOR,
    particleCount: LEVEL1_PARTICLE_COUNT,
    distance: LEVEL1_DISTANCE,
    trailDelay: 0,
    loopInterval: LEVEL1_LOOP_INTERVAL,
    applyGlow: true,
    id: 'fw1',
    initialRadius: 3,
  });

  return `<g id="firework-level-1">
  <defs>
    ${glowFilter}
  </defs>
  ${firework}
</g>`;
}

/**
 * Level 2: Medium fireworks, 2 shots, non-sequential launch
 */
export function generateFireworkLevel2(config: FireworkLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  const fireworks = LEVEL2_FIREWORKS.map((fw, index) => {
    const x = Math.round(canvasWidth * fw.pos);

    return generateFirework({
      x,
      startY,
      explosionY,
      color: fw.color,
      particleCount: fw.particleCount,
      distance: fw.distance,
      trailDelay: fw.delay,
      loopInterval: LEVEL2_LOOP_INTERVAL,
      applyGlow: true,
      id: `fw2-${index + 1}`,
      initialRadius: 4,
    });
  });

  return `<g id="firework-level-2">
  <defs>
    ${glowFilter}
  </defs>
  ${fireworks.join('\n  ')}
</g>`;
}

/**
 * Level 3: Large fireworks, 3 shots, non-sequential colorful
 */
export function generateFireworkLevel3(config: FireworkLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  const fireworks = LEVEL3_FIREWORKS.map((fw, index) => {
    const x = Math.round(canvasWidth * fw.pos);

    return generateFirework({
      x,
      startY,
      explosionY,
      color: fw.color,
      particleCount: fw.particleCount,
      distance: fw.distance,
      trailDelay: fw.delay,
      loopInterval: LEVEL3_LOOP_INTERVAL,
      applyGlow: true,
      id: `fw3-${index + 1}`,
      initialRadius: 4,
    });
  });

  return `<g id="firework-level-3">
  <defs>
    ${glowFilter}
  </defs>
  ${fireworks.join('\n  ')}
</g>`;
}

/**
 * Level 4: Continuous launch, 5 shots, non-sequential positions
 */
export function generateFireworkLevel4(config: FireworkLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  const fireworks = LEVEL4_FIREWORKS.map((fw, index) => {
    const x = Math.round(canvasWidth * fw.pos);
    const color = LEVEL4_COLORS[index % LEVEL4_COLORS.length];

    return generateFirework({
      x,
      startY,
      explosionY,
      color,
      particleCount: fw.particleCount,
      distance: fw.distance,
      trailDelay: fw.delay,
      loopInterval: LEVEL4_LOOP_INTERVAL,
      applyGlow: true,
      id: `fw4-${index + 1}`,
      initialRadius: fw.particleCount > 15 ? 5 : 4,
    });
  });

  return `<g id="firework-level-4">
  <defs>
    ${glowFilter}
  </defs>
  ${fireworks.join('\n  ')}
</g>`;
}

/**
 * Generates two-stage explosion for Level 5
 */
function generateTwoStageExplosion(config: {
  cx: number;
  cy: number;
  primaryParticleCount: number;
  primaryDistance: number;
  primaryDuration: number;
  secondaryParticleCount: number;
  secondaryDistance: number;
  secondaryDelay: number;
  color: FireworkColorName;
  explosionDelay: number;
  loopInterval: number;
}): string {
  const {
    cx,
    cy,
    primaryParticleCount,
    primaryDistance,
    primaryDuration,
    secondaryParticleCount,
    secondaryDistance,
    secondaryDelay,
    color,
    explosionDelay,
    loopInterval,
  } = config;
  const colorValue = FIREWORK_COLORS[color];

  const primaryStart = explosionDelay / loopInterval;
  const primaryEnd = (explosionDelay + primaryDuration) / loopInterval;
  const secondaryStart = (explosionDelay + secondaryDelay) / loopInterval;
  const secondaryEnd = (explosionDelay + secondaryDelay + 0.6) / loopInterval;

  const primaryParticles: string[] = [];
  const secondaryGroups: string[] = [];

  for (let i = 0; i < primaryParticleCount; i++) {
    const angle = (2 * Math.PI * i) / primaryParticleCount;
    const dx = Math.round(Math.cos(angle) * primaryDistance);
    const dy = Math.round(Math.sin(angle) * primaryDistance);

    // Ultra-smooth fade with minimal keyframes and gentle easing
    const peakTime = ((explosionDelay + 0.1) / loopInterval).toFixed(4);
    primaryParticles.push(`    <circle cx="${cx}" cy="${cy}" r="6" fill="${colorValue}" filter="url(#fireworkGlow)" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy}"
                        keyTimes="0;${primaryStart.toFixed(4)};${primaryEnd.toFixed(4)};1"
                        calcMode="spline"
                        keySplines="0 0 1 1;0.05 0.7 0.2 1;0 0 1 1"
                        dur="${loopInterval}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0"
               keyTimes="0;${primaryStart.toFixed(4)};${peakTime};${primaryEnd.toFixed(4)}"
               calcMode="spline"
               keySplines="0 0 1 1;0.2 0 0.1 1;0.1 0 0.4 1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="6;6;6;1"
               keyTimes="0;${primaryStart.toFixed(4)};${peakTime};${primaryEnd.toFixed(4)}"
               calcMode="spline"
               keySplines="0 0 1 1;0 0 1 1;0.1 0 0.5 1"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);

    // Secondary explosions
    const secondaryCx = cx + dx;
    const secondaryCy = cy + dy;
    const secondaryParticles: string[] = [];

    for (let j = 0; j < secondaryParticleCount; j++) {
      const secAngle = (2 * Math.PI * j) / secondaryParticleCount;
      const secDx = Math.round(Math.cos(secAngle) * secondaryDistance);
      const secDy = Math.round(Math.sin(secAngle) * secondaryDistance);

      // Ultra-smooth secondary explosion
      const secPeakTime = ((explosionDelay + secondaryDelay + 0.08) / loopInterval).toFixed(4);
      secondaryParticles.push(`      <circle cx="${secondaryCx}" cy="${secondaryCy}" r="2" fill="${colorValue}" filter="url(#fireworkGlow)" opacity="0">
        <animateTransform attributeName="transform"
                          type="translate"
                          values="0 0;0 0;${secDx} ${secDy};${secDx} ${secDy}"
                          keyTimes="0;${secondaryStart.toFixed(4)};${secondaryEnd.toFixed(4)};1"
                          calcMode="spline"
                          keySplines="0 0 1 1;0.05 0.7 0.2 1;0 0 1 1"
                          dur="${loopInterval}s" begin="0s"
                          repeatCount="indefinite" />
        <animate attributeName="opacity"
                 values="0;0;0.8;0"
                 keyTimes="0;${secondaryStart.toFixed(4)};${secPeakTime};${secondaryEnd.toFixed(4)}"
                 calcMode="spline"
                 keySplines="0 0 1 1;0.2 0 0.1 1;0.1 0 0.4 1"
                 dur="${loopInterval}s" begin="0s"
                 repeatCount="indefinite" />
      </circle>`);
    }

    secondaryGroups.push(`    <g class="secondary-explosion-${i}">
${secondaryParticles.join('\n')}
    </g>`);
  }

  return `<g id="fw5-main-primary" class="firework-particles">
${primaryParticles.join('\n')}
  </g>
  <g id="fw5-main-secondary" class="secondary-explosions">
${secondaryGroups.join('\n')}
  </g>`;
}

/**
 * Generates core flash effect
 */
function generateCoreFlash(config: {
  cx: number;
  cy: number;
  size: number;
  duration: number;
  delay: number;
  loopInterval: number;
}): string {
  const { cx, cy, size, duration, delay, loopInterval } = config;

  const flashStart = delay / loopInterval;
  const flashEnd = (delay + duration) / loopInterval;

  return `<circle id="fw5-core-flash" cx="${cx}" cy="${cy}" r="0" fill="white" opacity="0">
    <animate attributeName="r"
             values="0;0;${size};${size * 0.2};0"
             keyTimes="0;${flashStart.toFixed(4)};${((delay + duration * 0.3) / loopInterval).toFixed(4)};${flashEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="opacity"
             values="0;0;1;0.3;0;0"
             keyTimes="0;${flashStart.toFixed(4)};${((delay + duration * 0.2) / loopInterval).toFixed(4)};${((delay + duration * 0.5) / loopInterval).toFixed(4)};${flashEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
  </circle>`;
}

/**
 * Generates ring wave effects
 */
function generateRingWaves(config: {
  cx: number;
  cy: number;
  maxSize: number;
  stagger: number;
  delay: number;
  loopInterval: number;
}): string {
  const { cx, cy, maxSize, stagger, delay, loopInterval } = config;

  const rings: string[] = [];

  for (let i = 0; i < 2; i++) {
    const ringDelay = delay + i * stagger;
    const ringStart = ringDelay / loopInterval;
    const ringEnd = (ringDelay + 0.6) / loopInterval;

    rings.push(`  <circle id="fw5-ring-wave-${i + 1}" cx="${cx}" cy="${cy}" r="0"
      fill="none" stroke="white" stroke-width="3" opacity="0">
    <animate attributeName="r"
             values="0;0;${maxSize};${maxSize}"
             keyTimes="0;${ringStart.toFixed(4)};${ringEnd.toFixed(4)};1"
             calcMode="spline"
             keySplines="0 0 1 1;0.2 0.8 0.4 1;0 0 1 1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="opacity"
             values="0;0;0.8;0;0"
             keyTimes="0;${ringStart.toFixed(4)};${((ringDelay + 0.1) / loopInterval).toFixed(4)};${ringEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
    <animate attributeName="stroke-width"
             values="4;4;4;1;1"
             keyTimes="0;${ringStart.toFixed(4)};${((ringDelay + 0.1) / loopInterval).toFixed(4)};${ringEnd.toFixed(4)};1"
             dur="${loopInterval}s" begin="0s"
             repeatCount="indefinite" />
  </circle>`);
  }

  return `<g id="fw5-ring-waves">
${rings.join('\n')}
  </g>`;
}

/**
 * Level 5: Legendary day - Special effects
 */
export function generateFireworkLevel5(config: FireworkLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;

  const centerX = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  const explosionDelay = TRAIL_DURATION;

  // Main firework trail
  const mainTrail = generateSmoothTrail({
    x: centerX,
    startY,
    endY: explosionY,
    color: LEVEL5_MAIN_COLOR,
    duration: TRAIL_DURATION,
    delay: 0,
    loopInterval: LEVEL5_LOOP_INTERVAL,
    id: 'fw5-main-trail',
  });

  // Main spark
  const mainSpark = generateSpark(centerX, explosionY, LEVEL5_MAIN_COLOR, explosionDelay, LEVEL5_LOOP_INTERVAL);

  // Two-stage explosion
  const twoStageExplosion = generateTwoStageExplosion({
    cx: centerX,
    cy: explosionY,
    primaryParticleCount: LEVEL5_PRIMARY_PARTICLE_COUNT,
    primaryDistance: LEVEL5_PRIMARY_DISTANCE,
    primaryDuration: LEVEL5_PRIMARY_DURATION,
    secondaryParticleCount: LEVEL5_SECONDARY_PARTICLE_COUNT,
    secondaryDistance: LEVEL5_SECONDARY_DISTANCE,
    secondaryDelay: LEVEL5_SECONDARY_DELAY,
    color: LEVEL5_MAIN_COLOR,
    explosionDelay,
    loopInterval: LEVEL5_LOOP_INTERVAL,
  });

  // Core flash
  const coreFlash = generateCoreFlash({
    cx: centerX,
    cy: explosionY,
    size: LEVEL5_CORE_FLASH_SIZE,
    duration: LEVEL5_CORE_FLASH_DURATION,
    delay: explosionDelay,
    loopInterval: LEVEL5_LOOP_INTERVAL,
  });

  // Ring waves
  const ringWaves = generateRingWaves({
    cx: centerX,
    cy: explosionY,
    maxSize: LEVEL5_RING_WAVE_SIZE,
    stagger: LEVEL5_RING_WAVE_STAGGER,
    delay: explosionDelay,
    loopInterval: LEVEL5_LOOP_INTERVAL,
  });

  // Many surrounding fireworks with non-sequential timing for flashy effect
  const surroundingFireworks = LEVEL5_SURROUNDING_FIREWORKS.map((fw, index) => {
    const x = Math.round(canvasWidth * fw.pos);
    // Vary explosion heights for more dynamic look
    const yOffset = index % 2 === 0 ? 15 : -10;

    return generateFirework({
      x,
      startY,
      explosionY: explosionY + yOffset,
      color: fw.color,
      particleCount: fw.particleCount,
      distance: fw.distance,
      trailDelay: fw.delay,
      loopInterval: LEVEL5_LOOP_INTERVAL,
      applyGlow: true,
      id: `fw5-surround-${index + 1}`,
      initialRadius: 3,
    });
  });

  return `<g id="firework-level-5">
  <defs>
    ${glowFilter}
  </defs>
  ${mainTrail}
  ${mainSpark}
  ${coreFlash}
  ${ringWaves}
  ${twoStageExplosion}
  ${surroundingFireworks.join('\n  ')}
</g>`;
}
