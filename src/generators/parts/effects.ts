/**
 * Visual Effects
 * Background fireworks and Niagara waterfall effects
 */

import { FIREWORK_COLORS, type FireworkColorName } from '../../constants';
import { createSeededRandom } from '../../utils/random';

export interface BackgroundFireworksConfig {
  canvasWidth: number;
  canvasHeight: number;
  count: number;
  loopDuration: number;
  seed?: number;
}

/**
 * Generates small background fireworks for ambient effect
 * Creates depth and visual interest without overwhelming main fireworks
 */
export function generateBackgroundFireworks(config: BackgroundFireworksConfig): string {
  const { canvasWidth, canvasHeight, count, loopDuration, seed = 42 } = config;
  const random = createSeededRandom(seed);

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
  const random = createSeededRandom(seed);

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
