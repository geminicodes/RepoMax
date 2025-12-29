export interface GitHubRepo {
    name: string;
    fullName: string;
    htmlUrl: string;
    description: string | null;
    languages: string[];
    stars: number;
    forks: number;
    updatedAt: string;
    defaultBranch: string;
    readme: string | null;
    topics: string[];
}
export interface GitHubUserReposResponse {
    username: string;
    repos: GitHubRepo[];
    fetchedAt: string;
    rateLimit?: {
        remaining: number;
        limit: number;
        resetAt: string;
    };
}
//# sourceMappingURL=github.d.ts.map