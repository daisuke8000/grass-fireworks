/**
 * Matsuri Theme (祭) - Famous Japanese Firework Festivals
 *
 * Festival-inspired fireworks:
 * - Level 1: 線香花火 (Senko Hanabi) - Sparkler, gentle fading
 * - Level 2: 隅田川 (Sumida River) - Heart and star shaped fireworks
 * - Level 3: 土浦 (Tsuchiura) - Starmine rapid-fire competition
 * - Level 4: 諏訪湖 (Suwa Lake) - Water reflection fireworks
 * - Level 5: 長岡 (Nagaoka) - Phoenix grand finale
 */

import {
  FIREWORK_COLORS,
  generateGlowFilter,
  generateSpark,
  generateShapedParticles,
  generateReflectionPoints,
  generateWaterSurface,
  generateWaterGradient,
  getHeartPositions,
  getStarPositions,
  type FireworkColorName,
} from '../svg-firework-parts';

export interface MatsuriLevelConfig {
  canvasWidth: number;
  canvasHeight: number;
}

// Animation timing constants
const TRAIL_DURATION = 0.6;

/**
 * Generates a smooth trail with easing
 */
function generateTrail(config: {
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

/**
 * Generates smooth particles with size animation
 */
function generateParticles(config: {
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
 * Level 1: 線香花火 (Senko Hanabi - Sparkler)
 * Gentle sparkling particles that slowly fade
 */
export function generateMatsuriLevel1(config: MatsuriLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 5.0;

  const x = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.40);
  const explosionDelay = TRAIL_DURATION;

  const glowFilter = generateGlowFilter();

  const trail = generateTrail({
    x,
    startY,
    endY: explosionY,
    color: 'orange',
    duration: TRAIL_DURATION,
    delay: 0,
    loopInterval,
    id: 'matsuri1-trail',
  });

  // Main sparkler effect - small particles with twinkling
  const sparklerParticles = generateSparklerEffect({
    cx: x,
    cy: explosionY,
    particleCount: 12,
    maxDistance: 25,
    delay: explosionDelay,
    loopInterval,
  });

  return `<g id="firework-matsuri-level-1">
  <defs>
    ${glowFilter}
  </defs>
  ${trail}
  ${sparklerParticles}
</g>`;
}

/**
 * Generates sparkler-like twinkling particles
 */
function generateSparklerEffect(config: {
  cx: number;
  cy: number;
  particleCount: number;
  maxDistance: number;
  delay: number;
  loopInterval: number;
}): string {
  const { cx, cy, particleCount, maxDistance, delay, loopInterval } = config;
  const colorValue = FIREWORK_COLORS['orange'];

  const particles: string[] = [];
  const explosionStart = delay / loopInterval;
  const explosionEnd = (delay + 2.0) / loopInterval;

  for (let i = 0; i < particleCount; i++) {
    const angle = (2 * Math.PI * i) / particleCount;
    const distance = maxDistance * (0.6 + Math.random() * 0.4);
    const dx = Math.round(Math.cos(angle) * distance);
    const dy = Math.round(Math.sin(angle) * distance);
    const twinkleOffset = (i * 0.15) / loopInterval;

    particles.push(`    <circle cx="${cx}" cy="${cy}" r="2" fill="${colorValue}" filter="url(#fireworkGlow)" opacity="0">
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0;0 0;${dx} ${dy};${dx} ${dy + 15}"
                        keyTimes="0;${explosionStart.toFixed(4)};${((delay + 1.0) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)}"
                        dur="${loopInterval}s" begin="0s"
                        repeatCount="indefinite" />
      <animate attributeName="opacity"
               values="0;0;1;0.8;0.4;0"
               keyTimes="0;${(explosionStart + twinkleOffset).toFixed(4)};${((delay + 0.2) / loopInterval + twinkleOffset).toFixed(4)};${((delay + 0.8) / loopInterval).toFixed(4)};${((delay + 1.5) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)}"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
      <animate attributeName="r"
               values="2;2;3;2;1"
               keyTimes="0;${explosionStart.toFixed(4)};${((delay + 0.3) / loopInterval).toFixed(4)};${((delay + 1.0) / loopInterval).toFixed(4)};${explosionEnd.toFixed(4)}"
               dur="${loopInterval}s" begin="0s"
               repeatCount="indefinite" />
    </circle>`);
  }

  return `<g id="matsuri1-sparkler" class="sparkler-particles">
${particles.join('\n')}
  </g>`;
}

/**
 * Level 2: 隅田川 (Sumida River)
 * Heart and star shaped fireworks
 */
export function generateMatsuriLevel2(config: MatsuriLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 4.0;

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();

  // Heart-shaped firework (left)
  const heartX = Math.round(canvasWidth * 0.35);
  const heartPositions = getHeartPositions(20, 2.5);
  const heartDelay = 0;
  const heartExplosionDelay = heartDelay + TRAIL_DURATION;

  const heartTrail = generateTrail({
    x: heartX,
    startY,
    endY: explosionY,
    color: 'crimson',
    duration: TRAIL_DURATION,
    delay: heartDelay,
    loopInterval,
    id: 'matsuri2-heart-trail',
  });

  const heartSpark = generateSpark(heartX, explosionY, 'pink', heartExplosionDelay, loopInterval);

  const heartParticles = generateShapedParticles({
    cx: heartX,
    cy: explosionY,
    positions: heartPositions,
    color: 'crimson',
    duration: 1.0,
    delay: heartExplosionDelay,
    loopDuration: loopInterval,
    applyGlow: true,
    id: 'matsuri2-heart-particles',
    initialRadius: 3,
  });

  // Star-shaped firework (right)
  const starX = Math.round(canvasWidth * 0.65);
  const starPositions = getStarPositions(20, 50, 25);
  const starDelay = 0.6;
  const starExplosionDelay = starDelay + TRAIL_DURATION;

  const starTrail = generateTrail({
    x: starX,
    startY,
    endY: explosionY + 5,
    color: 'yellow',
    duration: TRAIL_DURATION,
    delay: starDelay,
    loopInterval,
    id: 'matsuri2-star-trail',
  });

  const starSpark = generateSpark(starX, explosionY + 5, 'champagne', starExplosionDelay, loopInterval);

  const starParticles = generateShapedParticles({
    cx: starX,
    cy: explosionY + 5,
    positions: starPositions,
    color: 'yellow',
    duration: 1.0,
    delay: starExplosionDelay,
    loopDuration: loopInterval,
    applyGlow: true,
    id: 'matsuri2-star-particles',
    initialRadius: 3,
  });

  return `<g id="firework-matsuri-level-2">
  <defs>
    ${glowFilter}
  </defs>
  ${heartTrail}
  ${heartSpark}
  ${heartParticles}
  ${starTrail}
  ${starSpark}
  ${starParticles}
</g>`;
}

/**
 * Level 3: 土浦 (Tsuchiura)
 * Starmine rapid-fire competition style
 */
export function generateMatsuriLevel3(config: MatsuriLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 3.5;

  const fireworks = [
    { pos: 0.5, delay: 0, color: 'purple' as FireworkColorName, count: 18 },
    { pos: 0.2, delay: 0.15, color: 'pink' as FireworkColorName, count: 14 },
    { pos: 0.8, delay: 0.25, color: 'cyan' as FireworkColorName, count: 14 },
    { pos: 0.35, delay: 0.4, color: 'orange' as FireworkColorName, count: 16 },
    { pos: 0.65, delay: 0.5, color: 'green' as FireworkColorName, count: 16 },
    { pos: 0.15, delay: 0.65, color: 'blue' as FireworkColorName, count: 12 },
    { pos: 0.85, delay: 0.75, color: 'yellow' as FireworkColorName, count: 12 },
  ];

  const startY = canvasHeight;
  const baseExplosionY = Math.round(canvasHeight * 0.32);

  const glowFilter = generateGlowFilter();
  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const yOffset = (i % 3) * 8 - 8;
    const explosionY = baseExplosionY + yOffset;
    const explosionDelay = fw.delay + TRAIL_DURATION * 0.8;

    elements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION * 0.8,
      delay: fw.delay,
      loopInterval,
      id: `matsuri3-trail-${i}`,
    }));

    elements.push(generateSpark(x, explosionY, fw.color, explosionDelay, loopInterval));

    elements.push(generateParticles({
      cx: x,
      cy: explosionY,
      particleCount: fw.count,
      distance: i === 0 ? 65 : 50,
      color: fw.color,
      duration: 0.6,
      delay: explosionDelay,
      loopInterval,
      applyGlow: true,
      id: `matsuri3-particles-${i}`,
      initialRadius: i === 0 ? 4 : 3,
    }));
  }

  return `<g id="firework-matsuri-level-3">
  <defs>
    ${glowFilter}
  </defs>
  ${elements.join('\n  ')}
</g>`;
}

/**
 * Level 4: 諏訪湖 (Suwa Lake)
 * Water reflection fireworks (lightweight version)
 */
export function generateMatsuriLevel4(config: MatsuriLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 4.5;
  const waterY = Math.round(canvasHeight * 0.75);

  const fireworks = [
    { pos: 0.5, delay: 0, color: 'blue' as FireworkColorName, count: 20, distance: 70 },
    { pos: 0.25, delay: 0.4, color: 'purple' as FireworkColorName, count: 16, distance: 55 },
    { pos: 0.75, delay: 0.7, color: 'cyan' as FireworkColorName, count: 16, distance: 55 },
  ];

  const startY = waterY - 10;
  const baseExplosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();
  const waterGradient = generateWaterGradient();
  const waterSurface = generateWaterSurface(canvasWidth, waterY);
  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionY = baseExplosionY + (i * 8);
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `matsuri4-trail-${i}`,
    }));

    elements.push(generateSpark(x, explosionY, fw.color, explosionDelay, loopInterval));

    elements.push(generateParticles({
      cx: x,
      cy: explosionY,
      particleCount: fw.count,
      distance: fw.distance,
      color: fw.color,
      duration: 1.0,
      delay: explosionDelay,
      loopInterval,
      applyGlow: true,
      id: `matsuri4-particles-${i}`,
      initialRadius: 4,
    }));

    // Water reflection (enhanced for visibility)
    elements.push(generateReflectionPoints({
      cx: x,
      cy: explosionY,
      waterY,
      particleCount: fw.count,
      distance: fw.distance * 0.8,
      color: fw.color,
      duration: 1.4,
      delay: explosionDelay + 0.05,
      loopDuration: loopInterval,
      id: `matsuri4-reflection-${i}`,
    }));
  }

  return `<g id="firework-matsuri-level-4">
  <defs>
    ${glowFilter}
    ${waterGradient}
  </defs>
  ${waterSurface}
  ${elements.join('\n  ')}
</g>`;
}

/**
 * Level 5: 長岡 (Nagaoka)
 * Phoenix grand finale - majestic wide display
 */
export function generateMatsuriLevel5(config: MatsuriLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 5.5;

  const centerX = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const mainExplosionY = Math.round(canvasHeight * 0.28);
  const mainExplosionDelay = TRAIL_DURATION;

  const glowFilter = generateGlowFilter();

  // Main Phoenix firework (center)
  const mainTrail = generateTrail({
    x: centerX,
    startY,
    endY: mainExplosionY,
    color: 'orange',
    duration: TRAIL_DURATION,
    delay: 0,
    loopInterval,
    id: 'matsuri5-main-trail',
  });

  const mainSpark = generateSpark(centerX, mainExplosionY, 'white', mainExplosionDelay, loopInterval);

  // Core flash effect
  const coreFlash = generateCoreFlash({
    cx: centerX,
    cy: mainExplosionY,
    size: 30,
    duration: 0.25,
    delay: mainExplosionDelay,
    loopInterval,
  });

  // Ring waves
  const ringWaves = generateRingWaves({
    cx: centerX,
    cy: mainExplosionY,
    maxSize: 100,
    stagger: 0.12,
    delay: mainExplosionDelay,
    loopInterval,
  });

  // Main particles (orange phoenix core)
  const mainParticles = generateParticles({
    cx: centerX,
    cy: mainExplosionY,
    particleCount: 24,
    distance: 90,
    color: 'orange',
    duration: 1.4,
    delay: mainExplosionDelay,
    loopInterval,
    applyGlow: true,
    id: 'matsuri5-main-particles',
    initialRadius: 5,
  });

  // Secondary red particles
  const secondaryParticles = generateParticles({
    cx: centerX,
    cy: mainExplosionY,
    particleCount: 16,
    distance: 55,
    color: 'red',
    duration: 1.0,
    delay: mainExplosionDelay + 0.15,
    loopInterval,
    applyGlow: true,
    id: 'matsuri5-secondary-particles',
    initialRadius: 3,
  });

  // Wide surrounding fireworks (Phoenix wings)
  const surroundingFireworks = [
    { pos: 0.08, delay: 0.1, color: 'red' as FireworkColorName, count: 12 },
    { pos: 0.92, delay: 0.15, color: 'red' as FireworkColorName, count: 12 },
    { pos: 0.18, delay: 0.3, color: 'orange' as FireworkColorName, count: 14 },
    { pos: 0.82, delay: 0.35, color: 'orange' as FireworkColorName, count: 14 },
    { pos: 0.28, delay: 0.5, color: 'yellow' as FireworkColorName, count: 12 },
    { pos: 0.72, delay: 0.55, color: 'yellow' as FireworkColorName, count: 12 },
    { pos: 0.38, delay: 0.7, color: 'champagne' as FireworkColorName, count: 10 },
    { pos: 0.62, delay: 0.75, color: 'champagne' as FireworkColorName, count: 10 },
    { pos: 0.15, delay: 0.9, color: 'pink' as FireworkColorName, count: 10 },
    { pos: 0.85, delay: 0.95, color: 'pink' as FireworkColorName, count: 10 },
  ];

  const surroundingElements: string[] = [];
  for (let i = 0; i < surroundingFireworks.length; i++) {
    const fw = surroundingFireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const yOffset = (i % 3) * 10 - 5;
    const explosionY = mainExplosionY + yOffset;
    const explosionDelay = fw.delay + TRAIL_DURATION;

    surroundingElements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `matsuri5-surround-trail-${i}`,
    }));

    surroundingElements.push(generateParticles({
      cx: x,
      cy: explosionY,
      particleCount: fw.count,
      distance: 40,
      color: fw.color,
      duration: 0.8,
      delay: explosionDelay,
      loopInterval,
      applyGlow: true,
      id: `matsuri5-surround-particles-${i}`,
      initialRadius: 3,
    }));
  }

  return `<g id="firework-matsuri-level-5">
  <defs>
    ${glowFilter}
  </defs>
  ${mainTrail}
  ${mainSpark}
  ${coreFlash}
  ${ringWaves}
  ${mainParticles}
  ${secondaryParticles}
  ${surroundingElements.join('\n  ')}
</g>`;
}

/**
 * Generates core flash effect for Level 5
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

  return `<circle id="matsuri5-core-flash" cx="${cx}" cy="${cy}" r="0" fill="white" opacity="0">
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
 * Generates ring wave effects for Level 5
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

    rings.push(`  <circle id="matsuri5-ring-wave-${i + 1}" cx="${cx}" cy="${cy}" r="0"
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

  return `<g id="matsuri5-ring-waves">
${rings.join('\n')}
  </g>`;
}
