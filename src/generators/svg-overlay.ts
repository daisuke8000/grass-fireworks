/**
 * SVG User Overlay Generator
 * Generates user information overlay (username, commits, level name)
 */

// Default canvas dimensions
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 200;

// Text styling
const TEXT_COLOR = '#ffffff';
const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const USERNAME_FONT_SIZE = 14;
const COMMITS_FONT_SIZE = 12;
const LEVEL_FONT_SIZE = 14;

// Positioning
const PADDING = 12;
const TOP_Y = 25;

export interface UserOverlayConfig {
  username: string;
  commits: number;
  levelName: string;
  width?: number;
  height?: number;
}

/**
 * Escapes special characters for safe XML/SVG output
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Returns correct commit text with singular/plural handling
 */
function getCommitText(commits: number): string {
  return commits === 1 ? `${commits} commit` : `${commits} commits`;
}

/**
 * Generates the text shadow filter definition
 */
function generateShadowFilter(): string {
  return `<filter id="textShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.8" />
    </filter>`;
}

/**
 * Generates user information overlay for the SVG
 */
export function generateUserOverlay(config: UserOverlayConfig): string {
  const {
    username,
    commits,
    levelName,
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
  } = config;

  const safeUsername = escapeXml(username);
  const commitText = getCommitText(commits);
  const safeLevelName = escapeXml(levelName);
  const bottomY = height - PADDING;

  const shadowFilter = generateShadowFilter();

  return `<g id="user-overlay">
    <defs>
      ${shadowFilter}
    </defs>
    <!-- Username (bottom-left) -->
    <text x="${PADDING}" y="${bottomY}"
          font-family="${FONT_FAMILY}"
          font-size="${USERNAME_FONT_SIZE}"
          fill="${TEXT_COLOR}"
          filter="url(#textShadow)">
      ${safeUsername}
    </text>
    <!-- Commit count (bottom-left, below username line height adjusted) -->
    <text x="${PADDING}" y="${bottomY - USERNAME_FONT_SIZE - 4}"
          font-family="${FONT_FAMILY}"
          font-size="${COMMITS_FONT_SIZE}"
          fill="${TEXT_COLOR}"
          filter="url(#textShadow)">
      ${commitText}
    </text>
    <!-- Level name (top-right) -->
    <text x="${width - PADDING}" y="${TOP_Y}"
          font-family="${FONT_FAMILY}"
          font-size="${LEVEL_FONT_SIZE}"
          fill="${TEXT_COLOR}"
          text-anchor="end"
          filter="url(#textShadow)">
      ${safeLevelName}
    </text>
  </g>`;
}
