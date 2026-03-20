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
  generateSpark,
  generateGravityParticles,
  generateRotatingParticles,
  generateThemeTrail,
  generateThemeParticles,
  type FireworkColorName,
} from '../svg-firework-parts';

export interface KataLevelConfig {
  canvasWidth: number;
  canvasHeight: number;
}

const TRAIL_DURATION = 0.6;

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

  const trail = generateThemeTrail({
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

  const particles = generateThemeParticles({
    cx: x,
    cy: explosionY,
    particleCount: 8,
    distance: 35,
    color: 'wabi',
    duration: 1.2,
    delay: explosionDelay,
    loopInterval,
    id: 'kata1-particles',
    initialRadius: 3,
  });

  return `<g id="firework-kata-level-1">
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
    { pos: 0.35, delay: 0, color: 'pink' as FireworkColorName, count: 10 },
    { pos: 0.65, delay: 0.5, color: 'sakura' as FireworkColorName, count: 10 },
  ];

  const startY = canvasHeight;
  const explosionY = Math.round(canvasHeight * 0.35);

  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateThemeTrail({
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

    elements.push(generateThemeParticles({
      cx: x,
      cy: explosionY,
      particleCount: fw.count,
      distance: 55,
      color: fw.color,
      duration: 0.7,
      delay: explosionDelay,
      loopInterval,
      id: `kata2-particles-${i}`,
      initialRadius: 4,
    }));
  }

  return `<g id="firework-kata-level-2">
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

  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateThemeTrail({
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
      particleCount: 12,
      distance: 60,
      color: fw.color,
      duration: 1.0,
      delay: explosionDelay,
      loopDuration: loopInterval,
      rotationSpeed: 540,
      id: `kata3-rotating-${i}`,
    }));
  }

  return `<g id="firework-kata-level-3">
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

  const elements: string[] = [];

  for (let i = 0; i < fireworks.length; i++) {
    const fw = fireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const explosionY = baseExplosionY + fw.yOffset;
    const explosionDelay = fw.delay + TRAIL_DURATION;

    elements.push(generateThemeTrail({
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
      particleCount: i === 0 ? 14 : 10,
      distance: i === 0 ? 70 : 50,
      color: 'gold',
      duration: 1.4,
      delay: explosionDelay,
      loopDuration: loopInterval,
      gravityDrop: 45,
      id: `kata4-gravity-${i}`,
    }));
  }

  return `<g id="firework-kata-level-4">
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

  // Main gold trail
  const mainTrail = generateThemeTrail({
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
    particleCount: 16,
    distance: 85,
    color: 'gold',
    duration: 1.6,
    delay: mainExplosionDelay,
    loopDuration: loopInterval,
    gravityDrop: 50,
    id: 'kata5-main-gravity',
  });

  // Secondary silver particles (inner layer)
  const silverParticles = generateThemeParticles({
    cx: centerX,
    cy: mainExplosionY,
    particleCount: 12,
    distance: 45,
    color: 'silver',
    duration: 0.8,
    delay: mainExplosionDelay + 0.1,
    loopInterval,
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
  ];

  const surroundingElements: string[] = [];
  for (let i = 0; i < surroundingFireworks.length; i++) {
    const fw = surroundingFireworks[i];
    const x = Math.round(canvasWidth * fw.pos);
    const yOffset = (i % 2) * 15 - 5;
    const explosionY = mainExplosionY + yOffset;
    const explosionDelay = fw.delay + TRAIL_DURATION;

    surroundingElements.push(generateThemeTrail({
      x,
      startY,
      endY: explosionY,
      color: fw.color,
      duration: TRAIL_DURATION,
      delay: fw.delay,
      loopInterval,
      id: `kata5-surround-trail-${i}`,
    }));

    surroundingElements.push(generateThemeParticles({
      cx: x,
      cy: explosionY,
      particleCount: 8,
      distance: 35,
      color: fw.color,
      duration: 0.7,
      delay: explosionDelay,
      loopInterval,
      id: `kata5-surround-particles-${i}`,
      initialRadius: 2,
    }));
  }

  return `<g id="firework-kata-level-5">
  ${mainTrail}
  ${mainSpark}
  ${mainParticles}
  ${silverParticles}
  ${surroundingElements.join('\n  ')}
</g>`;
}
