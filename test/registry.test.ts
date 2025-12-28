/**
 * Theme Registry Tests
 */
import { describe, it, expect } from 'vitest';
import {
  THEME_REGISTRY,
  getGenerator,
  generateFirework,
  getThemes,
  getLevels,
} from '../src/generators/registry';
import type { FireworksLevel } from '../src/services/fireworks-level';
import type { ThemeName } from '../src/services/theme-selector';

describe('registry', () => {
  describe('THEME_REGISTRY', () => {
    it('has kata and matsuri themes', () => {
      expect(THEME_REGISTRY).toHaveProperty('kata');
      expect(THEME_REGISTRY).toHaveProperty('matsuri');
    });

    it('has levels 1-5 for each theme', () => {
      const levels = [1, 2, 3, 4, 5] as const;

      for (const theme of ['kata', 'matsuri'] as const) {
        for (const level of levels) {
          expect(THEME_REGISTRY[theme][level]).toBeDefined();
          expect(typeof THEME_REGISTRY[theme][level]).toBe('function');
        }
      }
    });
  });

  describe('getGenerator', () => {
    it('returns null for level 0', () => {
      expect(getGenerator('kata', 0)).toBeNull();
      expect(getGenerator('matsuri', 0)).toBeNull();
    });

    it('returns generator function for levels 1-5', () => {
      const levels: Exclude<FireworksLevel, 0>[] = [1, 2, 3, 4, 5];
      const themes: ThemeName[] = ['kata', 'matsuri'];

      for (const theme of themes) {
        for (const level of levels) {
          const generator = getGenerator(theme, level);
          expect(generator).not.toBeNull();
          expect(typeof generator).toBe('function');
        }
      }
    });
  });

  describe('generateFirework', () => {
    const config = { canvasWidth: 400, canvasHeight: 200 };

    it('returns empty string for level 0', () => {
      expect(generateFirework('kata', 0, config)).toBe('');
      expect(generateFirework('matsuri', 0, config)).toBe('');
    });

    it('generates SVG for levels 1-5', () => {
      const levels: Exclude<FireworksLevel, 0>[] = [1, 2, 3, 4, 5];
      const themes: ThemeName[] = ['kata', 'matsuri'];

      for (const theme of themes) {
        for (const level of levels) {
          const svg = generateFirework(theme, level, config);
          expect(svg).toBeTruthy();
          expect(svg.length).toBeGreaterThan(0);
        }
      }
    });

    it('generates different SVG for different themes', () => {
      const kataSvg = generateFirework('kata', 3, config);
      const matsuriSvg = generateFirework('matsuri', 3, config);

      expect(kataSvg).not.toBe(matsuriSvg);
    });
  });

  describe('getThemes', () => {
    it('returns all available themes', () => {
      const themes = getThemes();

      expect(themes).toContain('kata');
      expect(themes).toContain('matsuri');
      expect(themes).toHaveLength(2);
    });
  });

  describe('getLevels', () => {
    it('returns levels 1-5 for each theme', () => {
      const kataLevels = getLevels('kata');
      const matsuriLevels = getLevels('matsuri');

      expect(kataLevels).toEqual([1, 2, 3, 4, 5]);
      expect(matsuriLevels).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
