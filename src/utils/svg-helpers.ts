/**
 * SVG Helper Utilities
 * Common functions for SVG animation support
 */

/**
 * Calculates normalized keyTime value from absolute time and loop interval
 *
 * @param time - Absolute time in seconds
 * @param loopInterval - Total loop duration in seconds
 * @param precision - Decimal precision (default: 4)
 * @returns Normalized time value (0-1) as string
 *
 * @example
 * toKeyTime(1.5, 3) // "0.5000"
 * toKeyTime(0.25, 5, 2) // "0.05"
 */
export function toKeyTime(time: number, loopInterval: number, precision = 4): string {
  const normalized = Math.min(time / loopInterval, 0.99);
  return normalized.toFixed(precision);
}

/**
 * Generates multiple keyTimes from an array of absolute times
 *
 * @param times - Array of absolute times in seconds
 * @param loopInterval - Total loop duration in seconds
 * @param precision - Decimal precision (default: 4)
 * @returns Array of normalized keyTime values
 *
 * @example
 * toKeyTimes([0, 0.5, 1.5, 3], 3) // [0, 0.1667, 0.5, 0.99]
 */
export function toKeyTimes(
  times: number[],
  loopInterval: number,
  precision = 4
): number[] {
  return times.map((t, i) => {
    // Last value should be exactly 1
    if (i === times.length - 1 && t >= loopInterval) {
      return 1;
    }
    const normalized = Math.min(t / loopInterval, 0.99);
    return Number(normalized.toFixed(precision));
  });
}

/**
 * Generates inline CSS custom properties string
 */
export function cssVars(vars: Record<string, string | number>): string {
  return Object.entries(vars)
    .map(([k, v]) => `--${k}:${v}`)
    .join(';');
}

/**
 * Generates style attribute for a particle with direction and timing
 */
export function particleStyle(config: {
  dx: number;
  dy: number;
  t0: number;
  t1: number;
  dur: number;
  t2?: number;
  drop?: number;
  delay?: number;
}): string {
  const vars: Record<string, string> = {
    dx: `${config.dx}px`,
    dy: `${config.dy}px`,
    t0: config.t0.toFixed(4),
    t1: config.t1.toFixed(4),
    dur: `${config.dur}s`,
  };
  if (config.t2 !== undefined) vars.t2 = config.t2.toFixed(4);
  if (config.drop !== undefined) vars.drop = `${config.drop}px`;
  if (config.delay !== undefined) vars.delay = `${config.delay}s`;
  return cssVars(vars);
}
