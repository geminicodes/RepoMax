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
  relevanceScore: number; // 0-100
  reasoning: string;
  highlights: string[];
}

export interface AnalysisResult {
  overallScore: number; // 0-100
  scoreBreakdown: {
    technicalSkillsMatch: number; // 0-100
    experienceAlignment: number; // 0-100
    projectRelevance: number; // 0-100
  };
  strengths: AnalysisStrength[];
  gaps: AnalysisGap[];
  recommendations: AnalysisRecommendation[];
  repoScores: RepoScore[];
}
