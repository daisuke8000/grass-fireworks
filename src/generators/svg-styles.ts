import { EASING } from '../constants';

/**
 * Generates the centralized <style> block for all SVG animations.
 * @keyframes define motion patterns, CSS custom properties provide per-element individuality.
 */
export function generateAnimationStyles(): string {
  return `<style>
  @keyframes rise {
    0%, calc(var(--t0) * 100%) {
      transform: translateY(0);
      opacity: 0;
    }
    calc(var(--t0) * 100% + 1%) { opacity: 1; }
    calc(var(--t1) * 100%) {
      transform: translateY(var(--rise-y));
      opacity: 0.8;
    }
    calc(var(--t1) * 100% + 5%) { opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes burst {
    0%, calc(var(--t0) * 100%) {
      transform: translate(0, 0);
      opacity: 0;
    }
    calc(var(--t0) * 100% + 1%) { opacity: 1; }
    calc(var(--t1) * 100%) {
      transform: translate(var(--dx), var(--dy));
      opacity: 0.7;
    }
    calc(var(--t2, var(--t1)) * 100%) {
      transform: translate(var(--dx), var(--dy));
      opacity: 0;
    }
    100% { opacity: 0; }
  }
  @keyframes burst-gravity {
    0%, calc(var(--t0) * 100%) {
      transform: translate(0, 0);
      opacity: 0;
    }
    calc(var(--t0) * 100% + 1%) { opacity: 1; }
    calc(var(--t1) * 100%) {
      transform: translate(var(--dx), var(--dy));
      opacity: 0.8;
    }
    calc(var(--t2) * 100%) {
      transform: translate(var(--dx), calc(var(--dy) + var(--drop, 40px)));
      opacity: 0;
    }
    100% { opacity: 0; }
  }
  @keyframes fade-out {
    0%, calc(var(--t0) * 100%) { opacity: 0; r: 0; }
    calc(var(--t0) * 100% + 2%) { opacity: 1; r: var(--max-r, 8); }
    calc(var(--t1) * 100%) { opacity: 0; r: 0; }
    100% { opacity: 0; }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes flow {
    from { stroke-dashoffset: var(--dash-total, 35); }
    to { stroke-dashoffset: 0; }
  }
  .star { animation: twinkle var(--dur, 2s) ease-in-out var(--delay, 0s) infinite; }
  .trail { animation: rise var(--dur, 4s) ${EASING.RISE} infinite; }
  .particle { animation: burst var(--dur, 4s) ${EASING.BURST} infinite; }
  .particle-gravity { animation: burst-gravity var(--dur, 4s) ${EASING.BURST} infinite; }
  .spark { animation: fade-out var(--dur, 4s) ease-out infinite; }
  .stream { animation: flow var(--flow-dur, 0.7s) linear var(--delay, 0s) infinite; }
</style>`;
}
