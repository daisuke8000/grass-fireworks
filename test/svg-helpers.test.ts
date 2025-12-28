/**
 * SVG Helpers Unit Tests
 */
import { describe, it, expect } from 'vitest';
import {
  animateAttr,
  animateTransform,
  toKeyTime,
  toKeyTimes,
} from '../src/utils/svg-helpers';

describe('svg-helpers', () => {
  describe('animateAttr', () => {
    it('generates basic animate element', () => {
      const result = animateAttr('opacity', [0, 1, 0], [0, 0.5, 1], '2s');

      expect(result).toContain('attributeName="opacity"');
      expect(result).toContain('values="0;1;0"');
      expect(result).toContain('keyTimes="0;0.5;1"');
      expect(result).toContain('dur="2s"');
      expect(result).toContain('repeatCount="indefinite"');
    });

    it('throws error when values/keyTimes length mismatch', () => {
      expect(() => animateAttr('opacity', [0, 1], [0, 0.5, 1], '2s')).toThrow(
        /values\/keyTimes length mismatch/
      );
    });

    it('includes calcMode and keySplines when specified', () => {
      const result = animateAttr('r', [0, 5, 0], [0, 0.5, 1], '2s', {
        calcMode: 'spline',
        keySplines: '0.4 0 0.2 1;0.4 0 0.2 1',
      });

      expect(result).toContain('calcMode="spline"');
      expect(result).toContain('keySplines="0.4 0 0.2 1;0.4 0 0.2 1"');
    });

    it('ignores keySplines when calcMode is not spline', () => {
      const result = animateAttr('r', [0, 5, 0], [0, 0.5, 1], '2s', {
        calcMode: 'linear',
        keySplines: '0.4 0 0.2 1;0.4 0 0.2 1',
      });

      expect(result).toContain('calcMode="linear"');
      expect(result).not.toContain('keySplines');
    });

    it('supports custom begin and repeatCount', () => {
      const result = animateAttr('opacity', [0, 1], [0, 1], '1s', {
        begin: '0.5s',
        repeatCount: 3,
      });

      expect(result).toContain('begin="0.5s"');
      expect(result).toContain('repeatCount="3"');
    });

    it('supports fill attribute', () => {
      const result = animateAttr('opacity', [0, 1], [0, 1], '1s', {
        fill: 'freeze',
      });

      expect(result).toContain('fill="freeze"');
    });

    it('handles string values', () => {
      const result = animateAttr('fill', ['red', 'blue', 'green'], [0, 0.5, 1], '2s');

      expect(result).toContain('values="red;blue;green"');
    });
  });

  describe('animateTransform', () => {
    it('generates animateTransform element for translate', () => {
      const result = animateTransform(
        'translate',
        ['0 0', '10 20', '0 0'],
        [0, 0.5, 1],
        '2s'
      );

      expect(result).toContain('attributeName="transform"');
      expect(result).toContain('type="translate"');
      expect(result).toContain('values="0 0;10 20;0 0"');
      expect(result).toContain('keyTimes="0;0.5;1"');
    });

    it('generates animateTransform element for rotate', () => {
      const result = animateTransform('rotate', ['0', '180', '360'], [0, 0.5, 1], '3s');

      expect(result).toContain('type="rotate"');
      expect(result).toContain('values="0;180;360"');
    });

    it('throws error when values/keyTimes length mismatch', () => {
      expect(() =>
        animateTransform('scale', ['1', '2'], [0, 0.5, 1], '2s')
      ).toThrow(/values\/keyTimes length mismatch/);
    });

    it('supports spline calcMode with keySplines', () => {
      const result = animateTransform(
        'translate',
        ['0 0', '10 20'],
        [0, 1],
        '2s',
        {
          calcMode: 'spline',
          keySplines: '0.4 0 0.2 1',
        }
      );

      expect(result).toContain('calcMode="spline"');
      expect(result).toContain('keySplines="0.4 0 0.2 1"');
    });
  });

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
