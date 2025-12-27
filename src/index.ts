import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createGitHubService } from './services/github';
import { calculateLevel, getLevelName } from './services/fireworks-level';
import { generateFireworksSVG } from './generators/svg-generator';

// Environment type definition
type Bindings = {
  GITHUB_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Health check endpoint
app.get('/', (c) => {
  return c.json({ status: 'ok', service: 'grass-fireworks' });
});

// Size constraints
const MIN_WIDTH = 200;
const MAX_WIDTH = 800;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 400;
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 200;

// Main fireworks endpoint schema
export const fireworksQuerySchema = z.object({
  user: z.string().min(1, 'user parameter is required'),
  width: z.coerce.number().int().min(MIN_WIDTH).max(MAX_WIDTH).optional().default(DEFAULT_WIDTH),
  height: z.coerce.number().int().min(MIN_HEIGHT).max(MAX_HEIGHT).optional().default(DEFAULT_HEIGHT),
});

// Demo endpoint schema
export const demoQuerySchema = z.object({
  commits: z.coerce.number().int().min(0).optional().default(8),
  user: z.string().optional(),
  width: z.coerce.number().int().min(MIN_WIDTH).max(MAX_WIDTH).optional().default(DEFAULT_WIDTH),
  height: z.coerce.number().int().min(MIN_HEIGHT).max(MAX_HEIGHT).optional().default(DEFAULT_HEIGHT),
});

// GET /api/fireworks - Main endpoint
app.get(
  '/api/fireworks',
  zValidator('query', fireworksQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'user parameter is required' }, 400);
    }
  }),
  async (c) => {
    const { user, width, height } = c.req.valid('query');
    const token = c.env.GITHUB_TOKEN;

    // Create GitHub service and fetch contributions
    const githubService = createGitHubService(token);
    const result = await githubService.fetchTodayContributions(user);

    // Handle errors
    if (!result.ok) {
      if (result.error.type === 'USER_NOT_FOUND') {
        return c.json({ error: 'User not found' }, 404);
      }
      // API_ERROR: Fallback to Level 0 (silent night)
      const level = 0;
      const levelName = getLevelName(level);
      const svg = generateFireworksSVG({
        username: user,
        commits: 0,
        level,
        levelName,
        width,
        height,
      });
      return c.body(svg, 200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      });
    }

    // Success: Generate fireworks based on contribution count
    const commits = result.value;
    const level = calculateLevel(commits);
    const levelName = getLevelName(level);

    const svg = generateFireworksSVG({
      username: user,
      commits,
      level,
      levelName,
      width,
      height,
    });

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300',
    });
  }
);

// GET /api/demo - Demo endpoint (no GitHub API call)
app.get(
  '/api/demo',
  zValidator('query', demoQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid parameters' }, 400);
    }
  }),
  (c) => {
    const { commits, user, width, height } = c.req.valid('query');
    const displayName = user || 'demo';

    // Calculate level and generate SVG directly (no GitHub API)
    const level = calculateLevel(commits);
    const levelName = getLevelName(level);

    const svg = generateFireworksSVG({
      username: displayName,
      commits,
      level,
      levelName,
      width,
      height,
    });

    return c.body(svg, 200, {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    });
  }
);

export default app;
