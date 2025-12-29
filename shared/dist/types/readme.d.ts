import type { GitHubRepo } from "./github";
import type { JobPosting, ToneLabel, DetectedLanguage } from "./job";
/**
 * Stored artifact for a README generation run.
 */
export interface READMEGeneration {
    repoName: string;
    tone: ToneLabel | string;
    language: DetectedLanguage;
    generatedREADME: string;
    createdAt: string;
}
export interface GenerateReadmeRequest {
    /**
     * Repository metadata + signals available to the generator.
     */
    repo: GitHubRepo;
    /**
     * Current README content (if any). If omitted, `repo.readme` may be used.
     */
    currentReadme?: string | null;
    /**
     * Target job context to tailor the README for.
     */
    job: JobPosting;
}
export interface GenerateReadmeResponse {
    /**
     * Enhanced README in Markdown format (copy/paste ready).
     */
    generatedReadme: string;
    /**
     * Safety / quality notes (e.g., stripped links, minimal repo disclaimer).
     */
    warnings: string[];
}
//# sourceMappingURL=readme.d.ts.map