export type Impact = "high" | "medium" | "low";
export type Priority = "high" | "medium" | "low";
export interface AnalysisStrength {
    point: string;
    evidence: string;
}
export interface AnalysisGap {
    gap: string;
    impact: Impact;
    suggestion: string;
}
export interface AnalysisRecommendation {
    action: string;
    priority: Priority;
    timeEstimate: string;
}
export interface RepoScore {
    repoName: string;
    relevanceScore: number;
    reasoning: string;
    highlights: string[];
}
export interface AnalysisResult {
    overallScore: number;
    scoreBreakdown: {
        technicalSkillsMatch: number;
        experienceAlignment: number;
        projectRelevance: number;
    };
    strengths: AnalysisStrength[];
    gaps: AnalysisGap[];
    recommendations: AnalysisRecommendation[];
    repoScores: RepoScore[];
}
//# sourceMappingURL=analysis.d.ts.map