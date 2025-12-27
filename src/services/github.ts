/**
 * GitHub GraphQL API Service
 * Fetches contribution data for a given user
 */

// Result type for type-safe error handling
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type GitHubError =
  | { type: 'USER_NOT_FOUND'; username: string }
  | { type: 'API_ERROR'; message: string };

export interface GitHubService {
  fetchTodayContributions(username: string): Promise<Result<number, GitHubError>>;
}

export interface GitHubServiceOptions {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10000; // 10 seconds

// GraphQL query to fetch contribution calendar
const CONTRIBUTION_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubGraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Array<{
            contributionDays: ContributionDay[];
          }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

/**
 * Creates a GitHubService instance with the provided token
 */
export function createGitHubService(token: string, options?: GitHubServiceOptions): GitHubService {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return {
    async fetchTodayContributions(username: string): Promise<Result<number, GitHubError>> {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'grass-fireworks',
          },
          body: JSON.stringify({
            query: CONTRIBUTION_QUERY,
            variables: { username },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          return {
            ok: false,
            error: { type: 'API_ERROR', message: `HTTP ${response.status}` },
          };
        }

        const json = await response.json() as GitHubGraphQLResponse;

        // Check for GraphQL errors
        if (json.errors && json.errors.length > 0) {
          return {
            ok: false,
            error: { type: 'API_ERROR', message: json.errors[0].message },
          };
        }

        // Check if user exists
        if (!json.data?.user) {
          return {
            ok: false,
            error: { type: 'USER_NOT_FOUND', username },
          };
        }

        // Find today's contributions (use latest date from GitHub, respects user's timezone)
        const weeks = json.data.user.contributionsCollection.contributionCalendar.weeks;
        const lastWeek = weeks[weeks.length - 1];
        const lastDay = lastWeek.contributionDays[lastWeek.contributionDays.length - 1];

        return { ok: true, value: lastDay.contributionCount };
      } catch (error) {
        // Handle abort/timeout specifically
        if (error instanceof Error && error.name === 'AbortError') {
          return {
            ok: false,
            error: { type: 'API_ERROR', message: 'Request timeout' },
          };
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        return {
          ok: false,
          error: { type: 'API_ERROR', message },
        };
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}
