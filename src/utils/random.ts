/**
 * Seeded Random Number Generator
 * Provides deterministic random values for consistent, reproducible animations
 *
 * Uses mulberry32 algorithm - a fast, high-quality 32-bit PRNG
 */

/**
 * Creates a seeded random number generator using mulberry32 algorithm
 *
 * @param seed - Initial seed value (integer)
 * @returns A function that returns random numbers in range [0, 1)
 *
 * @example
 * const random = createSeededRandom(12345);
 * console.log(random()); // 0.xxxxx - always the same for seed 12345
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed;

  return function mulberry32(): number {
    let t = (state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Converts a string to a numeric seed for random generation
 * Uses a simple hash function to generate deterministic seeds from usernames, etc.
 *
 * @param str - String to convert to seed
 * @returns A positive integer suitable for use as a random seed
 *
 * @example
 * const seed = stringToSeed('octocat');
 * const random = createSeededRandom(seed);
 */
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Creates a seeded random generator from a string
 * Convenience function combining stringToSeed and createSeededRandom
 *
 * @param str - String to use as seed source
 * @returns A function that returns random numbers in range [0, 1)
 *
 * @example
 * const random = createSeededRandomFromString('octocat');
 * console.log(random()); // Always same for 'octocat'
 */
export function createSeededRandomFromString(str: string): () => number {
  return createSeededRandom(stringToSeed(str));
}
