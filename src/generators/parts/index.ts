/**
 * Firework Parts - Re-exports
 * Central export point for all firework generation components
 */

// Shape calculation functions
export {
  type Position,
  getCirclePositions,
  getHeartPositions,
  getStarPositions,
} from './shapes';

// Filter and gradient definitions
export {
  generateGlowFilter,
  generateWaterSurface,
  generateWaterGradient,
} from './filters';

// Particle generation functions
export {
  type ThemeTrailConfig,
  type ThemeParticleConfig,
  type RotatingParticleConfig,
  type GravityParticleConfig,
  type ShapedParticleConfig,
  type ReflectionConfig,
  generateThemeTrail,
  generateThemeParticles,
  generateSpark,
  generateRotatingParticles,
  generateGravityParticles,
  generateShapedParticles,
  generateReflectionPoints,
} from './particles';

// Visual effects
export {
  type BackgroundFireworksConfig,
  type NiagaraColorPattern,
  type NiagaraEffectConfig,
  generateBackgroundFireworks,
  generateNiagaraEffect,
} from './effects';
