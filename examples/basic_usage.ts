
import { SecurityScorecardApiClient } from '../src/api/client.js';

// Initialize client
const client = new SecurityScorecardApiClient(process.env.SECURITY_SCORECARD_TOKEN!);

// Example: Get all portfolios
async function getPortfolios() {
  try {
    const response = await client.getPortfolios();
    console.log('Portfolios:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
}

// Example: Get company scorecard
async function getCompanyScore(domain: string) {
  try {
    const response = await client.getCompaniesScorecard_identifier(domain);
    console.log(`Score for ${domain}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching score for ${domain}:`, error);
    throw error;
  }
}

export { getPortfolios, getCompanyScore };
