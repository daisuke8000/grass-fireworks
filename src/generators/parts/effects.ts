/**
 * Visual Effects
 * Background fireworks and Niagara waterfall effects
 */

import { type FireworkColorName } from '../../constants';
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
 * Uses CSS classes (.trail, .particle) instead of SMIL animations
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
    const particleCount = 4; // reduced from 6
    const distance = 20 + Math.round(random() * 15);
    const startY = canvasHeight;

    // Trail (CSS animated via .trail class)
    const t0 = delay / loopDuration;
    const t1 = (delay + trailDuration) / loopDuration;
    elements.push(`<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="url(#glow-${color})" stroke-width="1" stroke-linecap="round"
      class="trail" style="--rise-y:${y - startY}px;--t0:${t0.toFixed(4)};--t1:${t1.toFixed(4)};--dur:${loopDuration}s"/>`);

    // Explosion particles (CSS animated via .particle class)
    const et0 = explosionDelay / loopDuration;
    const et1 = (explosionDelay + explosionDuration) / loopDuration;
    for (let j = 0; j < particleCount; j++) {
      const angle = (2 * Math.PI * j) / particleCount;
      const dx = Math.round(Math.cos(angle) * distance);
      const dy = Math.round(Math.sin(angle) * distance);
      elements.push(`<circle cx="${x}" cy="${y}" r="4" fill="url(#glow-${color})"
      class="particle" style="--dx:${dx}px;--dy:${dy}px;--t0:${et0.toFixed(4)};--t1:${et1.toFixed(4)};--dur:${loopDuration}s"/>`);
    }
  }

  return `<g class="background-fireworks" opacity="0.6">\n  ${elements.join('\n  ')}\n</g>`;
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
 * Redesigned: ~40 CSS-animated gradient streams, no SMIL, no filters
 * Wire glow via radialGradient ellipse, bottom fadeout via mask
 */
export function generateNiagaraEffect(config: NiagaraEffectConfig): string {
  const { canvasWidth, canvasHeight, loopDuration: _loopDuration, seed = 42 } = config;
  const random = createSeededRandom(seed);

  // Select color pattern (random if not specified)
  const patternName = config.colorPattern ?? NIAGARA_PATTERN_NAMES[Math.floor(random() * NIAGARA_PATTERN_NAMES.length)];
  const colors = NIAGARA_PATTERNS[patternName];

  const wireY = Math.floor(canvasHeight * 0.5);
  const streamHeight = canvasHeight * 0.50;
  const streamCount = 35;

  const gradientId = `nFade-${seed}`;
  const glowId = `nGlow-${seed}`;
  const maskId = `nMask-${seed}`;
  const colorGradientId = `nColor-${seed}`;

  // Build vertical color gradient stops
  const colorStops = colors.map((color, i) => {
    const offset = (i / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}"/>`;
  }).join('\n      ');

  const elements: string[] = [];

  // Local defs: gradients + mask (no filter elements)
  elements.push(`<defs>
    <linearGradient id="${colorGradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      ${colorStops}
    </linearGradient>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="1"/>
      <stop offset="40%" stop-color="white" stop-opacity="0.9"/>
      <stop offset="80%" stop-color="white" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="${glowId}" cx="50%" cy="0%" r="60%">
      <stop offset="0%" stop-color="${colors[0]}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${colors[0]}" stop-opacity="0"/>
    </radialGradient>
    <mask id="${maskId}">
      <rect x="0" y="${wireY}" width="${canvasWidth}" height="${streamHeight + 20}" fill="url(#${gradientId})"/>
    </mask>
  </defs>`);

  // Ambient glow behind wire (ellipse with radialGradient, replaces feGaussianBlur)
  elements.push(`<ellipse cx="${Math.round(canvasWidth / 2)}" cy="${wireY}" rx="${Math.round(canvasWidth * 0.45)}" ry="50" fill="url(#${glowId})" opacity="0.6"/>`);

  // Wire lines (no filter, gradient stroke)
  elements.push(`<line x1="10" y1="${wireY}" x2="${canvasWidth - 10}" y2="${wireY}" stroke="${colors[0]}" stroke-width="3" opacity="0.9"/>`);
  elements.push(`<line x1="10" y1="${wireY}" x2="${canvasWidth - 10}" y2="${wireY}" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>`);

  // Main streams (~35 gradient lines with CSS flow animation)
  for (let i = 0; i < streamCount; i++) {
    const spacing = canvasWidth / (streamCount + 1);
    const x = Math.round((i + 1) * spacing + (random() - 0.5) * spacing * 0.4);
    const xEnd = x + Math.round((random() - 0.5) * 4);
    const actualHeight = streamHeight * (0.8 + random() * 0.3);
    const strokeWidth = 3 + Math.round(random() * 3);
    const flowDur = (0.5 + random() * 0.5).toFixed(2);
    const delayVal = (random() * 0.5).toFixed(2);
    const dashLen = 18 + Math.round(random() * 8);
    const gapLen = 8 + Math.round(random() * 6);
    const dashTotal = dashLen + gapLen;
    const opacity = (0.4 + random() * 0.4).toFixed(1);

    elements.push(`<line x1="${x}" y1="${wireY}" x2="${xEnd}" y2="${wireY + Math.round(actualHeight)}"
      stroke="url(#${colorGradientId})" stroke-width="${strokeWidth}" stroke-linecap="round"
      stroke-dasharray="${dashLen} ${gapLen}" mask="url(#${maskId})" opacity="${opacity}"
      class="stream" style="--flow-dur:${flowDur}s;--delay:${delayVal}s;--dash-total:${dashTotal}"/>`);
  }

  // White highlight streams (~5)
  for (let i = 0; i < 5; i++) {
    const x = Math.round(canvasWidth * (0.15 + i * 0.18) + (random() - 0.5) * 20);
    const actualHeight = streamHeight * (0.6 + random() * 0.2);
    const flowDur = (0.4 + random() * 0.3).toFixed(2);
    const delayVal = (random() * 0.4).toFixed(2);

    elements.push(`<line x1="${x}" y1="${wireY}" x2="${x + Math.round((random() - 0.5) * 3)}" y2="${wireY + Math.round(actualHeight)}"
      stroke="#ffffff" stroke-width="2" stroke-linecap="round"
      stroke-dasharray="12 18" mask="url(#${maskId})" opacity="0.5"
      class="stream" style="--flow-dur:${flowDur}s;--delay:${delayVal}s;--dash-total:30"/>`);
  }

  return `<g class="niagara-effect">\n  ${elements.join('\n  ')}\n</g>`;
}
