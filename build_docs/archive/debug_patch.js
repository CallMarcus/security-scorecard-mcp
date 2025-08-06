// debug_patch.js
// Instructions and code to add debugging to your MCP server

// STEP 1: BACKUP YOUR ORIGINAL FILE
// Run this command in PowerShell:
// copy C:\Claude\security-scorecard-mcp\security-scorecard-mcp\build\index.js C:\Claude\security-scorecard-mcp\security-scorecard-mcp\build\index.js.backup

// STEP 2: REPLACE makeRequest METHOD
// Find the makeRequest method in your index.js and replace it with this debug version:

async makeRequest(endpoint, method = "GET", body) {
    if (!this.config.apiToken) {
        throw new McpError(ErrorCode.InvalidRequest, "Security Scorecard API token not configured. Set SECURITY_SCORECARD_API_TOKEN environment variable.");
    }
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        "Authorization": `Token ${this.config.apiToken}`,
        "Accept": "application/json",
    };
    if (method !== "GET" && body) {
        headers["Content-Type"] = "application/json";
    }
    
    // DEBUG: Log request details
    console.error(`[DEBUG] API Request: ${method} ${url}`);
    
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        // DEBUG: Log response status
        console.error(`[DEBUG] Response Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[DEBUG] Error Response: ${errorText}`);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // DEBUG: Log response structure
        console.error(`[DEBUG] Response Keys: ${Object.keys(data).join(', ')}`);
        if (data.entries) {
            console.error(`[DEBUG] Entries count: ${data.entries.length}`);
        }
        if (data.total !== undefined) {
            console.error(`[DEBUG] Total: ${data.total}`);
        }
        
        return data;
    }
    catch (error) {
        console.error(`[DEBUG] Request failed: ${error.message}`);
        throw new McpError(ErrorCode.InternalError, `Security Scorecard API request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// STEP 3: REPLACE getCurrentFindings METHOD
// Find the getCurrentFindings method and replace it with this debug version:

async getCurrentFindings(domain, severity, factor, limit = 100) {
    let endpoint = `/companies/${domain}/issues?limit=${limit}`;
    const params = [];
    if (severity)
        params.push(`severity=${severity}`);
    if (factor)
        params.push(`factor=${factor}`);
    if (params.length > 0) {
        endpoint += `&${params.join('&')}`;
    }
    
    console.error(`[DEBUG] getCurrentFindings called with:`, { domain, severity, factor, limit });
    console.error(`[DEBUG] Final endpoint: ${endpoint}`);
    
    const issues = await this.makeRequest(endpoint);
    
    console.error(`[DEBUG] Raw API response:`, JSON.stringify(issues).substring(0, 200));
    
    // Rest of the original code...
    // Group issues by type and severity for better analysis
    const issueAnalysis = {
        total_issues: issues.total || issues.entries?.length || 0,
        by_severity: {},
        by_factor: {},
        by_type: {},
        critical_assets: new Set(),
    };
    if (issues.entries) {
        issues.entries.forEach((issue) => {
            // Count by severity
            const sev = issue.severity || 'unknown';
            issueAnalysis.by_severity[sev] = (issueAnalysis.by_severity[sev] || 0) + 1;
            // Count by factor
            const fact = issue.factor || 'unknown';
            issueAnalysis.by_factor[fact] = (issueAnalysis.by_factor[fact] || 0) + 1;
            // Count by type
            const type = issue.issue_type || 'unknown';
            issueAnalysis.by_type[type] = (issueAnalysis.by_type[type] || 0) + 1;
            // Track critical assets
            if (issue.severity === 'critical' || issue.severity === 'high') {
                issueAnalysis.critical_assets.add(issue.subject || issue.ip || 'unknown');
            }
        });
    }
    return {
        content: [
            {
                type: "text",
                text: `# Current Security Findings for ${domain}\n\n**Total Issues:** ${issueAnalysis.total_issues}\n\n## Severity Distribution:\n${Object.entries(issueAnalysis.by_severity).map(([sev, count]) => `- **${sev.toUpperCase()}**: ${count} issues`).join('\n')}\n\n## By Security Factor:\n${Object.entries(issueAnalysis.by_factor).map(([factor, count]) => `- **${factor}**: ${count} issues`).join('\n')}\n\n## Most Common Issue Types:\n${Object.entries(issueAnalysis.by_type).slice(0, 10).map(([type, count]) => `- **${type}**: ${count} occurrences`).join('\n')}\n\n## Critical Assets (High/Critical Issues):\n${Array.from(issueAnalysis.critical_assets).slice(0, 20).map(asset => `- ${asset}`).join('\n')}\n\n*Full Issue Details:*\n\`\`\`json\n${JSON.stringify(issues, null, 2)}\n\`\`\``,
            },
        ],
    };
}

// STEP 4: VIEW DEBUG OUTPUT
// After applying these patches, restart Claude Desktop and run the MCP functions.
// The debug output will appear in the Claude Desktop console logs.
// On Windows, you can view these logs by:
// 1. Opening Claude Desktop
// 2. Press Ctrl+Shift+I to open Developer Tools
// 3. Go to the Console tab
// 4. Look for messages starting with [DEBUG]
