# Grass Fireworks

GitHub contributions visualized as animated fireworks. More commits = bigger fireworks display!

![Legendary Demo](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=35)

## Features

- Animated SVG fireworks based on daily GitHub contributions
- 6 levels of firework displays (0-5)
- Customizable dimensions
- No JavaScript required - pure SVG animations
- Works in GitHub READMEs

## Usage

### In Your GitHub README

```markdown
![My Fireworks](https://grass-fireworks.dsk8.workers.dev/api/fireworks?user=YOUR_USERNAME)
```

### With Custom Size

```markdown
![My Fireworks](https://grass-fireworks.dsk8.workers.dev/api/fireworks?user=YOUR_USERNAME&width=600&height=300)
```

## Levels

| Level | Commits | Name | Display |
|-------|---------|------|---------|
| 0 | 0 | Silent Night | Stars only |
| 1 | 1-3 | Getting Started | 1 small firework |
| 2 | 4-7 | Good Progress | 2 fireworks |
| 3 | 8-15 | Productive Day | 3 colorful fireworks |
| 4 | 16-29 | On Fire | 5 continuous fireworks |
| 5 | 30+ | Legendary | 9 fireworks with special effects |

## Private Repositories

This tool uses the same data as GitHub's contribution graph.

- **Default**: Only public repository contributions are counted
- **Include private contributions**: Enable in GitHub Settings → Profile → "Include private contributions on my profile"

When enabled, only the **commit count** is retrieved - repository names and commit details remain private.

## API

### GET /api/fireworks

Returns SVG fireworks based on user's today's GitHub contributions.

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `user` | Yes | - | GitHub username |
| `width` | No | 400 | SVG width (200-800) |
| `height` | No | 200 | SVG height (100-400) |

### GET /api/demo

Demo endpoint for testing (no GitHub API required).

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `commits` | No | 0 | Simulated commit count |
| `width` | No | 400 | SVG width (200-800) |
| `height` | No | 200 | SVG height (100-400) |

## Demo Links

- [Level 0 - Silent Night](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=0)
- [Level 1 - Getting Started](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=2)
- [Level 2 - Good Progress](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=5)
- [Level 3 - Productive Day](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=10)
- [Level 4 - On Fire](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=20)
- [Level 5 - Legendary](https://grass-fireworks.dsk8.workers.dev/api/demo?commits=35)

## Local Development

```bash
# Install dependencies
npm install

# Create .dev.vars with your GitHub token
echo "GITHUB_TOKEN=ghp_your_token_here" > .dev.vars

# Start development server
npm run dev

# Run tests
npm test

# Deploy to Cloudflare Workers
npm run deploy
```

## Tech Stack

- [Hono](https://hono.dev/) - Web framework
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge runtime
- [Vitest](https://vitest.dev/) - Testing

## License

MIT
