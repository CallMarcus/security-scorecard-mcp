
import { SecurityScorecardApiClient } from '../src/api/client.js';
import { describe, test, expect } from '@jest/globals';

describe('SecurityScorecard API Integration', () => {
  const client = new SecurityScorecardApiClient(process.env.SECURITY_SCORECARD_TOKEN!);
  
  test('should fetch portfolios successfully', async () => {
    const response = await client.getPortfolios();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(Array.isArray(response.data.entries)).toBe(true);
  });
  
  test('should handle API errors gracefully', async () => {
    const invalidClient = new SecurityScorecardApiClient('invalid-token');
    
    await expect(invalidClient.getPortfolios()).rejects.toThrow();
  });
  
  test('should validate domain scorecard data', async () => {
    const domain = 'example.com';
    const response = await client.getCompaniesScorecard_identifier(domain);
    
    expect(response.data).toHaveProperty('score');
    expect(response.data).toHaveProperty('grade');
    expect(typeof response.data.score).toBe('number');
  });
});
