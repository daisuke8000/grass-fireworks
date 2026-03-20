/**
 * SVG Helpers Unit Tests
 */
import { describe, it, expect } from 'vitest';
import {
  toKeyTime,
  toKeyTimes,
  cssVars,
  particleStyle,
} from '../src/utils/svg-helpers';

describe('svg-helpers', () => {
  describe('toKeyTime', () => {
    it('calculates normalized keyTime', () => {
      expect(toKeyTime(1.5, 3)).toBe('0.5000');
      expect(toKeyTime(0, 3)).toBe('0.0000');
      expect(toKeyTime(2.5, 5)).toBe('0.5000');
    });

    it('clamps to 0.99 maximum', () => {
      expect(toKeyTime(3, 3)).toBe('0.9900');
      expect(toKeyTime(5, 3)).toBe('0.9900');
    });

    it('respects precision parameter', () => {
      expect(toKeyTime(1, 3, 2)).toBe('0.33');
      expect(toKeyTime(1, 3, 6)).toBe('0.333333');
    });
  });

  describe('toKeyTimes', () => {
    it('converts array of times to keyTimes', () => {
      const result = toKeyTimes([0, 1.5, 3], 3);

      expect(result).toEqual([0, 0.5, 1]);
    });

    it('handles intermediate values', () => {
      const result = toKeyTimes([0, 0.5, 1.5, 2.5, 3], 3);

      expect(result[0]).toBe(0);
      expect(result[1]).toBeCloseTo(0.1667, 3);
      expect(result[2]).toBe(0.5);
      expect(result[3]).toBeCloseTo(0.8333, 3);
      expect(result[4]).toBe(1);
    });

    it('clamps intermediate values to 0.99', () => {
      const result = toKeyTimes([0, 4, 5], 3);

      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0.99);
      expect(result[2]).toBe(1);
    });
  });
});

describe('cssVars', () => {
  it('generates inline CSS custom properties string', () => {
    const result = cssVars({ dx: '30px', dy: '-25px', t0: '0.15' });
    expect(result).toBe('--dx:30px;--dy:-25px;--t0:0.15');
  });

  it('handles numeric values', () => {
    const result = cssVars({ dur: '4s', delay: '0.5s' });
    expect(result).toBe('--dur:4s;--delay:0.5s');
  });
});

describe('particleStyle', () => {
  it('generates style attribute with direction and timing', () => {
    const result = particleStyle({ dx: 30, dy: -25, t0: 0.15, t1: 0.45, dur: 4 });
    expect(result).toContain('--dx:30px');
    expect(result).toContain('--dy:-25px');
    expect(result).toContain('--t0:0.15');
    expect(result).toContain('--t1:0.45');
    expect(result).toContain('--dur:4s');
  });
});
