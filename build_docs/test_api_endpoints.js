// test_api_endpoints.js
// Direct API testing to diagnose MCP issues

const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN || "YOUR_TOKEN_HERE";
const API_BASE_URL = "https://api.securityscorecard.io";
const TEST_DOMAIN = "neste.com";

async function testEndpoint(name, endpoint) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${name}`);
    console.log(`Endpoint: ${endpoint}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response:", errorText);
            return;
        }
        
        const data = await response.json();
        
        // Log response structure
        console.log("\nResponse structure:");
        console.log("- Type:", typeof data);
        console.log("- Keys:", Object.keys(data));
        
        // Check for common response patterns
        if (data.entries) {
            console.log(`- entries.length: ${data.entries.length}`);
            if (data.entries.length > 0) {
                console.log("- First entry keys:", Object.keys(data.entries[0]));
                console.log("- Sample entry:", JSON.stringify(data.entries[0], null, 2));
            }
        }
        
        if (data.items) {
            console.log(`- items.length: ${data.items.length}`);
        }
        
        if (data.data) {
            console.log(`- data type: ${typeof data.data}`);
            if (Array.isArray(data.data)) {
                console.log(`- data.length: ${data.data.length}`);
            }
        }
        
        if (data.total !== undefined) {
            console.log(`- total: ${data.total}`);
        }
        
        // Save full response for analysis
        console.log("\nFull response preview (first 500 chars):");
        const fullJson = JSON.stringify(data, null, 2);
        console.log(fullJson.substring(0, 500) + (fullJson.length > 500 ? '...' : ''));
        
    } catch (error) {
        console.log("❌ ERROR:", error.message);
    }
}

async function runTests() {
    console.log("SecurityScorecard API Endpoint Testing");
    console.log("=====================================");
    console.log(`Testing domain: ${TEST_DOMAIN}`);
    console.log(`API Token: ${API_TOKEN.substring(0, 8)}...`);
    
    // Test all endpoints that are having issues
    const endpoints = [
        {
            name: "Company Overview (WORKING)",
            endpoint: `/companies/${TEST_DOMAIN}`
        },
        {
            name: "Company Factors (WORKING)",
            endpoint: `/companies/${TEST_DOMAIN}/factors`
        },
        {
            name: "Company Issues (BROKEN - Returns empty)",
            endpoint: `/companies/${TEST_DOMAIN}/issues?limit=10`
        },
        {
            name: "Company Issues - No params",
            endpoint: `/companies/${TEST_DOMAIN}/issues`
        },
        {
            name: "Company History Score (WORKING)",
            endpoint: `/companies/${TEST_DOMAIN}/history/score?from=2024-01-01`
        },
        {
            name: "Company Events",
            endpoint: `/companies/${TEST_DOMAIN}/events?limit=10`
        },
        {
            name: "Portfolio List",
            endpoint: `/portfolios`
        }
    ];
    
    for (const ep of endpoints) {
        await testEndpoint(ep.name, ep.endpoint);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("\n\nTesting complete!");
    console.log("\nNext steps:");
    console.log("1. Check if 'issues' endpoint returns data in a different format");
    console.log("2. Verify if additional headers or parameters are needed");
    console.log("3. Test with different domains to see if it's company-specific");
    console.log("4. Check SecurityScorecard API documentation for recent changes");
}

// Run the tests
runTests().catch(console.error);
