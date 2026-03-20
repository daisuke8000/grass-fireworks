import { describe, it, expect } from 'vitest';
import {
  generateThemeTrail,
  generateThemeParticles,
  generateSpark,
  generateRotatingParticles,
  generateGravityParticles,
  generateShapedParticles,
  generateReflectionPoints,
} from '../src/generators/parts/particles';

describe('CSS-based particles', () => {
  it('generateThemeTrail outputs inline CSS animation, no SMIL', () => {
    const result = generateThemeTrail({
      x: 200, startY: 200, endY: 76, color: 'orange',
      duration: 0.6, delay: 0, loopInterval: 4.0,
    });
    expect(result).toContain('animation:r-');
    expect(result).toContain('--rise-y:');
    expect(result).toContain('stroke="url(#glow-orange)"');
    expect(result).not.toContain('<animate');
  });

  it('generateThemeParticles outputs inline CSS animation, no SMIL', () => {
    const result = generateThemeParticles({
      cx: 200, cy: 76, particleCount: 8, distance: 35,
      color: 'orange', duration: 1.2, delay: 0.6, loopInterval: 4.0,
    });
    expect(result).toContain('animation:b-');
    expect(result).toContain('--dx:');
    expect(result).toContain('--dy:');
    expect(result).toContain('fill="url(#glow-orange)"');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('filter=');
  });

  it('generateSpark outputs inline CSS animation, no SMIL', () => {
    const result = generateSpark(200, 76, 'orange', 0.6, 4.0);
    expect(result).toContain('animation:sp-');
    expect(result).not.toContain('<animate');
  });

  it('generateGravityParticles outputs inline CSS animation, no SMIL', () => {
    const result = generateGravityParticles({
      cx: 200, cy: 76, particleCount: 14, distance: 70,
      color: 'gold', duration: 1.4, delay: 0.6, loopDuration: 4.5,
      gravityDrop: 45,
    });
    expect(result).toContain('animation:bg-');
    expect(result).toContain('--drop:');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('filter=');
  });

  it('generateRotatingParticles outputs inline CSS animation, no SMIL', () => {
    const result = generateRotatingParticles({
      cx: 200, cy: 76, particleCount: 12, distance: 60,
      color: 'yellow', duration: 1.0, delay: 0.6, loopDuration: 4.0,
    });
    expect(result).toContain('animation:b-');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('filter=');
  });

  it('generateShapedParticles outputs inline CSS animation, no SMIL', () => {
    const positions = [{ dx: 10, dy: -20 }, { dx: -15, dy: 5 }];
    const result = generateShapedParticles({
      cx: 140, cy: 70, positions, color: 'crimson',
      duration: 1.0, delay: 0.6, loopDuration: 4.0,
    });
    expect(result).toContain('animation:b-');
    expect(result).toContain('fill="url(#glow-crimson)"');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('filter=');
  });

  it('generateReflectionPoints outputs inline CSS animation, no SMIL', () => {
    const result = generateReflectionPoints({
      cx: 200, cy: 70, waterY: 150, particleCount: 20,
      distance: 55, color: 'blue', duration: 1.4,
      delay: 0.65, loopDuration: 4.5,
    });
    expect(result).toContain('animation:b-');
    expect(result).toContain('fill="url(#glow-blue)"');
    expect(result).not.toContain('<animate');
    expect(result).not.toContain('filter=');
  });
});
