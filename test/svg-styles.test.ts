import { describe, it, expect } from 'vitest';
import { generateAnimationStyles } from '../src/generators/svg-styles';

describe('svg-styles', () => {
  it('generates a <style> block', () => {
    const result = generateAnimationStyles();
    expect(result).toMatch(/^<style>/);
    expect(result).toMatch(/<\/style>$/);
  });

  it('includes static @keyframes', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('@keyframes twinkle');
    expect(result).toContain('@keyframes flow');
  });

  it('includes star and stream utility classes', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('.star');
    expect(result).toContain('.stream');
    expect(result).toContain('ease-in-out');
  });
});
