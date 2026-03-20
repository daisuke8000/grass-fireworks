import { describe, it, expect } from 'vitest';
import { generateBackgroundFireworks, generateNiagaraEffect } from '../src/generators/parts/effects';

describe('generateBackgroundFireworks (SMIL)', () => {
  it('outputs SMIL animation with glow gradients', () => {
    const result = generateBackgroundFireworks({
      canvasWidth: 400, canvasHeight: 200, count: 3, loopDuration: 4.0,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('fill="url(#glow-');
    expect(result).toContain('stroke="url(#glow-');
  });

  it('uses glow gradient fills, not filters', () => {
    const result = generateBackgroundFireworks({
      canvasWidth: 400, canvasHeight: 200, count: 2, loopDuration: 4.0,
    });
    expect(result).toContain('fill="url(#glow-');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });
});

describe('generateNiagaraEffect (redesign)', () => {
  it('generates fewer than 50 SVG elements', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    const elementCount = (result.match(/<(line|circle|ellipse|rect)\s/g) || []).length;
    expect(elementCount).toBeLessThan(50);
  });

  it('uses CSS stream class instead of SMIL', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    expect(result).toContain('class="stream"');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('<animateTransform');
  });

  it('has no feGaussianBlur filter', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    expect(result).not.toContain('feGaussianBlur');
    expect(result).not.toContain('filter="url(');
  });

  it('uses linearGradient for stream fade', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    expect(result).toContain('linearGradient');
  });

  it('uses ellipse for wire glow', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    expect(result).toContain('<ellipse');
  });

  it('preserves niagara-effect class', () => {
    const result = generateNiagaraEffect({
      canvasWidth: 400, canvasHeight: 200, loopDuration: 4.0,
    });
    expect(result).toContain('niagara-effect');
  });
});
