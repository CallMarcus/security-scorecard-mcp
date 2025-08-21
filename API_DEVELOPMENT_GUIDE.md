# SecurityScorecard API Development Reference

## Quick Start

```typescript
import { SecurityScorecardApiClient } from './src/api/client.js';

const client = new SecurityScorecardApiClient(process.env.SECURITY_SCORECARD_TOKEN!);
const portfolios = await client.getPortfolios();
```

## MCP Integration

This API reference is designed for active development with Claude Code:

### 1. Type-Safe API Calls
- Full TypeScript type definitions
- Auto-completion for all endpoints
- Parameter validation

### 2. Smart Code Generation
- Claude can generate working API calls directly
- Context-aware parameter suggestions
- Error handling patterns

### 3. Development Workflow
- Run `npm run api:validate` to check API integration
- Use `npm run api:test` for endpoint testing
- Generate new tools with `npm run api:scaffold <endpoint>`

## Common Patterns

### Error Handling
```typescript
try {
  const result = await client.getCompanyScore(domain);
  return result.data;
} catch (error) {
  if (error.status === 404) {
    throw new Error(`Company ${domain} not found`);
  }
  throw error;
}
```

### Pagination
```typescript
async function getAllCompanies(portfolioId: string) {
  let allCompanies = [];
  let page = 1;
  
  while (true) {
    const response = await client.getPortfolioCompanies(portfolioId, { page });
    allCompanies.push(...response.data.entries);
    
    if (response.data.entries.length < 100) break; // Assuming 100 per page
    page++;
  }
  
  return allCompanies;
}
```

### Batch Operations
```typescript
async function analyzeMultipleCompanies(domains: string[]) {
  const results = await Promise.allSettled(
    domains.map(domain => client.getCompanyScore(domain))
  );
  
  return results.map((result, index) => ({
    domain: domains[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value.data : null,
    error: result.status === 'rejected' ? result.reason : null
  }));
}
```

## API Categories

### 🏢 Portfolios & Companies
- Portfolio management
- Company discovery and monitoring
- Bulk operations

### 🔍 Security Findings
- Active issues tracking
- Historical analysis
- Risk assessment

### 📊 Scoring & Analytics
- Security scores
- Factor analysis
- Trend monitoring

### 🎯 Action Plans
- Remediation planning
- Progress tracking
- ROI analysis

## Development Commands

```bash
# Generate new API client
npm run api:generate

# Test API connectivity
npm run api:test

# Validate API reference
npm run api:validate

# Update API schemas
npm run api:update
```
