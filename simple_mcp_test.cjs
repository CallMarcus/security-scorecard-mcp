#!/usr/bin/env node

// Simple test to call MCP server directly via stdio
const { spawn } = require('child_process');

async function testMCP() {
  console.log('🔍 Simple MCP Test - Discover All Assets\n');
  
  const serverProcess = spawn('node', ['build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { 
      ...process.env,
      DEBUG_MODE: 'true',
      SECURITY_SCORECARD_API_TOKEN: process.env.SECURITY_SCORECARD_API_TOKEN
    }
  });
  
  console.log('📋 Starting MCP server...');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('📋 Sending discover_all_assets request...');
  
  const request = {
    jsonrpc: "2.0",
    id: "test",
    method: "tools/call",
    params: {
      name: "discover_all_assets",
      arguments: {
        domain: "neste.com"
      }
    }
  };
  
  serverProcess.stdin.write(JSON.stringify(request) + '\n');
  
  let responseReceived = false;
  
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('📤 STDOUT:', output.substring(0, 500));
    
    try {
      const response = JSON.parse(output);
      if (response.id === "test") {
        responseReceived = true;
        console.log('\n✅ Response received!');
        
        if (response.result && response.result.content) {
          const text = response.result.content[0].text;
          console.log('\n📊 RESULT:');
          console.log(text.substring(0, 1000));
          
          // Check for IP addresses
          if (text.includes('IP Addresses: 0')) {
            console.log('\n❌ Still returning 0 IP addresses');
          } else if (text.match(/IP Addresses: \d+/)) {
            console.log('\n🎉 IP addresses found in response!');
          }
        }
        
        serverProcess.kill();
      }
    } catch (e) {
      // Not JSON, probably debug output
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.log('🔧 STDERR:', output.trim());
    
    // Look for specific debug messages
    if (output.includes('Digital Footprint POST')) {
      console.log('🎯 FOUND: Digital Footprint POST calls being made!');
    }
    if (output.includes('POST results:')) {
      console.log('🎯 FOUND: POST results being processed!');
    }
  });
  
  // Timeout
  setTimeout(() => {
    if (!responseReceived) {
      console.log('\n⏰ Timeout - killing server');
      serverProcess.kill();
    }
  }, 30000);
}

testMCP().catch(console.error);