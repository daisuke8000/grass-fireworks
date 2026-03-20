/**
 * Visual Effects
 * Background fireworks and Niagara waterfall effects
 */

import { EASING, type FireworkColorName } from '../../constants';
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
 * Each firework generates inline keyframes with timing baked in
 */
export function generateBackgroundFireworks(config: BackgroundFireworksConfig): string {
  const { canvasWidth, canvasHeight, count, loopDuration, seed = 42 } = config;
  const random = createSeededRandom(seed);

  const colors: FireworkColorName[] = ['blue', 'purple', 'cyan', 'pink', 'green'];
  const elements: string[] = [];
  const usedKeyframes = new Set<string>();

  for (let i = 0; i < count; i++) {
    const xRatio = random();
    const x = Math.round(canvasWidth * (xRatio < 0.5 ? xRatio * 0.35 : 0.65 + xRatio * 0.35));
    const y = Math.round(canvasHeight * (0.2 + random() * 0.4));

    const delay = (i / count) * loopDuration * 0.8;
    const trailDuration = 0.4;
    const explosionDelay = delay + trailDuration;
    const explosionDuration = 0.5;

    const color = colors[i % colors.length];
    const particleCount = 4;
    const distance = 20 + Math.round(random() * 15);
    const startY = canvasHeight;
    const riseY = y - startY;

    // Trail keyframe
    const rt0p = Math.round((delay / loopDuration) * 100);
    const rt1p = Math.round(((delay + trailDuration) / loopDuration) * 100);
    const rFadeP = Math.min(rt1p + 5, 99);
    const rKf = `r-${rt0p}-${rt1p}`;

    if (!usedKeyframes.has(rKf)) {
      usedKeyframes.add(rKf);
      elements.push(`<style>@keyframes ${rKf}{0%,${rt0p}%{transform:translateY(0);opacity:0}${rt0p + 1}%{opacity:1}${rt1p}%{transform:translateY(var(--rise-y));opacity:.8}${rFadeP}%{opacity:0}100%{opacity:0}}</style>`);
    }

    elements.push(`<line x1="${x}" y1="${startY}" x2="${x}" y2="${startY}"
      stroke="url(#glow-${color})" stroke-width="1" stroke-linecap="round"
      style="--rise-y:${riseY}px;animation:${rKf} ${loopDuration}s ${EASING.RISE} infinite"/>`);

    // Burst keyframe
    const bt0p = Math.round((explosionDelay / loopDuration) * 100);
    const bt1p = Math.round(((explosionDelay + explosionDuration) / loopDuration) * 100);
    const bFadeP = Math.min(bt1p + 5, 99);
    const bKf = `b-${bt0p}-${bt1p}`;

    if (!usedKeyframes.has(bKf)) {
      usedKeyframes.add(bKf);
      elements.push(`<style>@keyframes ${bKf}{0%,${bt0p}%{transform:translate(0,0);opacity:0}${bt0p + 1}%{opacity:1}${bt1p}%{transform:translate(var(--dx),var(--dy));opacity:.7}${bFadeP}%{opacity:0}100%{opacity:0}}</style>`);
    }

    for (let j = 0; j < particleCount; j++) {
      const angle = (2 * Math.PI * j) / particleCount;
      const dx = Math.round(Math.cos(angle) * distance);
      const dy = Math.round(Math.sin(angle) * distance);
      elements.push(`<circle cx="${x}" cy="${y}" r="4" fill="url(#glow-${color})"
      style="--dx:${dx}px;--dy:${dy}px;animation:${bKf} ${loopDuration}s ${EASING.BURST} infinite"/>`);
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
 * ~40 CSS-animated gradient streams, no SMIL, no filters
 */
export function generateNiagaraEffect(config: NiagaraEffectConfig): string {
  const { canvasWidth, canvasHeight, seed = 42 } = config;
  const random = createSeededRandom(seed);

  const patternName = config.colorPattern ?? NIAGARA_PATTERN_NAMES[Math.floor(random() * NIAGARA_PATTERN_NAMES.length)];
  const colors = NIAGARA_PATTERNS[patternName];

  const wireY = Math.floor(canvasHeight * 0.5);
  const streamHeight = canvasHeight * 0.50;
  const streamCount = 35;

  const gradientId = `nFade-${seed}`;
  const glowId = `nGlow-${seed}`;
  const maskId = `nMask-${seed}`;
  const colorGradientId = `nColor-${seed}`;

  const colorStops = colors.map((color, i) => {
    const offset = (i / (colors.length - 1)) * 100;
    return `<stop offset="${offset}%" stop-color="${color}"/>`;
  }).join('\n      ');

  const elements: string[] = [];

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

  elements.push(`<ellipse cx="${Math.round(canvasWidth / 2)}" cy="${wireY}" rx="${Math.round(canvasWidth * 0.45)}" ry="50" fill="url(#${glowId})" opacity="0.6"/>`);

  elements.push(`<line x1="10" y1="${wireY}" x2="${canvasWidth - 10}" y2="${wireY}" stroke="${colors[0]}" stroke-width="3" opacity="0.9"/>`);
  elements.push(`<line x1="10" y1="${wireY}" x2="${canvasWidth - 10}" y2="${wireY}" stroke="#ffffff" stroke-width="1.5" opacity="0.7"/>`);

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
