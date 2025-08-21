#!/usr/bin/env node

// Simple test runner for MCP validation
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register ts-node for TypeScript support
register('ts-node/esm', pathToFileURL('./'));

// Import and run Node.js test runner
import { run } from 'node:test';
import { glob } from 'glob';

async function runTests() {
  try {
    // Find all test files
    const testFiles = await glob('tests/*.test.ts');
    
    if (testFiles.length === 0) {
      console.log('No test files found');
      return;
    }
    
    console.log(`Found ${testFiles.length} test files:`);
    testFiles.forEach(file => console.log(`  - ${file}`));
    
    // Run tests
    await run({
      files: testFiles,
      concurrency: 1,
      timeout: 30000
    });
    
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
}

runTests();