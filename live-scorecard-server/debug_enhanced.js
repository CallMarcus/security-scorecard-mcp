// Enhanced API debugging and testing script
// This script helps diagnose the MCP implementation issues identified in the analysis

const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN || "your-token-here";
const API_BASE = "https://api.securityscorecard.io";
const TEST_DOMAIN = process.env.COMPANY_DOMAIN || "neste.com";

console.log("=== Enhanced Security Scorecard API Debug ===");
console.log(`Testing domain: ${TEST_DOMAIN}`);
console.log(`Token configured: ${API_TOKEN ? 'Yes' : 'No'}`);
console.log(`Token length: ${API_TOKEN.length}`);

async function makeRequest(endpoint, params = {}) {
  const url = new URL(`${API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });

  console.log(`\n🌐 ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Error: ${errorText}`);
      return { error: errorText, status: response.status };
    }

    const data = await response.json();
    
    // Analyze response structure
    const analysis = {
      hasEntries: !!data.entries,
      entriesCount: data.entries?.length || 0,
      hasTotal: !!data.total,
      totalValue: data.total,
      hasPagination: !!(data.has_next || data.pagination),
      topLevelKeys: Object.keys(data),
      firstEntryKeys: data.entries?.[0] ? Object.keys(data.entries[0]) : [],
      sampleData: data.entries?.slice(0, 2) || []
    };
    
    console.log(`📈 Analysis:`, JSON.stringify(analysis, null, 2));
    
    return { data, analysis };
  } catch (error) {
    console.log(`❌ Request failed: ${error.message}`);
    return { error: error.message };
  }
}

async function testEndpoints() {
  console.log("\n" + "=".repeat(50));
  console.log("TESTING CORE ENDPOINTS");
  console.log("=".repeat(50));

  // Test 1: Authentication
  console.log("\n1️⃣ Testing Authentication");
  const authTest = await makeRequest('/portfolios');
  
  if (authTest.error) {
    console.log("❌ Authentication failed - cannot proceed with other tests");
    return;
  }
  
  console.log("✅ Authentication successful");

  // Test 2: Company Overview
  console.log("\n2️⃣ Testing Company Overview");
  await makeRequest(`/companies/${TEST_DOMAIN}`);

  // Test 3: Factors
  console.log("\n3️⃣ Testing Security Factors");
  await makeRequest(`/companies/${TEST_DOMAIN}/factors`);

  // Test 4: Issues with different parameters - THIS IS THE KEY TEST
  console.log("\n4️⃣ Testing Issues Endpoint (Main Problem Area)");
  
  const issueTests = [
    { name: "Basic issues", params: {} },
    { name: "Limited to 10", params: { limit: 10 } },
    { name: "Limited to 100", params: { limit: 100 } },
    { name: "Limited to 500", params: { limit: 500 } },
    { name: "Critical only", params: { severity: 'critical' } },
    { name: "High severity", params: { severity: 'high' } },
    { name: "Medium severity", params: { severity: 'medium' } },
    { name: "Application security factor", params: { factor: 'application_security' } },
    { name: "Network security factor", params: { factor: 'network_security' } },
    { name: "With offset pagination", params: { limit: 50, offset: 0 } }
  ];

  for (const test of issueTests) {
    console.log(`\n🔍 ${test.name}:`);
    const result = await makeRequest(`/companies/${TEST_DOMAIN}/issues`, test.params);
    
    if (result.data && result.analysis) {
      const { analysis } = result;
      console.log(`   📋 Entries: ${analysis.entriesCount}`);
      console.log(`   🔢 Total: ${analysis.totalValue || 'N/A'}`);
      console.log(`   🗂️ Entry keys: ${analysis.firstEntryKeys.join(', ')}`);
      
      if (analysis.entriesCount > 0) {
        console.log(`   📝 Sample finding types: ${result.data.entries.slice(0, 3).map(e => e.issue_type || e.type || 'unknown').join(', ')}`);
        console.log(`   ⚠️ Sample severities: ${result.data.entries.slice(0, 3).map(e => e.severity).join(', ')}`);
      } else {
        console.log(`   ❗ NO ENTRIES RETURNED - This is the core problem!`);
      }
    }
  }

  // Test 5: Alternative endpoints to try
  console.log("\n5️⃣ Testing Alternative Endpoints");
  
  const alternativeTests = [
    '/companies/' + TEST_DOMAIN + '/history/score',
    '/companies/' + TEST_DOMAIN + '/events'
  ];

  for (const endpoint of alternativeTests) {
    console.log(`\n🔄 Testing: ${endpoint}`);
    await makeRequest(endpoint);
  }

  // Test 6: Portfolio-based approach
  console.log("\n6️⃣ Testing Portfolio-Based Data Access");
  const portfoliosResult = await makeRequest('/portfolios');
  
  if (portfoliosResult.data?.entries) {
    console.log(`Found ${portfoliosResult.data.entries.length} portfolios`);
    
    for (const portfolio of portfoliosResult.data.entries.slice(0, 2)) {
      console.log(`\n📁 Testing portfolio: ${portfolio.name}`);
      await makeRequest(`/portfolios/${portfolio.id}/companies`, { limit: 5 });
    }
  }
}

async function generateReport() {
  console.log("\n" + "=".repeat(50));
  console.log("GENERATING DIAGNOSTIC REPORT");
  console.log("=".repeat(50));

  const report = {
    timestamp: new Date().toISOString(),
    domain: TEST_DOMAIN,
    token_configured: !!API_TOKEN,
    token_length: API_TOKEN.length,
    findings: [],
    recommendations: []
  };

  // Test the main issues endpoint
  console.log("\n🔍 Comprehensive Issues Endpoint Analysis");
  const issuesResult = await makeRequest(`/companies/${TEST_DOMAIN}/issues`, { limit: 200 });
  
  if (issuesResult.error) {
    report.findings.push(`❌ Issues endpoint failed: ${issuesResult.error}`);
    report.recommendations.push("Check API token permissions for issues access");
  } else if (issuesResult.analysis?.entriesCount === 0) {
    report.findings.push("❗ Issues endpoint returns empty entries array");
    report.findings.push("This is the core MCP implementation problem");
    report.recommendations.push("Check if domain is correct and has findings");
    report.recommendations.push("Try different API endpoints or parameters");
    report.recommendations.push("Verify API token has full read permissions");
  } else {
    report.findings.push(`✅ Issues endpoint working - ${issuesResult.analysis?.entriesCount} entries found`);
  }

  // Test factors
  const factorsResult = await makeRequest(`/companies/${TEST_DOMAIN}/factors`);
  if (factorsResult.data?.entries) {
    report.findings.push(`✅ Factors endpoint working - ${factorsResult.data.entries.length} factors`);
  }

  console.log("\n📋 DIAGNOSTIC REPORT:");
  console.log(JSON.stringify(report, null, 2));

  console.log("\n" + "=".repeat(50));
  console.log("NEXT STEPS FOR MCP IMPLEMENTATION");
  console.log("=".repeat(50));

  if (issuesResult.analysis?.entriesCount === 0) {
    console.log(`
🔧 MCP IMPLEMENTATION FIXES NEEDED:

1. **API Endpoint Issue**: The /companies/${TEST_DOMAIN}/issues endpoint is returning empty data
   - This explains why MCP functions like get_current_findings() return empty results
   - Despite the company having a D-grade (indicating many issues)

2. **Possible Solutions**:
   - Try different API parameters (different limit values, pagination)
   - Check if the endpoint requires specific authentication scopes
   - Try alternative endpoints like /portfolios/{id}/companies/{domain}/issues
   - Verify the domain is correctly formatted for the API

3. **MCP Server Enhancements**:
   - Add better error handling and logging
   - Implement retry logic with different parameters
   - Add fallback endpoints
   - Include raw API response debugging in MCP responses

4. **Testing Steps**:
   - Run this debug script with your real API token
   - Check API documentation for any recent changes
   - Contact SecurityScorecard support about the issues endpoint
    `);
  } else {
    console.log(`
✅ API ACCESS WORKING:

Your API access appears to be functioning correctly with ${issuesResult.analysis?.entriesCount} findings found.
The MCP implementation should work properly with the enhanced version.

Next steps:
1. Build and deploy the enhanced MCP server
2. Test with Claude Desktop
3. Use the debug_api_access tool within MCP for further troubleshooting
    `);
  }
}

// Main execution
async function main() {
  if (!API_TOKEN || API_TOKEN === "your-token-here") {
    console.log("❌ Please set SECURITY_SCORECARD_API_TOKEN environment variable");
    process.exit(1);
  }

  await testEndpoints();
  await generateReport();
}

main().catch(console.error);
