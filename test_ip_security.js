#!/usr/bin/env node

// Test script for the new get_ip_security_details function
import { ScoreImpactSecurityScorecardServer } from './build/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testIPSecurityDetails() {
    console.log('🚀 Testing IP Security Details Function...\n');
    
    const server = new ScoreImpactSecurityScorecardServer();
    const testIPs = [
        { ip: '20.56.23.183', expectedIssues: 3, description: 'Small test IP' },
        { ip: '4.175.13.171', expectedIssues: 3, description: 'Small test IP' }, 
        { ip: '34.107.205.171', expectedIssues: 300, description: 'High-issue IP (300+ issues)' }
    ];
    
    for (const testCase of testIPs) {
        try {
            console.log(`\n🔍 Testing IP: ${testCase.ip} (${testCase.description})`);
            console.log(`Expected issues: ~${testCase.expectedIssues}`);
            console.log('─'.repeat(60));
            
            const result = await server.getIPSecurityDetails(testCase.ip, 'neste.com');
            
            if (result && result.content && result.content[0] && result.content[0].text) {
                const output = result.content[0].text;
                
                // Extract key metrics from output
                const totalIssuesMatch = output.match(/\*\*Total Issues\*\*: (\d+)/);
                const criticalMatch = output.match(/\*\*Critical\*\*: (\d+)/);
                const highMatch = output.match(/\*\*High\*\*: (\d+)/);
                const workingEndpointMatch = output.match(/\*\*Working Endpoint\*\*: (.+)/);
                
                const totalIssues = totalIssuesMatch ? parseInt(totalIssuesMatch[1]) : 0;
                const criticalIssues = criticalMatch ? parseInt(criticalMatch[1]) : 0;
                const highIssues = highMatch ? parseInt(highMatch[1]) : 0;
                const workingEndpoint = workingEndpointMatch ? workingEndpointMatch[1].trim() : 'None';
                
                console.log(`✅ SUCCESS: Found ${totalIssues} issues`);
                console.log(`   Critical: ${criticalIssues}, High: ${highIssues}`);
                console.log(`   Working Endpoint: ${workingEndpoint}`);
                
                if (totalIssues >= testCase.expectedIssues * 0.5) { // Allow 50% variance
                    console.log(`🎯 RESULT: GOOD (Found ${totalIssues} vs expected ~${testCase.expectedIssues})`);
                } else if (totalIssues > 0) {
                    console.log(`⚠️  RESULT: PARTIAL (Found ${totalIssues} vs expected ~${testCase.expectedIssues})`);
                } else {
                    console.log(`❌ RESULT: NO ISSUES FOUND (Expected ~${testCase.expectedIssues})`);
                }
                
                // Show first few lines of output for verification
                console.log('\n📋 Sample Output:');
                const lines = output.split('\n').slice(0, 8);
                lines.forEach(line => console.log(`   ${line}`));
                
            } else {
                console.log('❌ ERROR: Invalid response format');
                console.log('Response:', JSON.stringify(result, null, 2));
            }
            
        } catch (error) {
            console.log(`❌ ERROR testing IP ${testCase.ip}:`);
            console.log(`   ${error.message}`);
        }
        
        console.log('\n' + '='.repeat(80));
    }
    
    console.log('\n🏁 IP Security Details Testing Complete!');
}

// Make getIPSecurityDetails accessible for testing
ScoreImpactSecurityScorecardServer.prototype.getIPSecurityDetails = async function(ipAddress, domain) {
    return this.getIPSecurityDetails(ipAddress, domain);
};

testIPSecurityDetails().catch(console.error);