/**
 * SVG Helper Utilities
 * Common functions for generating SMIL animation elements
 */

/**
 * SVG animate element options
 */
export interface AnimateOptions {
  /** Optional calcMode for interpolation (default: linear) */
  calcMode?: 'linear' | 'discrete' | 'paced' | 'spline';
  /** keySplines for spline calcMode (cubic bezier control points) */
  keySplines?: string;
  /** Animation begin time */
  begin?: string;
  /** Repeat count (default: "indefinite") */
  repeatCount?: string | number;
  /** Fill mode for animation end state */
  fill?: 'freeze' | 'remove';
}

/**
 * Generates an SVG animate element with keyTimes-based timing
 *
 * @param attr - The attribute name to animate (e.g., "opacity", "r", "y2")
 * @param values - Array of values for each keyframe
 * @param keyTimes - Array of time points (0-1) corresponding to values
 * @param dur - Duration string (e.g., "3s", "1.5s")
 * @param options - Optional animation configuration
 * @returns SVG animate element string
 * @throws Error if values and keyTimes arrays have different lengths
 *
 * @example
 * animateAttr('opacity', [0, 1, 0], [0, 0.5, 1], '2s')
 * // Returns: <animate attributeName="opacity" values="0;1;0" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite"/>
 */
export function animateAttr(
  attr: string,
  values: (number | string)[],
  keyTimes: number[],
  dur: string,
  options: AnimateOptions = {}
): string {
  if (values.length !== keyTimes.length) {
    throw new Error(
      `animateAttr: values/keyTimes length mismatch for "${attr}". ` +
        `values has ${values.length} items, keyTimes has ${keyTimes.length} items.`
    );
  }

  const {
    calcMode,
    keySplines,
    begin = '0s',
    repeatCount = 'indefinite',
    fill,
  } = options;

  const attrs: string[] = [
    `attributeName="${attr}"`,
    `values="${values.join(';')}"`,
    `keyTimes="${keyTimes.join(';')}"`,
    `dur="${dur}"`,
    `begin="${begin}"`,
    `repeatCount="${repeatCount}"`,
  ];

  if (calcMode) {
    attrs.push(`calcMode="${calcMode}"`);
  }

  if (keySplines && calcMode === 'spline') {
    attrs.push(`keySplines="${keySplines}"`);
  }

  if (fill) {
    attrs.push(`fill="${fill}"`);
  }

  return `<animate ${attrs.join(' ')}/>`;
}

/**
 * Generates an SVG animateTransform element
 *
 * @param type - Transform type (translate, rotate, scale, etc.)
 * @param values - Array of transform values for each keyframe
 * @param keyTimes - Array of time points (0-1) corresponding to values
 * @param dur - Duration string
 * @param options - Optional animation configuration
 * @returns SVG animateTransform element string
 * @throws Error if values and keyTimes arrays have different lengths
 *
 * @example
 * animateTransform('translate', ['0 0', '10 20', '0 0'], [0, 0.5, 1], '2s')
 */
export function animateTransform(
  type: 'translate' | 'rotate' | 'scale' | 'skewX' | 'skewY',
  values: string[],
  keyTimes: number[],
  dur: string,
  options: AnimateOptions = {}
): string {
  if (values.length !== keyTimes.length) {
    throw new Error(
      `animateTransform: values/keyTimes length mismatch for "${type}". ` +
        `values has ${values.length} items, keyTimes has ${keyTimes.length} items.`
    );
  }

  const {
    calcMode,
    keySplines,
    begin = '0s',
    repeatCount = 'indefinite',
    fill,
  } = options;

  const attrs: string[] = [
    `attributeName="transform"`,
    `type="${type}"`,
    `values="${values.join(';')}"`,
    `keyTimes="${keyTimes.join(';')}"`,
    `dur="${dur}"`,
    `begin="${begin}"`,
    `repeatCount="${repeatCount}"`,
  ];

  if (calcMode) {
    attrs.push(`calcMode="${calcMode}"`);
  }

  if (keySplines && calcMode === 'spline') {
    attrs.push(`keySplines="${keySplines}"`);
  }

  if (fill) {
    attrs.push(`fill="${fill}"`);
  }

  return `<animateTransform ${attrs.join(' ')}/>`;
}

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
