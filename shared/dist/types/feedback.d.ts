export type FeedbackSource = "analysis" | "landing";
export interface FeedbackResponses {
    upgradeFeatures: string[];
    primaryUseCase: string;
    willingnessToPay: string;
    biggestPainPoint?: string;
    currentPreparation?: string;
    whatWouldMakeRecommend?: string;
    timeSaved?: string;
}
export interface FeedbackSubmission {
    email: string;
    responses: FeedbackResponses;
    source: FeedbackSource;
}
export interface FeedbackInsights {
    totalFeedback: number;
    topFeatures: Array<{
        feature: string;
        votes: number;
        percentage: number;
    }>;
    payDistribution: Array<{
        price: string;
        count: number;
        percentage: number;
    }>;
    useCases: Array<{
        useCase: string;
        count: number;
        percentage: number;
    }>;
    avgTimeSaved: string;
    recentFeedback: Array<{
        email: string;
        responses: FeedbackResponses;
        createdAt: string;
    }>;
    generatedAt: string;
}
//# sourceMappingURL=feedback.d.ts.map