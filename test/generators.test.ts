/**
 * Generator Structure Tests
 * Safety net for refactoring - validates SVG structure and element counts
 */

import { describe, it, expect } from 'vitest';
import { generateFireworksSVG } from '../src/generators/svg-generator';
import type { FireworksLevel } from '../src/services/fireworks-level';

// Theme and level combinations to test
const THEMES = ['kata', 'matsuri'] as const;
const LEVELS: FireworksLevel[] = [0, 1, 2, 3, 4, 5];

describe('SVG Generator Structure Tests', () => {
  describe('Theme Coverage', () => {
    it.each(THEMES)('should generate valid SVG for theme: %s', (theme) => {
      for (const level of LEVELS) {
        const svg = generateFireworksSVG({
          username: 'testuser',
          commits: level * 7,
          level,
          levelName: 'Level ' + level,
          width: 400,
          height: 200,
          theme,
        });

        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).toContain('viewBox="0 0 400 200"');
      }
    });

    it('should generate different content for kata vs matsuri at same level', () => {
      const kataSvg = generateFireworksSVG({
        username: 'testuser',
        commits: 35,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
        theme: 'kata',
      });

      const matsuriSvg = generateFireworksSVG({
        username: 'testuser',
        commits: 35,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
        theme: 'matsuri',
      });

      // Both should be valid SVGs
      expect(kataSvg).toContain('<svg');
      expect(matsuriSvg).toContain('<svg');

      // Should have different firework IDs
      expect(kataSvg).toContain('firework-kata-level-5');
      expect(matsuriSvg).toContain('firework-matsuri-level-5');
    });
  });

  describe('Element Count Validation', () => {
    it('level 0 should have no firework elements', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 0,
        level: 0,
        levelName: 'Silent Night',
        width: 400,
        height: 200,
        theme: 'kata',
      });

      // Level 0 should still have background stars with animations
      expect(svg).toContain('<svg');
      // Main firework should be empty
      expect(svg).not.toContain('firework-kata-level-');
      expect(svg).not.toContain('firework-matsuri-level-');
    });

    it('higher levels should have more particle elements', () => {
      const level1Svg = generateFireworksSVG({
        username: 'testuser',
        commits: 3,
        level: 1,
        levelName: 'Level 1',
        width: 400,
        height: 200,
        theme: 'kata',
      });

      const level5Svg = generateFireworksSVG({
        username: 'testuser',
        commits: 35,
        level: 5,
        levelName: 'Level 5',
        width: 400,
        height: 200,
        theme: 'kata',
      });

      const level1Particles = (level1Svg.match(/class="particle"/g) || []).length;
      const level5Particles = (level5Svg.match(/class="particle"/g) || []).length;

      // Level 5 should have more particles than level 1
      expect(level5Particles).toBeGreaterThan(level1Particles);
    });
  });

  describe('Niagara Effect', () => {
    it('should include Niagara effect when isExtra is true', () => {
      const svgWithNiagara = generateFireworksSVG({
        username: 'testuser',
        commits: 50,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
        theme: 'kata',
        isExtra: true,
      });

      const svgWithoutNiagara = generateFireworksSVG({
        username: 'testuser',
        commits: 35,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
        theme: 'kata',
        isExtra: false,
      });

      // With Niagara should have the effect group
      expect(svgWithNiagara).toContain('niagara-effect');

      // Without Niagara should not have it
      expect(svgWithoutNiagara).not.toContain('niagara-effect');
    });
  });

  describe('Background Fireworks', () => {
    it('level 0 should have no background fireworks', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 0,
        level: 0,
        levelName: 'Silent Night',
        width: 400,
        height: 200,
      });

      expect(svg).not.toContain('background-fireworks');
    });

    it('levels 1-5 should have background fireworks', () => {
      for (const level of [1, 2, 3, 4, 5] as const) {
        const svg = generateFireworksSVG({
          username: 'testuser',
          commits: level * 7,
          level,
          levelName: 'Level ' + level,
          width: 400,
          height: 200,
        });

        expect(svg).toContain('background-fireworks');
      }
    });
  });

  describe('User Overlay', () => {
    it('should include username and commits', () => {
      const svg = generateFireworksSVG({
        username: 'octocat',
        commits: 42,
        level: 4,
        levelName: 'On Fire',
        width: 400,
        height: 200,
      });

      expect(svg).toContain('octocat');
      expect(svg).toContain('42 commits');
    });

    it('should include level name', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 10,
        level: 3,
        levelName: 'Productive Day',
        width: 400,
        height: 200,
      });

      expect(svg).toContain('Productive Day');
    });

    it('should include Niagara label when isExtra is true', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 50,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
        isExtra: true,
      });

      expect(svg).toContain('加茂川');
    });
  });

  describe('Dimension Support', () => {
    it('should support various canvas sizes', () => {
      const dimensions = [
        { width: 200, height: 100 },
        { width: 400, height: 200 },
        { width: 800, height: 400 },
      ];

      for (const dim of dimensions) {
        const svg = generateFireworksSVG({
          username: 'testuser',
          commits: 10,
          level: 3,
          levelName: 'Test',
          width: dim.width,
          height: dim.height,
        });

        expect(svg).toContain('width="' + dim.width + '"');
        expect(svg).toContain('height="' + dim.height + '"');
        expect(svg).toContain('viewBox="0 0 ' + dim.width + ' ' + dim.height + '"');
      }
    });
  });

  describe('CSS Animation Integration', () => {
    it('should include <style> block with @keyframes', () => {
      const svg = generateFireworksSVG({
        username: 'test', commits: 10, level: 3,
        levelName: 'Test', width: 400, height: 200, theme: 'kata',
      });
      expect(svg).toContain('<style>');
      expect(svg).toContain('@keyframes');
    });

    it('should include glow gradient defs', () => {
      const svg = generateFireworksSVG({
        username: 'test', commits: 10, level: 3,
        levelName: 'Test', width: 400, height: 200, theme: 'kata',
      });
      expect(svg).toContain('radialGradient');
      expect(svg).toContain('id="glow-');
    });

    it('should have zero SMIL animate elements for all levels', () => {
      for (const theme of ['kata', 'matsuri'] as const) {
        for (const level of [1, 2, 3, 4, 5] as const) {
          const svg = generateFireworksSVG({
            username: 'test', commits: level * 7, level,
            levelName: 'Test', width: 400, height: 200, theme,
          });
          expect(svg).not.toContain('<animate ');
          expect(svg).not.toContain('<animateTransform');
        }
      }
    });

    it('should have zero firework glow filter elements', () => {
      const svg = generateFireworksSVG({
        username: 'test', commits: 50, level: 5,
        levelName: 'Legendary', width: 400, height: 200,
        theme: 'kata', isExtra: true,
      });
      expect(svg).not.toContain('id="fireworkGlow"');
      expect(svg).not.toContain('feGaussianBlur');
    });
  });
});
