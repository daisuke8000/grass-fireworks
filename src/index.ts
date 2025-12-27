import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// Environment type definition
type Bindings = {
  GITHUB_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Health check endpoint
app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'grass-fireworks' });
});

// Main fireworks endpoint schema
const fireworksQuerySchema = z.object({
  user: z.string().min(1, 'user parameter is required'),
});

// Demo endpoint schema
const demoQuerySchema = z.object({
  commits: z.coerce.number().int().min(0).optional().default(8),
  user: z.string().optional(),
});

// GET /api/fireworks - Main endpoint (to be implemented in Task 2+)
app.get(
  '/api/fireworks',
  zValidator('query', fireworksQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'user parameter is required' }, 400);
    }
  }),
  async (c) => {
    const { user } = c.req.valid('query');
    // Placeholder: Will be implemented in Task 2 (GitHub API) and Task 4-6 (SVG generation)
    return c.text(`<!-- Fireworks for ${user} - Coming soon -->`, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
    });
  }
);

// GET /api/demo - Demo endpoint
app.get(
  '/api/demo',
  zValidator('query', demoQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid parameters' }, 400);
    }
  }),
  (c) => {
    const { commits, user } = c.req.valid('query');
    const displayName = user || 'demo';
    // Placeholder SVG: Will be replaced with actual SVG generation in Task 4-6
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="200" y="100" text-anchor="middle" fill="#c9d1d9" font-family="sans-serif">
    ${displayName}: ${commits} commits
  </text>
</svg>`;
    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    });
  }
);

export default app;
