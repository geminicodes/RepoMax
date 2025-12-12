export interface GitHubRepo {
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string | null;
  languages: string[];
  stars: number;
  forks: number;
  updatedAt: string; // ISO
  defaultBranch: string;
  readme: string | null;
  topics: string[];
}

export interface GitHubUserReposResponse {
  username: string;
  repos: GitHubRepo[];
  fetchedAt: string; // ISO
  rateLimit?: {
    remaining: number;
    limit: number;
    resetAt: string; // ISO
  };
}
