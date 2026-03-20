import { describe, it, expect } from 'vitest';
import { EASING, FIREWORK_COLORS } from '../src/constants';

describe('EASING constants', () => {
  it('should define all standard easing curves', () => {
    expect(EASING.RISE).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(EASING.BURST).toBe('cubic-bezier(0.0, 0.9, 0.3, 1)');
    expect(EASING.GRAVITY).toBe('cubic-bezier(0.5, 0, 1, 0.5)');
    expect(EASING.FADE).toBe('cubic-bezier(0.4, 0, 1, 1)');
  });
});

describe('FIREWORK_COLORS modernized palette', () => {
  it('should have updated warm modern tones', () => {
    expect(FIREWORK_COLORS.wabi).toBe('#e8834a');
    expect(FIREWORK_COLORS.pink).toBe('#f472b6');
    expect(FIREWORK_COLORS.yellow).toBe('#fbbf24');
    expect(FIREWORK_COLORS.gold).toBe('#f59e0b');
    expect(FIREWORK_COLORS.silver).toBe('#e2e8f0');
    expect(FIREWORK_COLORS.crimson).toBe('#ef4444');
  });
});
