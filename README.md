# Grass Fireworks

GitHub contributions visualized as animated fireworks. More commits = bigger fireworks display!

| Kata (型) | Matsuri (祭) |
|:---------:|:------------:|
| ![Kata](https://grass-fireworks.dsk8.workers.dev/api/demo?level=5&theme=kata) | ![Matsuri](https://grass-fireworks.dsk8.workers.dev/api/demo?level=5&theme=matsuri) |

## Features

- Animated SVG fireworks based on daily GitHub contributions
- 6 levels of firework displays (0-5)
- Dual theme system: **kata** (型) and **matsuri** (祭) - daily rotation
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

## Themes

The fireworks display features two rotating themes inspired by Japanese firework traditions:

### Kata (型) - Traditional Firework Types
| Level | Name | Description |
|-------|------|-------------|
| 1 | 和火 (Wabi) | Traditional red-orange emotional firework |
| 2 | 牡丹 (Botan/Peony) | Quick-blooming circular burst |
| 3 | 蜂 (Hachi/Bee) | Rotating spinning particles |
| 4 | 冠菊 (Kankiku) | Gold trails with gravity (Weeping Willow) |
| 5 | 錦冠千輪 (Nishiki-Kamuro-Senrin) | Gold/silver + multiple small bursts |

### Matsuri (祭) - Famous Firework Festivals
| Level | Name | Description |
|-------|------|-------------|
| 1 | 線香花火 (Senko Hanabi) | Sparkler, gentle fading |
| 2 | 隅田川 (Sumida River) | Heart and star shaped fireworks |
| 3 | 土浦 (Tsuchiura) | Starmine rapid-fire competition |
| 4 | 諏訪湖 (Suwa Lake) | Water reflection fireworks |
| 5 | 長岡 (Nagaoka) | Phoenix grand finale |

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
| `theme` | No | auto | Theme: `kata`, `matsuri`, or omit for daily rotation |

### GET /api/demo

Demo endpoint for testing (no GitHub API required).

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `commits` | No | 0 | Simulated commit count |
| `level` | No | - | Override level (0-5), ignores commits |
| `width` | No | 400 | SVG width (200-800) |
| `height` | No | 200 | SVG height (100-400) |
| `theme` | No | auto | Theme: `kata`, `matsuri`, or omit for daily rotation |

## Demo Links

### Theme: Kata (型)
- [Level 1 - 和火 (Wabi)](https://grass-fireworks.dsk8.workers.dev/api/demo?level=1&theme=kata)
- [Level 3 - 蜂 (Hachi)](https://grass-fireworks.dsk8.workers.dev/api/demo?level=3&theme=kata)
- [Level 5 - 錦冠千輪](https://grass-fireworks.dsk8.workers.dev/api/demo?level=5&theme=kata)

### Theme: Matsuri (祭)
- [Level 2 - 隅田川 (Sumida)](https://grass-fireworks.dsk8.workers.dev/api/demo?level=2&theme=matsuri)
- [Level 4 - 諏訪湖 (Suwa Lake)](https://grass-fireworks.dsk8.workers.dev/api/demo?level=4&theme=matsuri)
- [Level 5 - 長岡 (Nagaoka)](https://grass-fireworks.dsk8.workers.dev/api/demo?level=5&theme=matsuri)

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
