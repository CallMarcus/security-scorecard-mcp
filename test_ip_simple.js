#!/usr/bin/env node

// Simple test script for IP security details endpoints
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = "https://api.securityscorecard.io";
const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN;

async function testIPEndpoints() {
    console.log('🚀 Testing IP Security Endpoints...\n');
    
    if (!API_TOKEN) {
        console.log('❌ No API token found. Check SECURITY_SCORECARD_API_TOKEN environment variable.');
        return;
    }
    
    const domain = 'neste.com';
    const testIPs = [
        { ip: '20.56.23.183', description: 'Small test IP (3 issues expected)' },
        { ip: '4.175.13.171', description: 'Small test IP (3 issues expected)' }, 
        { ip: '34.107.205.171', description: 'High-issue IP (300+ issues expected)' }
    ];
    
    // Different endpoint patterns to test
    const endpointPatterns = [
        (domain, ip) => `/scorecard/${domain}/footprint/asset-details/ip/${ip}/issues`,
        (domain, ip) => `/scorecard/${domain}/footprint/ips/${ip}/issues`,
        (domain, ip) => `/footprint/${domain}/assets/ips/${ip}/issues`,
        (domain, ip) => `/footprint/${domain}/ips/${ip}/issues`,
        (domain, ip) => `/companies/${domain}/issues?ip=${ip}`,
        (domain, ip) => `/companies/${domain}/assets?ip=${ip}&type=issues`,
        (domain, ip) => `/companies/${domain}/issues?asset=${ip}`,
    ];
    
    for (const testIP of testIPs) {
        console.log(`\n🔍 Testing IP: ${testIP.ip} (${testIP.description})`);
        console.log('─'.repeat(70));
        
        let foundData = false;
        
        for (const [index, patternFn] of endpointPatterns.entries()) {
            const endpoint = patternFn(domain, testIP.ip);
            const fullUrl = `${API_BASE_URL}${endpoint}`;
            
            try {
                console.log(`   ${index + 1}. Trying: ${endpoint}`);
                
                const response = await fetch(fullUrl, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Token ${API_TOKEN}`
                    }
                });
                
                if (!response.ok) {
                    console.log(`      Status: ${response.status} ${response.statusText}`);
                    continue;
                }
                
                const data = await response.json();
                const entries = data.entries || data.issues || data.data || [];
                const count = Array.isArray(entries) ? entries.length : 0;
                
                console.log(`      ✅ SUCCESS: ${count} issues found`);
                if (count > 0) {
                    foundData = true;
                    console.log(`      📋 Sample issue types: ${entries.slice(0, 3).map(e => e.type || e.issue_type || 'unknown').join(', ')}`);
                    
                    // If this IP has many issues (like 34.107.205.171), break after first success
                    if (count > 10) {
                        console.log(`      🎯 Found substantial data (${count} issues) - endpoint working!`);
                        break;
                    }
                }
                
            } catch (error) {
                console.log(`      ❌ ERROR: ${error.message}`);
            }
        }
        
        if (!foundData) {
            console.log(`\n   ⚠️  NO WORKING ENDPOINTS FOUND for ${testIP.ip}`);
            console.log(`      Trying alternative method: filter all domain issues...`);
            
            try {
                const allIssuesUrl = `${API_BASE_URL}/companies/${domain}/issues?size=1000`;
                const response = await fetch(allIssuesUrl, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Token ${API_TOKEN}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const allEntries = data.entries || [];
                    
                    // Filter for this specific IP
                    const ipIssues = allEntries.filter(issue => 
                        issue.ip === testIP.ip || 
                        issue.ip_address === testIP.ip ||
                        issue.host === testIP.ip ||
                        JSON.stringify(issue).includes(testIP.ip)
                    );
                    
                    if (ipIssues.length > 0) {
                        console.log(`      ✅ ALTERNATIVE SUCCESS: Found ${ipIssues.length} issues via filtering`);
                        console.log(`      📋 Issue types: ${ipIssues.slice(0, 3).map(e => e.type || 'unknown').join(', ')}`);
                        foundData = true;
                    } else {
                        console.log(`      ❌ No issues found even via filtering method`);
                    }
                }
                
            } catch (error) {
                console.log(`      ❌ Alternative method failed: ${error.message}`);
            }
        }
        
        console.log(`\n   Result: ${foundData ? '✅ DATA FOUND' : '❌ NO DATA'}`);
        console.log('═'.repeat(70));
    }
    
    console.log('\n🏁 IP Endpoint Testing Complete!');
    console.log('\n💡 Results will help optimize the get_ip_security_details() function.');
}

testIPEndpoints().catch(console.error);