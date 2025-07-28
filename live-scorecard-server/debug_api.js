// Enhanced API debugging script
const API_TOKEN = "Qhu1HDQUdJ0vJvcMWaMpNiHVRzgZ";  // Replace with your real token

async function debugAPI() {
  console.log("=== Security Scorecard API Debug ===");
  console.log("Token length:", API_TOKEN.length);
  console.log("Token starts with:", API_TOKEN.substring(0, 10) + "...");
  
  // Test 1: Check authentication with a simple endpoint
  console.log("\n1. Testing basic authentication...");
  try {
    const authResponse = await fetch("https://api.securityscorecard.io/portfolios", {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    console.log("Auth response status:", authResponse.status);
    
    if (authResponse.ok) {
      const portfolios = await authResponse.json();
      console.log("✅ Authentication SUCCESS!");
      console.log("Number of portfolios:", portfolios.entries?.length || 0);
    } else {
      const errorText = await authResponse.text();
      console.log("❌ Auth failed:", authResponse.status, authResponse.statusText);
      console.log("Error details:", errorText);
      return;
    }
  } catch (error) {
    console.log("❌ Auth error:", error.message);
    return;
  }

  // Test 2: Try to find the correct domain format
  console.log("\n2. Testing domain access...");
  const testDomains = ["neste.com", "www.neste.com", "neste.fi"];
  
  for (const domain of testDomains) {
    try {
      console.log(`\nTrying domain: ${domain}`);
      const response = await fetch(`https://api.securityscorecard.io/companies/${domain}`, {
        headers: {
          'Authorization': `Token ${API_TOKEN}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`Status for ${domain}:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS with ${domain}!`);
        console.log(`Company: ${data.name || domain}`);
        console.log(`Score: ${data.score}/100 (Grade: ${data.grade})`);
        console.log(`Industry: ${data.industry || 'N/A'}`);
        break;
      } else if (response.status === 404) {
        console.log(`⚠️  ${domain} not found in your account`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Error for ${domain}:`, errorText);
      }
    } catch (error) {
      console.log(`❌ Exception for ${domain}:`, error.message);
    }
  }

  // Test 3: List available companies
  console.log("\n3. Listing available companies in your account...");
  try {
    const portfolios = await fetch("https://api.securityscorecard.io/portfolios", {
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json'
      }
    });
    
    if (portfolios.ok) {
      const portfolioData = await portfolios.json();
      console.log("\nAvailable portfolios:");
      
      for (const portfolio of portfolioData.entries || []) {
        console.log(`\nPortfolio: ${portfolio.name} (ID: ${portfolio.id})`);
        
        // Get companies in this portfolio
        try {
          const companiesResponse = await fetch(`https://api.securityscorecard.io/portfolios/${portfolio.id}/companies?limit=10`, {
            headers: {
              'Authorization': `Token ${API_TOKEN}`,
              'Accept': 'application/json'
            }
          });
          
          if (companiesResponse.ok) {
            const companies = await companiesResponse.json();
            console.log("Companies in this portfolio:");
            companies.entries?.forEach((company, index) => {
              if (index < 5) { // Show first 5
                console.log(`  - ${company.domain || company.name} (Score: ${company.score || 'N/A'})`);
              }
            });
            if (companies.entries?.length > 5) {
              console.log(`  ... and ${companies.entries.length - 5} more`);
            }
          }
        } catch (err) {
          console.log("  Could not fetch companies for this portfolio");
        }
      }
    }
  } catch (error) {
    console.log("Could not list portfolios:", error.message);
  }
}

debugAPI();