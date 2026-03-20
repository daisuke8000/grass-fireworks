import { FIREWORK_COLORS, type FireworkColorName } from '../constants';

/**
 * Lighter variant of a hex color (mix with white at 40%)
 */
function lighten(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * 0.4);
  const lg = Math.round(g + (255 - g) * 0.4);
  const lb = Math.round(b + (255 - b) * 0.4);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

/**
 * Generates a radialGradient for glow effect.
 * White-hot center → lighter color → main color → transparent
 */
export function generateGlowGradient(name: string, color: string): string {
  const light = lighten(color);
  return `<radialGradient id="glow-${name}">
    <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
    <stop offset="15%" stop-color="${light}" stop-opacity="0.9"/>
    <stop offset="60%" stop-color="${color}" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
  </radialGradient>`;
}

/**
 * Generates all glow gradients wrapped in <defs>
 */
export function generateAllGlowGradients(): string {
  const gradients = (Object.entries(FIREWORK_COLORS) as [FireworkColorName, string][])
    .map(([name, color]) => generateGlowGradient(name, color))
    .join('\n  ');
  return `<defs>\n  ${gradients}\n</defs>`;
}
