/**
 * SVG Filter and Gradient Definitions
 * Reusable visual effect definitions for firework animations
 */

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
