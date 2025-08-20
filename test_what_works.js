#!/usr/bin/env node

// Test what data is actually available from working endpoints
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = "https://api.securityscorecard.io";
const API_TOKEN = process.env.SECURITY_SCORECARD_API_TOKEN;

async function testWorkingEndpoints() {
    console.log('🔍 Testing What Data IS Available...\n');
    
    const domain = 'neste.com';
    const workingEndpoints = [
        { url: `/footprint/${domain}/assets/ips`, description: 'IP Asset Discovery' },
        { url: `/footprint/${domain}/assets/domains`, description: 'Domain Asset Discovery' },
        { url: `/companies/${domain}/issues?size=100`, description: 'All Domain Issues' },
        { url: `/companies/${domain}/factors`, description: 'Factor Summary' },
    ];
    
    for (const endpoint of workingEndpoints) {
        console.log(`\n📡 Testing: ${endpoint.description}`);
        console.log(`   Endpoint: ${endpoint.url}`);
        console.log('─'.repeat(60));
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Token ${API_TOKEN}`
                }
            });
            
            if (!response.ok) {
                console.log(`   ❌ Status: ${response.status} ${response.statusText}`);
                continue;
            }
            
            const data = await response.json();
            
            if (endpoint.description === 'IP Asset Discovery') {
                const ips = data.entries || data.data || [];
                console.log(`   ✅ Found ${ips.length} IP assets`);
                
                if (ips.length > 0) {
                    console.log(`   📋 Sample IPs: ${ips.slice(0, 5).map(ip => ip.ip || ip.address || ip.name || 'unknown').join(', ')}`);
                    
                    // Check if any of our test IPs are in the discovered list
                    const testIPs = ['20.56.23.183', '4.175.13.171', '34.107.205.171'];
                    const foundTestIPs = testIPs.filter(testIP => 
                        ips.some(ip => (ip.ip || ip.address || ip.name) === testIP)
                    );
                    
                    if (foundTestIPs.length > 0) {
                        console.log(`   🎯 FOUND TEST IPs: ${foundTestIPs.join(', ')}`);
                    } else {
                        console.log(`   ⚠️  Test IPs not found in asset discovery`);
                    }
                }
            }
            
            else if (endpoint.description === 'All Domain Issues') {
                const issues = data.entries || [];
                console.log(`   ✅ Found ${issues.length} total issues`);
                
                if (issues.length > 0) {
                    // Check for IP mentions in issues
                    const testIPs = ['20.56.23.183', '4.175.13.171', '34.107.205.171'];
                    let ipIssuesFound = 0;
                    
                    for (const testIP of testIPs) {
                        const ipIssues = issues.filter(issue => {
                            const issueText = JSON.stringify(issue);
                            return issue.ip === testIP || 
                                   issue.ip_address === testIP ||
                                   issue.host === testIP ||
                                   issueText.includes(testIP);
                        });
                        
                        if (ipIssues.length > 0) {
                            console.log(`   🎯 IP ${testIP}: ${ipIssues.length} issues found`);
                            console.log(`      Types: ${ipIssues.slice(0, 3).map(i => i.type || 'unknown').join(', ')}`);
                            ipIssuesFound += ipIssues.length;
                        }
                    }
                    
                    if (ipIssuesFound === 0) {
                        console.log(`   ⚠️  No issues found for test IPs in general issue stream`);
                        
                        // Show sample of what IS available
                        console.log(`   📊 Available issue types: ${issues.slice(0, 5).map(i => i.type || 'unknown').join(', ')}`);
                        console.log(`   📊 Sample domains: ${issues.slice(0, 3).map(i => i.domain || i.hostname || 'unknown').join(', ')}`);
                    }
                }
            }
            
            else if (endpoint.description === 'Factor Summary') {
                const factors = data.entries || [];
                console.log(`   ✅ Found ${factors.length} security factors`);
                
                let totalIssues = 0;
                factors.forEach(factor => {
                    if (factor.issue_summary) {
                        factor.issue_summary.forEach(issue => {
                            totalIssues += issue.count || 0;
                        });
                    }
                });
                
                console.log(`   📊 Total issues across all factors: ${totalIssues}`);
                console.log(`   📋 Factors: ${factors.map(f => f.name).join(', ')}`);
            }
            
            else {
                const entries = data.entries || data.data || [];
                console.log(`   ✅ Found ${entries.length} entries`);
                if (entries.length > 0) {
                    console.log(`   📋 Sample data: ${JSON.stringify(entries[0], null, 2).substring(0, 200)}...`);
                }
            }
            
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
        }
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log('The IP-specific endpoints (like /assets/ips/{ip}/issues) are not accessible.');
    console.log('The function needs to work with available data sources and filter for IP-related issues.');
    console.log('This explains why 300+ issues for specific IPs are visible in web UI but not via direct API calls.');
}

testWorkingEndpoints().catch(console.error);