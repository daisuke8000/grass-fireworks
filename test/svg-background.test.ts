import { describe, it, expect } from 'vitest';
import { generateStars, generateNightSky } from '../src/generators/svg-background';

describe('generateStars (CSS)', () => {
  it('generates stars with CSS class instead of SMIL animate', () => {
    const result = generateStars({ seed: 42 });
    expect(result).toContain('class="star"');
    expect(result).not.toContain('<animate');
  });

  it('sets per-star delay via CSS custom property', () => {
    const result = generateStars({ seed: 42 });
    expect(result).toContain('--delay:');
  });

  it('generates correct number of stars', () => {
    const normal = generateStars({ seed: 42 });
    const legendary = generateStars({ seed: 42, isLegendary: true });
    const normalCount = (normal.match(/class="star"/g) || []).length;
    const legendaryCount = (legendary.match(/class="star"/g) || []).length;
    expect(normalCount).toBe(25);
    expect(legendaryCount).toBe(35);
  });
});
