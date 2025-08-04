#!/usr/bin/env node
export declare class ScoreImpactSecurityScorecardServer {
    private server;
    private config;
    constructor();
    /**
     * Simple logging helper for troubleshooting. Outputs only when DEBUG_MODE is enabled.
     */
    private log;
    /**
     * Executes a tool function with standardized error handling and logging.
     */
    private executeTool;
    /**
     * Makes a request to the Security Scorecard API with robust error handling and pagination support.
     * @param endpoint The API endpoint to call.
     * @param method The HTTP method (defaults to GET).
     * @param body The request body for POST/PUT requests.
     * @returns A promise that resolves to the full, aggregated list of entries from all pages.
     */
    private makeRequest;
    /**
     * Get factor weight from factor data or use default
     */
    private getFactorWeight;
    private setupToolHandlers;
    private getScoreImprovementRoadmap;
    private calculateFactorScoreImpact;
    private getIssuesByROI;
    private getIssuesByROIFallback;
    private simulateScoreImprovement;
    private getQuickWins;
    private getQuickWinsFallback;
    private benchmarkGradeRequirements;
    private findHighImpactFindingsAcrossAssets;
    private sanitizeDomain;
    private validateTopN;
    private validateTargetGrade;
    private validateMaxEffort;
    private getKeyIssuesForFactor;
    private getEffortForFactor;
    private getEffortForIssue;
    private getEffortScore;
    private getSeverityScore;
    private getFactorForIssueType;
    private getEstimatedImprovementForIssue;
    private getTimeToImplement;
    private getBusinessCase;
    private getBusinessImpact;
    private estimateTimeline;
    run(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map