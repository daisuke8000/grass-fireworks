import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createGitHubService } from './services/github';
import { calculateLevel, getLevelName, type FireworksLevel } from './services/fireworks-level';
import { generateFireworksSVG } from './generators/svg-generator';
import { selectThemeByDate, isValidTheme, type ThemeName } from './services/theme-selector';

// Environment type definition
type Bindings = {
  GITHUB_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Cache helper: Check cache and return if hit
async function getCachedResponse(request: Request): Promise<Response | undefined> {
  const cache = caches.default;
  return await cache.match(request);
}

// Cache helper: Store response in edge cache
function cacheResponse(
  ctx: ExecutionContext,
  request: Request,
  response: Response
): void {
  const cache = caches.default;
  ctx.waitUntil(cache.put(request, response.clone()));
}

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
  theme: z.string().optional(),
});

// Demo endpoint schema
export const demoQuerySchema = z.object({
  commits: z.coerce.number().int().min(0).optional().default(8),
  level: z.coerce.number().int().min(0).max(5).optional(),
  user: z.string().optional(),
  width: z.coerce.number().int().min(MIN_WIDTH).max(MAX_WIDTH).optional().default(DEFAULT_WIDTH),
  height: z.coerce.number().int().min(MIN_HEIGHT).max(MAX_HEIGHT).optional().default(DEFAULT_HEIGHT),
  theme: z.string().optional(),
});

// Cache TTL constants
const CACHE_TTL_FIREWORKS = 3600; // 1 hour
const CACHE_TTL_DEMO = 31536000; // 1 year

/**
 * Resolves theme from query parameter
 * - If specified and valid: use that theme
 * - If 'auto' or not specified: use daily theme selection
 */
function resolveTheme(themeParam: string | undefined): ThemeName {
  if (themeParam && isValidTheme(themeParam)) {
    return themeParam;
  }
  // Default: daily theme selection
  return selectThemeByDate();
}

// GET /api/fireworks - Main endpoint
app.get(
  '/api/fireworks',
  zValidator('query', fireworksQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'user parameter is required' }, 400);
    }
  }),
  async (c) => {
    const request = c.req.raw;

    // Check edge cache first
    const cached = await getCachedResponse(request);
    if (cached) {
      return cached;
    }

    const { user, width, height, theme: themeParam } = c.req.valid('query');
    const token = c.env.GITHUB_TOKEN;
    const theme = resolveTheme(themeParam);

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
      const levelName = getLevelName(level, theme);
      const svg = generateFireworksSVG({
        username: user,
        commits: 0,
        level,
        levelName,
        width,
        height,
        theme,
      });
      return c.body(svg, 200, {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${CACHE_TTL_FIREWORKS}`,
      });
    }

    // Success: Generate fireworks based on contribution count
    const commits = result.value;
    const level = calculateLevel(commits);
    const levelName = getLevelName(level, theme);

    const svg = generateFireworksSVG({
      username: user,
      commits,
      level,
      levelName,
      width,
      height,
      theme,
    });

    const response = new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${CACHE_TTL_FIREWORKS}`,
      },
    });

    // Store in edge cache
    cacheResponse(c.executionCtx, request, response);

    return response;
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
  async (c) => {
    const request = c.req.raw;

    // Check edge cache first
    const cached = await getCachedResponse(request);
    if (cached) {
      return cached;
    }

    const { commits, level: levelParam, user, width, height, theme: themeParam } = c.req.valid('query');
    const displayName = user || 'demo';
    const theme = resolveTheme(themeParam);

    // Use explicit level if provided, otherwise calculate from commits
    const level = (levelParam !== undefined ? levelParam : calculateLevel(commits)) as FireworksLevel;
    const levelName = getLevelName(level, theme);

    const svg = generateFireworksSVG({
      username: displayName,
      commits,
      level,
      levelName,
      width,
      height,
      theme,
    });

    const response = new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${CACHE_TTL_DEMO}, immutable`,
      },
    });

    // Store in edge cache
    cacheResponse(c.executionCtx, request, response);

    return response;
  }
);

export default app;
