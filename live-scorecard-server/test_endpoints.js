// Test different API endpoint patterns for Security Scorecard
// Based on the analysis document showing empty findings despite D-grade rating

const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN || "your-token-here";
const TEST_DOMAIN = "neste.com";

// Different endpoint patterns to test based on Security Scorecard documentation
const ENDPOINT_PATTERNS = [
  // Standard company endpoints
  { name: "Basic Issues", url: `/companies/${TEST_DOMAIN}/issues` },
  { name: "Issues with Limit 10", url: `/companies/${TEST_DOMAIN}/issues?limit=10` },
  { name: "Issues with Limit 100", url: `/companies/${TEST_DOMAIN}/issues?limit=100` },
  { name: "Issues with Limit 1000", url: `/companies/${TEST_DOMAIN}/issues?limit=1000` },
  
  // Severity filtering
  { name: "Critical Issues Only", url: `/companies/${TEST_DOMAIN}/issues?severity=critical` },
  { name: "High Issues Only", url: `/companies/${TEST_DOMAIN}/issues?severity=high` },
  { name: "Medium Issues Only", url: `/companies/${TEST_DOMAIN}/issues?severity=medium` },
  { name: "Low Issues Only", url: `/companies/${TEST_DOMAIN}/issues?severity=low` },
  
  // Factor-based filtering
  { name: "Application Security Issues", url: `/companies/${TEST_DOMAIN}/issues?factor=application_security` },
  { name: "Network Security Issues", url: `/companies/${TEST_DOMAIN}/issues?factor=network_security` },
  { name: "DNS Health Issues", url: `/companies/${TEST_DOMAIN}/issues?factor=dns_health` },
  { name: "Patching Cadence Issues", url: `/companies/${TEST_DOMAIN}/issues?factor=patching_cadence` },
  
  // Pagination patterns
  { name: "Paginated Results Page 1", url: `/companies/${TEST_DOMAIN}/issues?limit=50&offset=0` },
  { name: "Paginated Results Page 2", url: `/companies/${TEST_DOMAIN}/issues?limit=50&offset=50` },
  
  // Specific issue type endpoints (based on documentation)
  { name: "SPF Records Issues", url: `/companies/${TEST_DOMAIN}/issues/spf_record` },
  { name: "SSL Certificate Issues", url: `/companies/${TEST_DOMAIN}/issues/ssl_certificate` },
  { name: "Open Ports Issues", url: `/companies/${TEST_DOMAIN}/issues/open_ports` },
  { name: "Patching Issues", url: `/companies/${TEST_DOMAIN}/issues/patching_cadence` },
  { name: "Application Security Issues (Specific)", url: `/companies/${TEST_DOMAIN}/issues/application_security` },
  
  // Alternative data access patterns
  { name: "Company Scorecard Summary", url: `/companies/${TEST_DOMAIN}` },
  { name: "Company Factors", url: `/companies/${TEST_DOMAIN}/factors` },
  { name: "Company History", url: `/companies/${TEST_DOMAIN}/history/score` },
  { name: "Company Events", url: `/companies/${TEST_DOMAIN}/events` },
];

async function testEndpoint(pattern) {
  const url = `https://api.securityscorecard.io${pattern.url}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    const result = {
      name: pattern.name,
      url: pattern.url,
      status: response.status,
      statusText: response.statusText,
      success: response.ok
    };

    if (response.ok) {
      const data = await response.json();
      
      result.hasEntries = !!data.entries;
      result.entriesCount = data.entries?.length || 0;
      result.totalCount = data.total || null;
      result.hasNext = data.has_next || false;
      result.responseKeys = Object.keys(data);
      
      if (data.entries && data.entries.length > 0) {
        result.sampleEntryKeys = Object.keys(data.entries[0]);
        result.sampleSeverities = data.entries.slice(0, 5).map(e => e.severity).filter(Boolean);
        result.sampleTypes = data.entries.slice(0, 5).map(e => e.issue_type || e.type).filter(Boolean);
        result.sampleAssets = data.entries.slice(0, 5).map(e => e.subject || e.ip).filter(Boolean);
      }
      
      // Store a small sample of actual data for analysis
      result.sampleData = data.entries?.slice(0, 2) || data;
      
    } else {
      const errorText = await response.text();
      result.error = errorText;
    }

    return result;
    
  } catch (error) {
    return {
      name: pattern.name,
      url: pattern.url,
      error: error.message,
      success: false
    };
  }
}

async function runTests() {
  console.log("🔍 SECURITY SCORECARD API ENDPOINT TESTING");
  console.log("=" .repeat(60));
  console.log(`Domain: ${TEST_DOMAIN}`);
  console.log(`Token length: ${API_TOKEN.length}`);
  console.log(`Total endpoints to test: ${ENDPOINT_PATTERNS.length}`);
  console.log("");

  const results = [];
  
  for (let i = 0; i < ENDPOINT_PATTERNS.length; i++) {
    const pattern = ENDPOINT_PATTERNS[i];
    console.log(`${i + 1}/${ENDPOINT_PATTERNS.length} Testing: ${pattern.name}`);
    
    const result = await testEndpoint(pattern);
    results.push(result);
    
    // Quick status display
    if (result.success) {
      const entriesInfo = result.hasEntries ? `${result.entriesCount} entries` : 'no entries field';
      console.log(`   ✅ ${result.status} - ${entriesInfo}`);
      
      if (result.entriesCount && result.entriesCount > 0) {
        console.log(`   📊 Sample types: ${result.sampleTypes?.slice(0, 3).join(', ') || 'N/A'}`);
      }
    } else {
      console.log(`   ❌ ${result.status} ${result.statusText} - ${result.error?.substring(0, 100) || 'Unknown error'}`);
    }
    
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Analysis
  console.log("\n" + "=".repeat(60));
  console.log("📊 RESULTS ANALYSIS");
  console.log("=" .repeat(60));

  const successful = results.filter(r => r.success);
  const withEntries = results.filter(r => r.success && r.entriesCount > 0);
  const withoutEntries = results.filter(r => r.success && r.entriesCount === 0);

  console.log(`✅ Successful requests: ${successful.length}/${results.length}`);
  console.log(`📋 Endpoints with data: ${withEntries.length}`);
  console.log(`📭 Endpoints with empty data: ${withoutEntries.length}`);

  if (withEntries.length > 0) {
    console.log("\n🎯 ENDPOINTS WITH DATA:");
    withEntries.forEach(result => {
      console.log(`   📈 ${result.name}: ${result.entriesCount} entries`);
      if (result.sampleTypes) {
        console.log(`      Types: ${[...new Set(result.sampleTypes)].join(', ')}`);
      }
    });
  }

  if (withoutEntries.length > 0) {
    console.log("\n❗ ENDPOINTS WITH NO DATA (Potential MCP Issues):");
    withoutEntries.forEach(result => {
      console.log(`   📭 ${result.name}: ${result.url}`);
      console.log(`      Response keys: ${result.responseKeys?.join(', ') || 'N/A'}`);
    });
  }

  // Find the best endpoint for MCP implementation
  const bestEndpoint = withEntries.sort((a, b) => (b.entriesCount || 0) - (a.entriesCount || 0))[0];
  
  if (bestEndpoint) {
    console.log("\n🚀 RECOMMENDED ENDPOINT FOR MCP:");
    console.log(`   Name: ${bestEndpoint.name}`);
    console.log(`   URL: ${bestEndpoint.url}`);
    console.log(`   Data Count: ${bestEndpoint.entriesCount}`);
    console.log(`   Sample Data Structure:`);
    console.log(JSON.stringify(bestEndpoint.sampleData, null, 4));
  }

  // Generate MCP implementation suggestions
  console.log("\n🔧 MCP IMPLEMENTATION RECOMMENDATIONS:");
  
  if (withEntries.length === 0) {
    console.log(`
❌ CRITICAL ISSUE: No endpoints returned findings data!

This confirms the analysis document findings. Possible causes:
1. API token lacks proper permissions for issues access
2. Domain "${TEST_DOMAIN}" not properly configured in your SecurityScorecard account
3. Issues data might be accessed through different endpoint structure
4. API might require specific portfolio context

IMMEDIATE ACTIONS:
1. Contact SecurityScorecard support about issues endpoint access
2. Verify domain is in your monitored portfolio
3. Check API token permissions in SecurityScorecard platform
4. Try accessing data through portfolio-based endpoints
    `);
  } else {
    console.log(`
✅ DATA ACCESS WORKING!

Found ${withEntries.length} working endpoints with data.

RECOMMENDED MCP UPDATES:
1. Use "${bestEndpoint.name}" as primary endpoint: ${bestEndpoint.url}
2. Implement fallback endpoints for robustness
3. Add the successful parameters to your MCP functions
4. Update error handling to try multiple endpoint patterns
    `);
  }

  // Generate detailed JSON report
  console.log("\n📄 DETAILED RESULTS (JSON):");
  console.log(JSON.stringify(results.slice(0, 10), null, 2)); // First 10 results
}

// Run the tests
if (API_TOKEN === "your-token-here") {
  console.log("❌ Please set SECURITY_SCORECARD_API_TOKEN environment variable");
  process.exit(1);
}

runTests().catch(console.error);
