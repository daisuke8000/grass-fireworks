/**
 * Generates the centralized <style> block for SVG animations.
 *
 * Only STATIC keyframes are defined here (twinkle for stars, flow for Niagara).
 * All firework motion uses SMIL <animate> / <animateTransform> elements
 * which are generated inline by each particle function.
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
