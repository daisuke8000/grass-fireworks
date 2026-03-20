import { describe, it, expect } from 'vitest';
import {
  generateKataLevel1,
  generateKataLevel2,
  generateKataLevel3,
  generateKataLevel4,
  generateKataLevel5,
} from '../src/generators/themes/kata-levels';

const config = { canvasWidth: 400, canvasHeight: 200 };

describe('Kata levels (SMIL + glow gradient)', () => {
  it.each([
    ['L1', generateKataLevel1],
    ['L2', generateKataLevel2],
    ['L3', generateKataLevel3],
    ['L4', generateKataLevel4],
    ['L5', generateKataLevel5],
  ] as const)('%s uses SMIL animate and has no glow filter', (_name, fn) => {
    const result = fn(config);
    expect(result).toContain('<animate');
    expect(result).not.toContain('fireworkGlow');
    expect(result).not.toContain('<filter');
  });

  it('L1 uses reduced particle count (8)', () => {
    const result = generateKataLevel1(config);
    const particles = (result.match(/<circle /g) || []).length;
    // 8 burst particles + 1 spark = 9 circles
    expect(particles).toBe(9);
  });

  it('L5 uses glow gradient fills', () => {
    const result = generateKataLevel5(config);
    expect(result).toContain('fill="url(#glow-');
  });
});
