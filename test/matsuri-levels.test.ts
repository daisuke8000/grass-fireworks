// test/matsuri-levels.test.ts
import { describe, it, expect } from 'vitest';
import {
  generateMatsuriLevel1,
  generateMatsuriLevel2,
  generateMatsuriLevel3,
  generateMatsuriLevel4,
  generateMatsuriLevel5,
} from '../src/generators/themes/matsuri-levels';

const config = { canvasWidth: 400, canvasHeight: 200 };

describe('Matsuri levels (SMIL + glow gradient)', () => {
  it.each([
    ['L1', generateMatsuriLevel1],
    ['L2', generateMatsuriLevel2],
    ['L3', generateMatsuriLevel3],
    ['L4', generateMatsuriLevel4],
    ['L5', generateMatsuriLevel5],
  ] as const)('%s uses SMIL animate and has no glow filter', (_name, fn) => {
    const result = fn(config);
    expect(result).toContain('<animate');
    expect(result).not.toContain('fireworkGlow');
    expect(result).not.toContain('<filter');
  });

  it('L1 sparkler uses glow gradient', () => {
    const result = generateMatsuriLevel1(config);
    expect(result).toContain('fill="url(#glow-orange)"');
  });

  it('L5 has core flash and ring waves with SMIL', () => {
    const result = generateMatsuriLevel5(config);
    expect(result).toContain('matsuri5-core-flash');
    expect(result).toContain('matsuri5-ring-wave');
    expect(result).toContain('<animate');
  });
});
