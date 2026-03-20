import { describe, it, expect } from 'vitest';
import { generateAnimationStyles } from '../src/generators/svg-styles';

describe('svg-styles', () => {
  it('generates a <style> block', () => {
    const result = generateAnimationStyles();
    expect(result).toMatch(/^<style>/);
    expect(result).toMatch(/<\/style>$/);
  });

  it('includes all standard @keyframes', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('@keyframes rise');
    expect(result).toContain('@keyframes burst');
    expect(result).toContain('@keyframes burst-gravity');
    expect(result).toContain('@keyframes fade-out');
    expect(result).toContain('@keyframes twinkle');
    expect(result).toContain('@keyframes flow');
  });

  it('includes easing curves', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(result).toContain('cubic-bezier(0.0, 0.9, 0.3, 1)');
  });

  it('uses CSS custom properties for particle direction', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('var(--dx)');
    expect(result).toContain('var(--dy)');
  });

  it('includes star twinkle animation', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('@keyframes twinkle');
    expect(result).toContain('ease-in-out');
  });

  it('includes Niagara flow animation', () => {
    const result = generateAnimationStyles();
    expect(result).toContain('@keyframes flow');
  });
});
