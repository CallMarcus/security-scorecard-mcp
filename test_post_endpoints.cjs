#!/usr/bin/env node

// Test the POST endpoints for Digital Footprint API directly
const https = require('https');

const API_BASE = 'https://api.securityscorecard.io';
const TEST_DOMAIN = 'neste.com';
const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN;

if (!API_TOKEN) {
  console.log('❌ SECURITY_SCORECARD_API_TOKEN environment variable not set');
  process.exit(1);
}

async function testPostEndpoint(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${endpoint}`;
    console.log(`🔍 Testing POST: ${url}`);
    console.log(`📋 Body: ${JSON.stringify(body)}`);
    
    const postData = JSON.stringify(body);
    
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: result
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            parseError: e.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

async function runPostTests() {
  console.log('🧪 Testing POST endpoints for Digital Footprint API\n');
  console.log(`Test Domain: ${TEST_DOMAIN}`);
  console.log(`API Token: ${API_TOKEN.substring(0, 10)}...${API_TOKEN.substring(API_TOKEN.length - 4)}\n`);
  
  const postBody = {
    page: 0,
    page_size: 100
  };
  
  const endpointsToTest = [
    `/parent-domains/${TEST_DOMAIN}/domains`,
    `/parent-domains/${TEST_DOMAIN}/ips`
  ];
  
  for (const endpoint of endpointsToTest) {
    try {
      console.log(`\n🔍 Testing: POST ${endpoint}`);
      const result = await testPostEndpoint(endpoint, postBody);
      
      console.log(`   Status: ${result.status}`);
      
      if (result.status === 200) {
        console.log('   ✅ SUCCESS');
        
        if (result.data && result.data.entries) {
          console.log(`   📊 Entries: ${result.data.entries.length}`);
          
          if (result.data.entries.length > 0) {
            console.log('   🎯 SAMPLE DATA:');
            const sample = result.data.entries[0];
            const keys = Object.keys(sample);
            console.log(`      Keys: ${keys.join(', ')}`);
            
            // Look for IP addresses specifically
            if (endpoint.includes('/ips')) {
              if (sample.ip) {
                console.log(`      🔥 IP FOUND: ${sample.ip}`);
              }
              if (sample.hostname) {
                console.log(`      🏠 Hostname: ${sample.hostname}`);
              }
            }
            
            // Look for domains specifically
            if (endpoint.includes('/domains')) {
              if (sample.domain) {
                console.log(`      🌐 Domain: ${sample.domain}`);
              }
              if (sample.ips_count) {
                console.log(`      📊 IPs Count: ${sample.ips_count}`);
              }
            }
          }
        } else {
          console.log('   ⚠️  No entries array found');
          console.log(`   📋 Response keys: ${Object.keys(result.data).join(', ')}`);
        }
        
      } else if (result.status === 404) {
        console.log('   ❌ NOT FOUND (404) - POST endpoint may not exist');
        
      } else if (result.status === 403) {
        console.log('   ❌ FORBIDDEN (403) - May need different permissions');
        
      } else if (result.status === 405) {
        console.log('   ❌ METHOD NOT ALLOWED (405) - POST not supported');
        
      } else {
        console.log(`   ❌ ERROR (${result.status})`);
        if (result.data) {
          console.log(`   📋 Error details: ${JSON.stringify(result.data).substring(0, 200)}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ EXCEPTION: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 SUMMARY: POST Endpoint Testing');
  console.log('If any POST endpoints returned 200 with data, they should work in our MCP!');
  console.log('If they returned 404/405, we need to stick with GET endpoints.');
  console.log('If they returned 403, we may need different API permissions.');
}

runPostTests().then(() => {
  console.log('\n✅ POST endpoint test completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ POST endpoint test failed:', error);
  process.exit(1);
});