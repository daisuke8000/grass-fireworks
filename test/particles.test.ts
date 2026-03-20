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

describe('SMIL-based particles with glow gradients', () => {
  it('generateThemeTrail uses SMIL animate and glow gradient', () => {
    const result = generateThemeTrail({
      x: 200, startY: 200, endY: 76, color: 'orange',
      duration: 0.6, delay: 0, loopInterval: 4.0,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('stroke="url(#glow-orange)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });

  it('generateThemeParticles uses SMIL animate and glow gradient', () => {
    const result = generateThemeParticles({
      cx: 200, cy: 76, particleCount: 8, distance: 35,
      color: 'orange', duration: 1.2, delay: 0.6, loopInterval: 4.0,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('fill="url(#glow-orange)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });

  it('generateSpark uses SMIL animate', () => {
    const result = generateSpark(200, 76, 'orange', 0.6, 4.0);
    expect(result).toContain('<animate');
    expect(result).toContain('fill="white"');
  });

  it('generateGravityParticles uses SMIL animate and glow gradient', () => {
    const result = generateGravityParticles({
      cx: 200, cy: 76, particleCount: 14, distance: 70,
      color: 'gold', duration: 1.4, delay: 0.6, loopDuration: 4.5,
      gravityDrop: 45,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('fill="url(#glow-gold)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });

  it('generateRotatingParticles uses SMIL animate with rotation and glow gradient', () => {
    const result = generateRotatingParticles({
      cx: 200, cy: 76, particleCount: 12, distance: 60,
      color: 'yellow', duration: 1.0, delay: 0.6, loopDuration: 4.0,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('type="rotate"');
    expect(result).toContain('additive="sum"');
    expect(result).toContain('fill="url(#glow-yellow)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });

  it('generateShapedParticles uses SMIL animate and glow gradient', () => {
    const positions = [{ dx: 10, dy: -20 }, { dx: -15, dy: 5 }];
    const result = generateShapedParticles({
      cx: 140, cy: 70, positions, color: 'crimson',
      duration: 1.0, delay: 0.6, loopDuration: 4.0,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('fill="url(#glow-crimson)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });

  it('generateReflectionPoints uses SMIL animate and glow gradient', () => {
    const result = generateReflectionPoints({
      cx: 200, cy: 70, waterY: 150, particleCount: 20,
      distance: 55, color: 'blue', duration: 1.4,
      delay: 0.65, loopDuration: 4.5,
    });
    expect(result).toContain('<animate');
    expect(result).toContain('<animateTransform');
    expect(result).toContain('fill="url(#glow-blue)"');
    expect(result).not.toContain('filter=');
    expect(result).not.toContain('fireworkGlow');
  });
});
