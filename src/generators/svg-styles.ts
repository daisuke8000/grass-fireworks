import { EASING } from '../constants';

/**
 * Generates the centralized <style> block for SVG animations.
 *
 * Only STATIC keyframes are defined here (twinkle, flow).
 * Dynamic keyframes (rise, burst, burst-gravity, fade-out) are generated
 * inline by each particle generator with timing baked into static percentages.
 *
 * CSS custom properties (--dx, --dy, --rise-y, --drop) are used in keyframe
 * VALUES (which is valid CSS), not in keyframe SELECTORS (which is invalid).
 */
export function generateAnimationStyles(): string {
  return `<style>
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes flow {
    from { stroke-dashoffset: var(--dash-total, 35); }
    to { stroke-dashoffset: 0; }
  }
  .star { animation: twinkle var(--dur, 2s) ease-in-out var(--delay, 0s) infinite; }
  .stream { animation: flow var(--flow-dur, 0.7s) linear var(--delay, 0s) infinite; }
</style>`;
}

/**
 * Exported easing values for use in inline animation shorthand.
 * Particle generators use these directly in style="animation: name dur EASING infinite"
 */
export { EASING };
