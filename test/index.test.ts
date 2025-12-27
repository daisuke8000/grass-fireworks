import { describe, it, expect } from 'vitest';
import app from '../src/index';
import { calculateLevel, getLevelName } from '../src/services/fireworks-level';
import { generateFireworksSVG } from '../src/generators/svg-generator';

describe('Grass Fireworks', () => {
  describe('Level Calculation', () => {
    it('should calculate correct levels based on commit count', () => {
      expect(calculateLevel(0)).toBe(0);
      expect(calculateLevel(1)).toBe(1);
      expect(calculateLevel(5)).toBe(2);
      expect(calculateLevel(10)).toBe(3);
      expect(calculateLevel(20)).toBe(4);
      expect(calculateLevel(50)).toBe(5);
    });

    it('should return English level names', () => {
      expect(getLevelName(0)).toBe('Silent Night');
      expect(getLevelName(1)).toBe('Getting Started');
      expect(getLevelName(5)).toBe('Legendary');
    });
  });

  describe('SVG Generation', () => {
    it('should generate valid SVG for each level', () => {
      for (let level = 0; level <= 5; level++) {
        const svg = generateFireworksSVG({
          username: 'testuser',
          commits: level * 7,
          level: level as 0 | 1 | 2 | 3 | 4 | 5,
          levelName: getLevelName(level as 0 | 1 | 2 | 3 | 4 | 5),
          width: 400,
          height: 200,
        });

        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).toContain('viewBox="0 0 400 200"');
      }
    });

    it('should include user overlay with username and commits', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 10,
        level: 3,
        levelName: 'Productive Day',
        width: 400,
        height: 200,
      });

      expect(svg).toContain('testuser');
      expect(svg).toContain('10 commits');
    });

    it('should support custom dimensions', () => {
      const svg = generateFireworksSVG({
        username: 'testuser',
        commits: 5,
        level: 2,
        levelName: 'Good Progress',
        width: 600,
        height: 300,
      });

      expect(svg).toContain('viewBox="0 0 600 300"');
    });

    it('should generate firework animations for level 5', () => {
      const svg = generateFireworksSVG({
        username: 'test',
        commits: 35,
        level: 5,
        levelName: 'Legendary',
        width: 400,
        height: 200,
      });

      expect(svg).toContain('firework-level-5');
      expect(svg).toContain('<animate');
      expect(svg).toContain('repeatCount="indefinite"');
    });
  });

  describe('API Endpoints', () => {
    it('GET /api/fireworks should require user parameter', async () => {
      const res = await app.request('/api/fireworks');
      expect(res.status).toBe(400);
    });

    it('GET /api/demo should return SVG', async () => {
      const res = await app.request('/api/demo?commits=10');
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('image/svg+xml');

      const svg = await res.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('demo');
    });

    it('GET /api/demo should support width/height parameters', async () => {
      const res = await app.request('/api/demo?commits=10&width=600&height=300');
      expect(res.status).toBe(200);

      const svg = await res.text();
      expect(svg).toContain('viewBox="0 0 600 300"');
    });

    it('GET /api/demo should validate parameter ranges', async () => {
      const res = await app.request('/api/demo?commits=10&width=1000');
      expect(res.status).toBe(400);
    });
  });
});
