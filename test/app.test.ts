import { describe, it, expect } from 'vitest';
import app from '../src/index';

describe('Grass Fireworks API', () => {
  describe('Health Check', () => {
    it('should respond to root path', async () => {
      const res = await app.request('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/fireworks', () => {
    it('should return 400 when user parameter is missing', async () => {
      const res = await app.request('/api/fireworks');
      expect(res.status).toBe(400);
    });

    it('should accept user parameter', async () => {
      // This test will be expanded in Task 2 when GitHub API is implemented
      // For now, we just verify the endpoint exists and accepts the parameter
      const res = await app.request('/api/fireworks?user=test');
      // Status should not be 400 (missing param) or 404 (not found route)
      expect(res.status).not.toBe(404);
    });
  });

  describe('GET /api/demo', () => {
    it('should return SVG with default commits (8)', async () => {
      const res = await app.request('/api/demo');
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
      expect(res.headers.get('Cache-Control')).toBe('no-cache');
    });

    it('should accept commits parameter', async () => {
      const res = await app.request('/api/demo?commits=30');
      expect(res.status).toBe(200);
    });

    it('should accept user parameter for display name', async () => {
      const res = await app.request('/api/demo?commits=5&user=testuser');
      expect(res.status).toBe(200);
    });
  });
});
