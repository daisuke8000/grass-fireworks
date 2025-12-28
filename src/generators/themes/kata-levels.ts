/**
 * Kata Theme (型) - Japanese Firework Types
 *
 * Traditional firework classification:
 * - Level 1: 和火 (Wabi) - Traditional red-orange emotional firework
 * - Level 2: 牡丹 (Botan/Peony) - Quick-blooming circular burst
 * - Level 3: 蜂 (Hachi/Bee) - Rotating spinning particles
 * - Level 4: 冠菊 (Kankiku/Weeping Willow) - Gold trails with gravity
 * - Level 5: 錦冠千輪 (Nishiki-Kamuro-Senrin) - Gold/silver + multiple small bursts
 */

import {
  FIREWORK_COLORS,
  generateGlowFilter,
  generateSpark,
  generateGravityParticles,
  generateRotatingParticles,
  getCirclePositions,
  type FireworkColorName,
} from '../svg-firework-parts';

export interface KataLevelConfig {
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
 * Level 1: 和火 (Wabi)
 * Traditional red-orange emotional firework, slow and gentle
 */
export function generateKataLevel1(config: KataLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 4.0;

  const x = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.38);
  const explosionDelay = TRAIL_DURATION;

  const glowFilter = generateGlowFilter();

  const trail = generateTrail({
    x,
    startY,
    endY: explosionY,
    color: 'wabi',
    duration: TRAIL_DURATION,
    delay: 0,
    loopInterval,
    id: 'kata1-trail',
  });

  const spark = generateSpark(x, explosionY, 'wabi', explosionDelay, loopInterval);

  const particles = generateParticles({
    cx: x,
    cy: explosionY,
    particleCount: 10,
    distance: 35,
    color: 'wabi',
    duration: 1.2,
    delay: explosionDelay,
    loopInterval,
    applyGlow: true,
    id: 'kata1-particles',
    initialRadius: 3,
  });

  return `<g id="firework-kata-level-1">
  <defs>
    ${glowFilter}
  </defs>
  ${trail}
  ${spark}
  ${particles}
</g>`;
}

/**
 * Level 2: 牡丹 (Botan/Peony)
 * Quick-blooming circular burst, bright and vibrant
 */
export function generateKataLevel2(config: KataLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 3.5;

  const fireworks = [
    { pos: 0.35, delay: 0, color: 'pink' as FireworkColorName, count: 14 },
    { pos: 0.65, delay: 0.5, color: 'sakura' as FireworkColorName, count: 14 },
  ];

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();
  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `kata2-trail-${i}`,
    }));

    elements.push(generateSpark(x, explosionY, fw.color, explosionDelay, loopInterval));

    elements.push(generateParticles({
      cx: x,
      cy: explosionY,
      particleCount: fw.count,
      distance: 55,
      color: fw.color,
      duration: 0.7,
      delay: explosionDelay,
      loopInterval,
      applyGlow: true,
      id: `kata2-particles-${i}`,
      initialRadius: 4,
    }));
  }

  return `<g id="firework-kata-level-2">
  <defs>
    ${glowFilter}
  </defs>
  ${elements.join('\n  ')}
</g>`;
}

/**
 * Level 3: 蜂 (Hachi/Bee)
 * Rotating spinning particles, dynamic movement
 */
export function generateKataLevel3(config: KataLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 4.0;

  const fireworks = [
    { pos: 0.5, delay: 0, color: 'yellow' as FireworkColorName },
    { pos: 0.25, delay: 0.5, color: 'orange' as FireworkColorName },
    { pos: 0.75, delay: 0.9, color: 'yellow' as FireworkColorName },
  ];

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const glowFilter = generateGlowFilter();
  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `kata3-trail-${i}`,
    }));

    elements.push(generateSpark(x, explosionY, fw.color, explosionDelay, loopInterval));

    elements.push(generateRotatingParticles({
      cx: x,
      cy: explosionY,
      particleCount: 16,
      distance: 60,
      color: fw.color,
      duration: 1.0,
      delay: explosionDelay,
      loopDuration: loopInterval,
      rotationSpeed: 540,
      applyGlow: true,
      id: `kata3-rotating-${i}`,
    }));
  }

  return `<g id="firework-kata-level-3">
  <defs>
    ${glowFilter}
  </defs>
  ${elements.join('\n  ')}
</g>`;
}

/**
 * Level 4: 冠菊 (Kankiku/Weeping Willow)
 * Gold trails with gravity effect, elegant drooping
 */
export function generateKataLevel4(config: KataLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 4.5;

  const fireworks = [
    { pos: 0.5, delay: 0, yOffset: 0 },
    { pos: 0.2, delay: 0.3, yOffset: 10 },
    { pos: 0.8, delay: 0.5, yOffset: 10 },
    { pos: 0.35, delay: 0.8, yOffset: 5 },
    { pos: 0.65, delay: 1.0, yOffset: 5 },
  ];

  const startY = canvasHeight;
  const baseExplosionY = Math.round(canvasHeight * 0.32);

  const glowFilter = generateGlowFilter();
  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionY = baseExplosionY + fw.yOffset;
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateTrail({
      x,
      startY,
      endY: explosionY,
      color: 'gold',
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `kata4-trail-${i}`,
    }));

    elements.push(generateSpark(x, explosionY, 'champagne', explosionDelay, loopInterval));

    elements.push(generateGravityParticles({
      cx: x,
      cy: explosionY,
      particleCount: i === 0 ? 20 : 14,
      distance: i === 0 ? 70 : 50,
      color: 'gold',
      duration: 1.4,
      delay: explosionDelay,
      loopDuration: loopInterval,
      gravityDrop: 45,
      applyGlow: true,
      id: `kata4-gravity-${i}`,
    }));
  }

  return `<g id="firework-kata-level-4">
  <defs>
    ${glowFilter}
  </defs>
  ${elements.join('\n  ')}
</g>`;
}

/**
 * Level 5: 錦冠千輪 (Nishiki-Kamuro-Senrin)
 * Gold/silver main burst + multiple small secondary bursts
 */
export function generateKataLevel5(config: KataLevelConfig): string {
  const { canvasWidth, canvasHeight } = config;
  const loopInterval = 5.0;

  const centerX = Math.round(canvasWidth * 0.5);
  const startY = canvasHeight;
  const mainExplosionY = Math.round(canvasHeight * 0.30);
  const mainExplosionDelay = TRAIL_DURATION;

  const glowFilter = generateGlowFilter();

  // Main gold trail
  const mainTrail = generateTrail({
    x: centerX,
    startY,
    endY: mainExplosionY,
    color: 'gold',
    duration: TRAIL_DURATION,
    delay: 0,
    loopInterval,
    id: 'kata5-main-trail',
  });

  const mainSpark = generateSpark(centerX, mainExplosionY, 'white', mainExplosionDelay, loopInterval);

  // Main gold particles with gravity
  const mainParticles = generateGravityParticles({
    cx: centerX,
    cy: mainExplosionY,
    particleCount: 24,
    distance: 85,
    color: 'gold',
    duration: 1.6,
    delay: mainExplosionDelay,
    loopDuration: loopInterval,
    gravityDrop: 50,
    applyGlow: true,
    id: 'kata5-main-gravity',
  });

  // Secondary silver particles (inner layer)
  const silverParticles = generateParticles({
    cx: centerX,
    cy: mainExplosionY,
    particleCount: 16,
    distance: 45,
    color: 'silver',
    duration: 0.8,
    delay: mainExplosionDelay + 0.1,
    loopInterval,
    applyGlow: true,
    id: 'kata5-silver',
    initialRadius: 3,
  });

  // Surrounding small bursts (千輪 - thousand wheels)
  const surroundingFireworks = [
    { pos: 0.15, delay: 0.2, color: 'champagne' as FireworkColorName },
    { pos: 0.85, delay: 0.3, color: 'silver' as FireworkColorName },
    { pos: 0.25, delay: 0.5, color: 'gold' as FireworkColorName },
    { pos: 0.75, delay: 0.6, color: 'champagne' as FireworkColorName },
    { pos: 0.35, delay: 0.8, color: 'silver' as FireworkColorName },
    { pos: 0.65, delay: 0.9, color: 'gold' as FireworkColorName },
    { pos: 0.1, delay: 1.1, color: 'champagne' as FireworkColorName },
    { pos: 0.9, delay: 1.2, color: 'silver' as FireworkColorName },
  ];

  const surroundingElements: string[] = [];
  for (let i = 0; i < surroundingFireworks.length; i++) {
    const fw = surroundingFireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const yOffset = (i % 2) * 15 - 5;
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
      id: `kata5-surround-trail-${i}`,
    }));

    surroundingElements.push(generateParticles({
      cx: x,
      cy: explosionY,
      particleCount: 10,
      distance: 35,
      color: fw.color,
      duration: 0.7,
      delay: explosionDelay,
      loopInterval,
      applyGlow: true,
      id: `kata5-surround-particles-${i}`,
      initialRadius: 2,
    }));
  }

  return `<g id="firework-kata-level-5">
  <defs>
    ${glowFilter}
  </defs>
  ${mainTrail}
  ${mainSpark}
  ${mainParticles}
  ${silverParticles}
  ${surroundingElements.join('\n  ')}
</g>`;
}
