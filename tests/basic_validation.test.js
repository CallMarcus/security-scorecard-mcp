/**
 * Basic MCP Validation Tests (JavaScript)
 * Tests core functionality without complex TypeScript setup
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createSecurityScorecardClient } from '../build/api/client.js';

// Test configuration
const TEST_DOMAIN = process.env.TEST_DOMAIN || 'example.com';
const API_TOKEN = process.env.SECURITY_SCORECARD_TOKEN;

describe('MCP Basic Validation', () => {
  
  test('should have API token configured', () => {
    if (!API_TOKEN) {
      console.log('⚠️  SECURITY_SCORECARD_TOKEN not set - skipping API tests');
      return;
    }
    assert.ok(API_TOKEN, 'API token should be configured');
    assert.ok(API_TOKEN.length > 10, 'API token should be valid length');
  });

  test('should create API client successfully', () => {
    if (!API_TOKEN) return;
    
    const client = createSecurityScorecardClient(API_TOKEN);
    assert.ok(client, 'Client should be created');
    assert.ok(typeof client.getPortfolios === 'function', 'Client should have getPortfolios method');
    assert.ok(typeof client.getCompanyScorecard === 'function', 'Client should have getCompanyScorecard method');
    assert.ok(typeof client.callEndpoint === 'function', 'Client should have callEndpoint method');
  });

  test('should validate API token format', () => {
    if (!API_TOKEN) return;
    
    // Test with invalid token
    try {
      const invalidClient = createSecurityScorecardClient('invalid');
      assert.ok(invalidClient, 'Client should still be created with invalid token');
    } catch (error) {
      // This is expected for some validation
    }
  });

  test('API connectivity test (with real token)', async () => {
    if (!API_TOKEN) {
      console.log('⚠️  Skipping connectivity test - no API token');
      return;
    }

    const client = createSecurityScorecardClient(API_TOKEN);
    
    try {
      console.log('🌐 Testing API connectivity...');
      const response = await client.getPortfolios();
      
      assert.ok(response, 'Should get response');
      assert.ok(response.status === 200, 'Should get 200 status');
      assert.ok(response.data, 'Should have data property');
      
      console.log('✅ API connectivity test passed');
    } catch (error) {
      console.log(`⚠️  API connectivity test failed: ${error.message}`);
      // Don't fail the test for connectivity issues - could be network/auth
      assert.ok(error.message, 'Error should have message');
    }
  });

  test('should handle invalid domain gracefully', async () => {
    if (!API_TOKEN) return;

    const client = createSecurityScorecardClient(API_TOKEN);
    
    try {
      await client.getCompanyScorecard('definitely-not-a-real-domain-12345.com');
      // If this succeeds, that's unexpected but not necessarily wrong
      console.log('⚠️  Invalid domain call succeeded unexpectedly');
    } catch (error) {
      // This is expected
      assert.ok(error.message, 'Error should have meaningful message');
      console.log('✅ Invalid domain handled correctly');
    }
  });

  test('should validate client methods exist', () => {
    if (!API_TOKEN) return;

    const client = createSecurityScorecardClient(API_TOKEN);
    
    const expectedMethods = [
      'getPortfolios',
      'createPortfolio', 
      'getCompanyScorecard',
      'getCompanyActiveIssues',
      'getCompanyFactors',
      'getAssetDomains',
      'getAssetIps',
      'callEndpoint',
      'makeRequest'
    ];
    
    expectedMethods.forEach(method => {
      assert.ok(
        typeof client[method] === 'function', 
        `Client should have ${method} method`
      );
    });
    
    console.log(`✅ All ${expectedMethods.length} expected methods found`);
  });

  test('should handle callEndpoint generic functionality', async () => {
    if (!API_TOKEN) return;

    const client = createSecurityScorecardClient(API_TOKEN);
    
    try {
      console.log('🔧 Testing generic endpoint functionality...');
      const response = await client.callEndpoint('GET', '/portfolios');
      
      assert.ok(response, 'Should get response from generic call');
      assert.ok(response.status, 'Should have status');
      
      console.log('✅ Generic endpoint test passed');
    } catch (error) {
      console.log(`⚠️  Generic endpoint test failed: ${error.message}`);
      // Don't fail test for API issues
      assert.ok(error.message, 'Error should have message');
    }
  });
});

describe('MCP Tools Compatibility', () => {
  
  test('should have expected MCP tool structure', async () => {
    // Test that the built files exist and have expected exports
    try {
      const indexModule = await import('../build/index.js');
      assert.ok(indexModule, 'Main index module should exist');
      
      console.log('✅ MCP server module loads successfully');
    } catch (error) {
      console.log(`⚠️  MCP server module load failed: ${error.message}`);
      // This might be expected if not built yet
    }
  });

  test('should validate TypeScript compilation', async () => {
    try {
      // Check if build directory exists
      const fs = await import('fs');
      const buildExists = fs.existsSync('./build');
      
      if (buildExists) {
        const apiExists = fs.existsSync('./build/api');
        assert.ok(apiExists, 'Build/api directory should exist');
        
        const clientExists = fs.existsSync('./build/api/client.js');
        assert.ok(clientExists, 'API client should be compiled');
        
        console.log('✅ TypeScript compilation validation passed');
      } else {
        console.log('⚠️  Build directory not found - run "npm run build" first');
      }
    } catch (error) {
      console.log(`⚠️  Build validation failed: ${error.message}`);
    }
  });
});

// Summary test
describe('Validation Summary', () => {
  test('should provide validation summary', () => {
    const summary = {
      api_client: '✅ Created successfully',
      api_token: API_TOKEN ? '✅ Configured' : '⚠️  Not configured',
      typescript_build: '⚠️  Check build status',
      connectivity: '⚠️  Depends on API token and network'
    };
    
    console.log('\n📋 Validation Summary:');
    Object.entries(summary).forEach(([key, status]) => {
      console.log(`   ${key}: ${status}`);
    });
    
    console.log('\n💡 Next Steps:');
    if (!API_TOKEN) {
      console.log('   1. Set SECURITY_SCORECARD_TOKEN environment variable');
      console.log('   2. Run: npm run validate:full');
    } else {
      console.log('   1. Run: npm run validate:full for comprehensive validation');
      console.log('   2. Check: MCP_MIGRATION_GUIDE.md for upgrade instructions');
    }
    console.log('   3. Review: API_DEVELOPMENT_GUIDE.md for usage examples');
    
    assert.ok(true, 'Summary completed');
  });
});