import { describe, it, expect } from 'vitest';
import { generateGlowGradient, generateAllGlowGradients } from '../src/generators/svg-defs';

describe('svg-defs', () => {
  describe('generateGlowGradient', () => {
    it('generates radialGradient with white-hot center for a color', () => {
      const result = generateGlowGradient('orange', '#f0883e');
      expect(result).toContain('<radialGradient id="glow-orange"');
      expect(result).toContain('stop-color="#fff"');
      expect(result).toContain('stop-color="#f0883e"');
      expect(result).toContain('stop-opacity="0"');
    });
  });

  describe('generateAllGlowGradients', () => {
    it('generates gradients for all firework colors', () => {
      const result = generateAllGlowGradients();
      expect(result).toContain('id="glow-orange"');
      expect(result).toContain('id="glow-gold"');
      expect(result).toContain('id="glow-wabi"');
      expect(result).toContain('id="glow-crimson"');
    });

    it('wraps all gradients in a single defs block', () => {
      const result = generateAllGlowGradients();
      expect(result).toMatch(/^<defs>/);
      expect(result).toMatch(/<\/defs>$/);
    });
  });
});
