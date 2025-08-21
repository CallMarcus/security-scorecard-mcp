import { RequestOptions, ApiResponse } from '../types/api.js';

export class SecurityScorecardApiClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(apiToken: string, baseUrl: string = 'https://api.securityscorecard.io') {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T = any>(
    method: string,
    path: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const { queryParams, body, ...fetchOptions } = options;
    
    // Build query string
    const searchParams = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const finalUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
    
    const response = await fetch(finalUrl, {
      method,
      headers: {
        'Authorization': `Token ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOptions,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  // === PORTFOLIOS METHODS ===

  /**
   * Get all portfolios you have access to
   * GET /portfolios
   */
  async GetPortfolios(options?: RequestOptions): Promise<any> {
    const url = `/portfolios`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Create a new portfolio
   * POST /portfolios
   */
  async PostPortfolios(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/portfolios`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Edit a portfolio
   * PUT /portfolios/{portfolio_id}
   */
  async PutPortfoliosPortfolioId(portfolio_id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/portfolios/${portfolio_id}`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Delete a portfolio
   * DELETE /portfolios/{portfolio_id}
   */
  async DeletePortfoliosPortfolioId(portfolio_id: string, options?: RequestOptions): Promise<any> {
    const url = `/portfolios/${portfolio_id}`;
    return this.makeRequest('DELETE', url, {
      ...options,
      
      
    });
  }

  /**
   * Get all companies in a portfolio
   * GET /portfolios/{portfolio_id}/companies
   */
  async GetPortfoliosPortfolioIdCompanies(portfolio_id: string, queryParams?: { grade?: any; industry?: any; vulnerability?: any; issue_type?: any; status?: any; had_breach_within_last_days?: any }, options?: RequestOptions): Promise<any> {
    const url = `/portfolios/${portfolio_id}/companies`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === PORTFOLIO METHODS ===

  /**
   * Add companies in bulk to a portfolios
   * PUT /portfolios/companies/bulk-upload
   */
  async PutPortfoliosCompaniesBulkUpload(queryParams?: { auth_mechanism?: any }, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/portfolios/companies/bulk-upload`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      queryParams,
    });
  }

  /**
   * Remove all companies from a portfolio
   * DELETE /portfolios/{id}/companies/all
   */
  async DeletePortfoliosIdCompaniesAll(id: string, options?: RequestOptions): Promise<any> {
    const url = `/portfolios/${id}/companies/all`;
    return this.makeRequest('DELETE', url, {
      ...options,
      
      
    });
  }

  /**
   * Get all companies in a portfolio
   * GET /v2/portfolios/{id}/companies
   */
  async GetV2PortfoliosIdCompanies(id: string, queryParams?: { with_factors?: any; page?: any; page_size?: any; sort?: any; portfolios?: any; portfolios_criteria?: any; watchlists?: any; watchlists_criteria?: any; search?: any; facet_search?: any; is_custom_vendor?: any; industry?: any; status?: any; score?: any; grade?: any; last_month_score_change?: any; tags?: any; tags_criteria?: any; public_tags?: any; public_tags_criteria?: any; include_tags?: any; show_products?: any; cves?: any; cves_criteria?: any; issue_types?: any; had_breach_within_last_days?: any; products?: any; business_impact?: any; new_added_only?: any; with_scoring_update?: any; critical_service_exposure_index?: any; malware_exposure_index?: any; social_engineering_susceptibility_index?: any; cumulative_vulnerability_exposure_index?: any }, options?: RequestOptions): Promise<any> {
    const url = `/v2/portfolios/${id}/companies`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get all companies in a portfolio
   * GET /v2/portfolios/{id}/companies/facet/{facet}
   */
  async GetV2PortfoliosIdCompaniesFacetFacet(id: string, facet: string, queryParams?: { page?: any; page_size?: any; sort?: any; portfolios?: any; portfolios_criteria?: any; watchlists?: any; watchlists_criteria?: any; search?: any; facet_search?: any; is_custom_vendor?: any; industry?: any; status?: any; score?: any; grade?: any; last_month_score_change?: any; tags?: any; tags_criteria?: any; public_tags?: any; public_tags_criteria?: any; include_tags?: any; show_products?: any; cves?: any; cves_criteria?: any; issue_types?: any; had_breach_within_last_days?: any; products?: any; business_impact?: any; new_added_only?: any; with_scoring_update?: any; critical_service_exposure_index?: any; malware_exposure_index?: any; social_engineering_susceptibility_index?: any; cumulative_vulnerability_exposure_index?: any }, options?: RequestOptions): Promise<any> {
    const url = `/v2/portfolios/${id}/companies/facet/${facet}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === TAG METHODS ===

  /**
   * Get all scorecard tags
   * GET /scorecard-tags
   */
  async GetScorecardTags(options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Create a scorecard tag
   * POST /scorecard-tags
   */
  async PostScorecardTags(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Deletes a list of tags by the given ids in a singl
   * POST /scorecard-tags/bulk-delete
   */
  async PostScorecardTagsBulkDelete(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/bulk-delete`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Create a new scorecard tag group
   * POST /scorecard-tags/groups
   */
  async PostScorecardTagsGroups(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/groups`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Get all scorecard tag groups
   * GET /scorecard-tags/groups
   */
  async GetScorecardTagsGroups(options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/groups`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === SCORECARD-TAGS METHODS ===

  /**
   * Get all companies associated with a scorecard tag
   * GET /scorecard-tags/{id}/companies
   */
  async GetScorecardTagsIdCompanies(id: string, queryParams?: { grade?: any; industry?: any; vulnerability?: any; issue_type?: any; status?: any; had_breach_within_last_days?: any }, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/${id}/companies`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Add a scorecard tag to a company
   * POST /scorecard-tags/{id}/companies/{domain}
   */
  async PostScorecardTagsIdCompaniesDomain(id: string, domain: string, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/${id}/companies/${domain}`;
    return this.makeRequest('POST', url, {
      ...options,
      
      
    });
  }

  /**
   * Remove a scorecard tag from a company
   * DELETE /scorecard-tags/{id}/companies/{domain}
   */
  async DeleteScorecardTagsIdCompaniesDomain(id: string, domain: string, options?: RequestOptions): Promise<any> {
    const url = `/scorecard-tags/${id}/companies/${domain}`;
    return this.makeRequest('DELETE', url, {
      ...options,
      
      
    });
  }

  // === API METHODS ===

  /**
   * Get all ip domain tags
   * GET /ip-domain-tags
   */
  async Getapi(options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Create an ip domain tag
   * POST /ip-domain-tags
   */
  async Postapi(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Create a new ip domain tag group
   * POST /ip-domain-tags/groups
   */
  async Postapitaggroups(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags/groups`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Get an ip domain tag group
   * GET /ip-domain-tags/groups/{id}
   */
  async Getapitaggroupsbyid(id: string, options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags/groups/${id}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Edit an ip domain tag group
   * PUT /ip-domain-tags/groups/{id}
   */
  async Putapitaggroupsbyid(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags/groups/${id}`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  // === {PARENT DOMAIN} METHODS ===

  /**
   * Get all ip domain tag groups
   * GET /ip-domain-tags/groups
   */
  async Getbyparentdomaintaggroups(options?: RequestOptions): Promise<any> {
    const url = `/ip-domain-tags/groups`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Get all the domains for the parent domain
   * POST /parent-domains/{parentDomain}/domains
   */
  async Postbyparentdomainassetsdomains(parentDomain: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/parent-domains/${parentDomain}/domains`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Get all the ips for the parent domain
   * POST /parent-domains/{parentDomain}/ips
   */
  async Postbyparentdomainassetsips(parentDomain: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/parent-domains/${parentDomain}/ips`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Get all the domains for the parent domain using query parameters
   * GET /footprint/{parentDomain}/assets/domains
   */
  async Getbyparentdomainassetsdomains(parentDomain: string, queryParams?: { page?: any; page-size?: any; sort?: any; filters?: any; filter-operator?: any; include-evidence?: any }, options?: RequestOptions): Promise<any> {
    const url = `/footprint/${parentDomain}/assets/domains`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get all the IPs for the parent domain using query parameters
   * GET /footprint/{parentDomain}/assets/ips
   */
  async Getbyparentdomainassetsips(parentDomain: string, queryParams?: { page?: any; page-size?: any; sort?: any; filters?: any; filter-operator?: any }, options?: RequestOptions): Promise<any> {
    const url = `/footprint/${parentDomain}/assets/ips`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === COMPANY METHODS ===

  /**
   * Search companies in bulk
   * POST /companies/bulk-searches
   */
  async PostCompaniesBulkSearches(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/companies/bulk-searches`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === SCORES METHODS ===

  /**
   * Get a company information and scorecard summary
   * GET /companies/{scorecard_identifier}
   */
  async GetCompaniesScorecardIdentifier(scorecard_identifier: string, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Get a company's expanded risk
   * GET /companies/{scorecard_identifier}/expanded-risk
   */
  async GetCompaniesScorecardIdentifierExpandedRisk(scorecard_identifier: string, queryParams?: { category?: any; confidence?: any; page?: any; limit?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/expanded-risk`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get a company's factor scores and issue counts
   * GET /companies/{scorecard_identifier}/factors
   */
  async GetCompaniesScorecardIdentifierFactors(scorecard_identifier: string, queryParams?: { severity?: any; severity_in?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/factors`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get a company's historical factor scores
   * GET /companies/{scorecard_identifier}/history/factors/score
   */
  async GetCompaniesScorecardIdentifierHistoryFactorsScore(scorecard_identifier: string, queryParams?: { date_from?: any; date_to?: any; timing?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/factors/score`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get a company's historical scores
   * GET /companies/{scorecard_identifier}/history/score
   */
  async GetCompaniesScorecardIdentifierHistoryScore(scorecard_identifier: string, queryParams?: { timing?: any; from?: any; to?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/score`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === EVENT LOG METHODS ===

  /**
   * 
   * GET /companies/{scorecard_identifier}/history/events/
   */
  async GetCompaniesScorecardIdentifierHistoryEvents(scorecard_identifier: string, queryParams?: { date_from?: any; date_to?: any; score_type?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get a company's historical breaches events
   * GET /companies/{domain}/history/events/breaches
   */
  async GetCompaniesDomainHistoryEventsBreaches(domain: string, queryParams?: { date_from?: any; date_to?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${domain}/history/events/breaches`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === ACTIVE FINDINGS METHODS ===

  /**
   * Get the score context for an issue type
   * GET /companies/{domain}/issue-context/{issue_type}
   */
  async GetCompaniesDomainIssueContextIssueType(domain: string, issue_type: string, options?: RequestOptions): Promise<any> {
    const url = `/companies/${domain}/issue-context/${issue_type}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Get "active_cve_exploitation_attempted" issues in 
   * GET /companies/{scorecard_identifier}/issues/active_cve_exploitation_attempted
   */
  async GetCompaniesScorecardIdentifierIssuesActiveCveExploitationAttempted(scorecard_identifier: string, queryParams?: { issue_id?: any; issue_id_in?: any; first_seen_time_from?: any; first_seen_time_to?: any; last_seen_time_from?: any; last_seen_time_to?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/issues/active_cve_exploitation_attempted`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "adware_installation" issues in a scorecard
   * GET /companies/{scorecard_identifier}/issues/adware_installation
   */
  async GetCompaniesScorecardIdentifierIssuesAdwareInstallation(scorecard_identifier: string, queryParams?: { issue_id?: any; issue_id_in?: any; first_seen_time_from?: any; first_seen_time_to?: any; last_seen_time_from?: any; last_seen_time_to?: any; ip_range?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/issues/adware_installation`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "adware_installation_trail" issues in a scorec
   * GET /companies/{scorecard_identifier}/issues/adware_installation_trail
   */
  async GetCompaniesScorecardIdentifierIssuesAdwareInstallationTrail(scorecard_identifier: string, queryParams?: { issue_id?: any; issue_id_in?: any; first_seen_time_from?: any; first_seen_time_to?: any; last_seen_time_from?: any; last_seen_time_to?: any; ip_range?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/issues/adware_installation_trail`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "alleged_breach_incident" issues in a scorecar
   * GET /companies/{scorecard_identifier}/issues/alleged_breach_incident
   */
  async GetCompaniesScorecardIdentifierIssuesAllegedBreachIncident(scorecard_identifier: string, queryParams?: { issue_id?: any; issue_id_in?: any; first_seen_time_from?: any; first_seen_time_to?: any; last_seen_time_from?: any; last_seen_time_to?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/issues/alleged_breach_incident`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === HISTORICAL FINDINGS METHODS ===

  /**
   * Get "active_cve_exploitation_attempted" historical
   * GET /companies/{scorecard_identifier}/history/events/{effective_date}/issues/active_cve_exploitation_attempted/
   */
  async GetCompaniesScorecardIdentifierHistoryEventsEffectiveDateIssuesActiveCveExploitationAttempted(scorecard_identifier: string, effective_date: string, queryParams?: { issue_id?: any; measurement_id_in?: any; effective_date_from?: any; effective_date_to?: any; effective_date_in?: any; group_status?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/${effective_date}/issues/active_cve_exploitation_attempted/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "adware_installation" historical issues in a s
   * GET /companies/{scorecard_identifier}/history/events/{effective_date}/issues/adware_installation/
   */
  async GetCompaniesScorecardIdentifierHistoryEventsEffectiveDateIssuesAdwareInstallation(scorecard_identifier: string, effective_date: string, queryParams?: { issue_id?: any; measurement_id_in?: any; effective_date_from?: any; effective_date_to?: any; effective_date_in?: any; group_status?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/${effective_date}/issues/adware_installation/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "adware_installation_trail" historical issues 
   * GET /companies/{scorecard_identifier}/history/events/{effective_date}/issues/adware_installation_trail/
   */
  async GetCompaniesScorecardIdentifierHistoryEventsEffectiveDateIssuesAdwareInstallationTrail(scorecard_identifier: string, effective_date: string, queryParams?: { issue_id?: any; measurement_id_in?: any; effective_date_from?: any; effective_date_to?: any; effective_date_in?: any; group_status?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/${effective_date}/issues/adware_installation_trail/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "alleged_breach_incident" historical issues in
   * GET /companies/{scorecard_identifier}/history/events/{effective_date}/issues/alleged_breach_incident/
   */
  async GetCompaniesScorecardIdentifierHistoryEventsEffectiveDateIssuesAllegedBreachIncident(scorecard_identifier: string, effective_date: string, queryParams?: { issue_id?: any; measurement_id_in?: any; effective_date_from?: any; effective_date_to?: any; effective_date_in?: any; group_status?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/${effective_date}/issues/alleged_breach_incident/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get "attack_detected" historical issues in a score
   * GET /companies/{scorecard_identifier}/history/events/{effective_date}/issues/attack_detected/
   */
  async GetCompaniesScorecardIdentifierHistoryEventsEffectiveDateIssuesAttackDetected(scorecard_identifier: string, effective_date: string, queryParams?: { issue_id?: any; measurement_id_in?: any; effective_date_from?: any; effective_date_to?: any; effective_date_in?: any; group_status?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/history/events/${effective_date}/issues/attack_detected/`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === CUSTOM SCORECARDS METHODS ===

  /**
   * Create a custom scorecard
   * POST /custom-scorecards
   */
  async PostCustomScorecards(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/custom-scorecards`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Get a custom scorecard
   * GET /custom-scorecards/{id}
   */
  async GetCustomScorecardsId(id: string, queryParams?: { score_type?: any }, options?: RequestOptions): Promise<any> {
    const url = `/custom-scorecards/${id}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Update a custom scorecard
   * PUT /custom-scorecards/{id}
   */
  async PutCustomScorecardsId(id: string, options?: RequestOptions): Promise<any> {
    const url = `/custom-scorecards/${id}`;
    return this.makeRequest('PUT', url, {
      ...options,
      
      
    });
  }

  /**
   * Delete a custom scorecard
   * DELETE /custom-scorecards/{id}
   */
  async DeleteCustomScorecardsId(id: string, options?: RequestOptions): Promise<any> {
    const url = `/custom-scorecards/${id}`;
    return this.makeRequest('DELETE', url, {
      ...options,
      
      
    });
  }

  /**
   * Update custom scorecard filters
   * PATCH /custom-scorecards/{id}/filters
   */
  async PatchCustomScorecardsIdFilters(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/custom-scorecards/${id}/filters`;
    return this.makeRequest('PATCH', url, {
      ...options,
      body,
      
    });
  }

  // === COMPLIANCE METHODS ===

  /**
   * get all available compliance frameworks
   * GET /compliance-frameworks
   */
  async GetComplianceFrameworks(options?: RequestOptions): Promise<any> {
    const url = `/compliance-frameworks`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * get a compliance framework details
   * GET /compliance-frameworks/{key}
   */
  async GetComplianceFrameworksKey(key: string, options?: RequestOptions): Promise<any> {
    const url = `/compliance-frameworks/${key}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === VENDOR-DETECTION METHODS ===

  /**
   * Get third party vendors by portfolio ID
   * GET /vendor-detection/portfolios/{portfolioId}
   */
  async GetVendorDetectionPortfoliosPortfolioid(portfolioId: string, queryParams?: { domain?: any; product?: any; page?: any; limit?: any }, options?: RequestOptions): Promise<any> {
    const url = `/vendor-detection/portfolios/${portfolioId}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get fourth party vendors by domain
   * GET /vendor-detection/{domain}/fourth-party
   */
  async GetVendorDetectionDomainFourthParty(domain: string, queryParams?: { page?: any; limit?: any }, options?: RequestOptions): Promise<any> {
    const url = `/vendor-detection/${domain}/fourth-party`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get products by domain
   * GET /vendor-detection/{domain}/products
   */
  async GetVendorDetectionDomainProducts(domain: string, options?: RequestOptions): Promise<any> {
    const url = `/vendor-detection/${domain}/products`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Get risk score by domain
   * GET /vendor-detection/{domain}/risk
   */
  async GetVendorDetectionDomainRisk(domain: string, options?: RequestOptions): Promise<any> {
    const url = `/vendor-detection/${domain}/risk`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * Get third party vendors by domain
   * GET /vendor-detection/{domain}/third-party
   */
  async GetVendorDetectionDomainThirdParty(domain: string, queryParams?: { page?: any; limit?: any }, options?: RequestOptions): Promise<any> {
    const url = `/vendor-detection/${domain}/third-party`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === REPORTS METHODS ===

  /**
   * Generate a Company Compliance Framework Report in CSV
   * POST /reports/compliance/csv/export
   */
  async PostReportsComplianceCsvExport(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/reports/compliance/csv/export`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Generate a Company Detailed report
   * POST /reports/detailed
   */
  async PostReportsDetailed(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/reports/detailed`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Generate a Company Events report
   * POST /reports/events-json
   */
  async PostReportsEventsJson(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/reports/events-json`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Download a generated report
   * GET /reports/files/{file_path}
   */
  async GetReportsFilesFilePath(file_path: string, queryParams?: { lng?: any }, options?: RequestOptions): Promise<any> {
    const url = `/reports/files/${file_path}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Generate a CSV containing Scorecard Domains
   * POST /reports/footprint-domains
   */
  async PostReportsFootprintDomains(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/reports/footprint-domains`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === INVITATION METHODS ===

  /**
   * create a new invitation for a new user/vendor
   * POST /invitations
   */
  async PostInvitations(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/invitations`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === FEEDBACK METHODS ===

  /**
   * Send a new feedback validation request on findings
   * POST /companies/{domain}/issues/{type}/feedback-validation-request
   */
  async PostCompaniesDomainIssuesTypeFeedbackValidationRequest(domain: string, type: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/companies/${domain}/issues/${type}/feedback-validation-request`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Send new feedback on findings from a specific issu
   * POST /companies/{domain}/issues/{type}/feedback/
   */
  async PostCompaniesDomainIssuesTypeFeedback(domain: string, type: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/companies/${domain}/issues/${type}/feedback/`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === METADATA METHODS ===

  /**
   * get metadata for the factors used when scoring com
   * GET /metadata/factors
   */
  async GetMetadataFactors(options?: RequestOptions): Promise<any> {
    const url = `/metadata/factors`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * get metadata for all issue types that can be detec
   * GET /metadata/issue-types
   */
  async GetMetadataIssueTypes(options?: RequestOptions): Promise<any> {
    const url = `/metadata/issue-types`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * get detailed metadata for the issue type
   * GET /metadata/issue-types/{type}
   */
  async GetMetadataIssueTypesType(type: string, options?: RequestOptions): Promise<any> {
    const url = `/metadata/issue-types/${type}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === USER METHODS ===

  /**
   * get all notifications from latest 7 days
   * GET /users/by-username/{username}/notifications/recent
   */
  async GetUsersByUsernameUsernameNotificationsRecent(username: string, queryParams?: { portfolio?: any; sort?: any; order?: any; unread?: any; page_size?: any }, options?: RequestOptions): Promise<any> {
    const url = `/users/by-username/${username}/notifications/recent`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * get user by username
   * GET /v2/users/by-username/{username}
   */
  async GetV2UsersByUsernameUsername(username: string, options?: RequestOptions): Promise<any> {
    const url = `/v2/users/by-username/${username}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === SAML METHODS ===

  /**
   * returns SAML Service Provider metadata
   * GET /v1/saml/metadata/service-provider
   */
  async GetV1SamlMetadataServiceProvider(options?: RequestOptions): Promise<any> {
    const url = `/v1/saml/metadata/service-provider`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === APPS METHODS ===

  /**
   * creates an app job
   * POST /apps/{appId}/jobs
   */
  async Postappsbyappidjobs(appId: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/apps/${appId}/jobs`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Update a Job
   * PUT /apps/{appId}/jobs/{jobId}
   */
  async Putappsbyappidjobsbyjobid(appId: string, jobId: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/apps/${appId}/jobs/${jobId}`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  // === AUDIT METHODS ===

  /**
   * get api audit logs
   * GET /audits/api-logs
   */
  async GetAuditsApiLogs(queryParams?: { usernames?: any; activities?: any; categories?: any; sub_categories?: any; start_date?: any; end_date?: any; page?: any; page_size?: any; sort?: any; desc?: any; is_api_request?: any; search?: any; path?: any }, options?: RequestOptions): Promise<any> {
    const url = `/audits/api-logs`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === ISSUES METHODS ===

  /**
   * Get a company's active issues
   * GET /companies/{scorecard_identifier}/active-issues
   */
  async GetCompaniesScorecardIdentifierActiveIssues(scorecard_identifier: string, queryParams?: { issue_types?: any }, options?: RequestOptions): Promise<any> {
    const url = `/companies/${scorecard_identifier}/active-issues`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === TAGS METHODS ===

  /**
   * bulk tags creation
   * POST /footprint/tags/bulk
   */
  async Posttagsbulk(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/footprint/tags/bulk`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === MANAGEDSERVICES METHODS ===

  /**
   * Remove a managed customer and delete its managed p
   * DELETE /managed-services/customers/{customer_id}
   */
  async DeleteManagedServicesCustomersCustomerId(customer_id: string, options?: RequestOptions): Promise<any> {
    const url = `/managed-services/customers/${customer_id}`;
    return this.makeRequest('DELETE', url, {
      ...options,
      
      
    });
  }

  /**
   * delete provided documents
   * DELETE /managed-services/documents
   */
  async DeleteManagedServicesDocuments(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/managed-services/documents`;
    return this.makeRequest('DELETE', url, {
      ...options,
      body,
      
    });
  }

  /**
   * get document data with download url
   * GET /managed-services/documents/download/{document_id}
   */
  async GetManagedServicesDocumentsDownloadDocumentId(document_id: string, options?: RequestOptions): Promise<any> {
    const url = `/managed-services/documents/download/${document_id}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * upload a new document
   * POST /managed-services/documents/upload
   */
  async PostManagedServicesDocumentsUpload(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/managed-services/documents/upload`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * edit metadata of already uploaded document
   * PUT /managed-services/documents/upload
   */
  async PutManagedServicesDocumentsUpload(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/managed-services/documents/upload`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  // === REPORTS METHODS ===

  /**
   * Publish or unpublish the report
   * PUT /max/reports/likelihood-assessments
   */
  async Putreportslikelihoodassessments(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/max/reports/likelihood-assessments`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Publish or unpublish the report
   * PUT /max/reports/remediation-plans
   */
  async Putreportsremediationplans(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/max/reports/remediation-plans`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  // === V1 METHODS ===

  /**
   * Gets breaches
   * GET /max/v1/breaches
   */
  async Getv1Breaches(queryParams?: { page?: any; limit?: any; triaged?: any; report?: any; customer_id?: any; customer_name?: any; customer_domain?: any; vendor_id?: any; vendor_domain?: any; vendor_name?: any; published_at?: any; search?: any; tiers?: any; sort?: any; triaged_at?: any }, options?: RequestOptions): Promise<any> {
    const url = `/max/v1/breaches`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Update the status of the finding as reported to make it available in the Likelihood Assessment report
   * PUT /max/v1/breaches
   */
  async Putv1Breaches(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/max/v1/breaches`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Gets breaches for the current customer
   * GET /max/v1/customer/breaches
   */
  async Getv1Customerbreaches(queryParams?: { page?: any; limit?: any; triaged?: any; report?: any; vendor_id?: any; vendor_domain?: any; vendor_name?: any; published_at?: any; tiers?: any; search?: any; sort?: any }, options?: RequestOptions): Promise<any> {
    const url = `/max/v1/customer/breaches`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Gets triaged and reported findings of a customer having the id
   * GET /max/v1/customer/findings
   */
  async Getv1Customerfindings(queryParams?: { page?: any; limit?: any; sort?: any; with_hostname?: any; all_dates?: any; domain?: any; business_impacts?: any; incident_likelihoods?: any; hostname_matches?: any; max_severity?: any; issue_category?: any; issue_type_name?: any; issue_type_key?: any; hostname?: any; vendor_id?: any; vendor_domain?: any; vendor_name?: any; last_seen?: any; first_seen?: any; first_observed_at?: any; cve_severity?: any; cve_exploited?: any; edited_at?: any; triaged_at?: any; tiers?: any; search?: any }, options?: RequestOptions): Promise<any> {
    const url = `/max/v1/customer/findings`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get incident likelihood over time for the authenticated customer
   * GET /max/v1/customer/incident-likelihood-over-time/{end_date}
   */
  async Getv1Customerincidentlikelihoodovertimebyenddate(end_date: string, options?: RequestOptions): Promise<any> {
    const url = `/max/v1/customer/incident-likelihood-over-time/${end_date}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === V2 METHODS ===

  /**
   * Get list of all issue types
   * GET /max/v2/indicators
   */
  async Getv2Indicators(queryParams?: { page?: any; limit?: any; search?: any; sort?: any }, options?: RequestOptions): Promise<any> {
    const url = `/max/v2/indicators`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get a issue type
   * GET /max/v2/indicators/{issue_type}
   */
  async Getv2Indicatorsbyissuetype(issue_type: string, options?: RequestOptions): Promise<any> {
    const url = `/max/v2/indicators/${issue_type}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === ACTION PLANS METHODS ===

  /**
   * Get plans list
   * GET /plans
   */
  async Getplans(queryParams?: { type?: any; filter?: any; search?: any; scorecard?: any; status?: any; page?: any; pageSize?: any; sort?: any }, options?: RequestOptions): Promise<any> {
    const url = `/plans`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Archive list of plans by ID
   * POST /plans/archive
   */
  async Postplansarchive(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/plans/archive`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Create new factor score improvement plan
   * POST /plans/factor-score-improvement
   */
  async Postplansfactorscoreimprovement(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/plans/factor-score-improvement`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Update partially the factor score improvement plan by ID
   * PATCH /plans/factor-score-improvement/{id}
   */
  async Patchplansfactorscoreimprovementbyid(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/plans/factor-score-improvement/${id}`;
    return this.makeRequest('PATCH', url, {
      ...options,
      body,
      
    });
  }

  /**
   * Create new issue resolution plan
   * POST /plans/issue-resolution
   */
  async Postplansissueresolution(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/plans/issue-resolution`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === ASSESSMENTS METHODS ===

  /**
   * Create an Atlas Assessments job request
   * POST /reports/assessments
   */
  async PostReportsAssessments(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/reports/assessments`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === CUSTOMDASHBOARD METHODS ===

  /**
   * creates a dashboard
   * POST /v1/custom-dashboards
   */
  async PostV1CustomDashboards(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/v1/custom-dashboards`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  // === ISSUE FINDING STATUS METHODS ===

  /**
   * Obtain metadata for a given issue
   * GET /v1/issues/{id}
   */
  async GetV1IssuesId(id: string, options?: RequestOptions): Promise<any> {
    const url = `/v1/issues/${id}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  // === ORGANIZATION METHODS ===

  /**
   * get the profile of the organization
   * GET /v1/organizations/{id}/profile
   */
  async GetV1OrganizationsIdProfile(id: string, options?: RequestOptions): Promise<any> {
    const url = `/v1/organizations/${id}/profile`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * set the organization overview description
   * PUT /v1/organizations/{id}/profile
   */
  async PutV1OrganizationsIdProfile(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/v1/organizations/${id}/profile`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  /**
   * set the organization profile trust center
   * PUT /v1/organizations/{id}/trust-center
   */
  async PutV1OrganizationsIdTrustCenter(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/v1/organizations/${id}/trust-center`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  /**
   * get the draft profile of the organization
   * GET /v1/organizations/{id}/trust-center/draft
   */
  async GetV1OrganizationsIdTrustCenterDraft(id: string, options?: RequestOptions): Promise<any> {
    const url = `/v1/organizations/${id}/trust-center/draft`;
    return this.makeRequest('GET', url, {
      ...options,
      
      
    });
  }

  /**
   * set the organization profile trust center draft
   * PUT /v1/organizations/{id}/trust-center/draft
   */
  async PutV1OrganizationsIdTrustCenterDraft(id: string, body?: any, options?: RequestOptions): Promise<any> {
    const url = `/v1/organizations/${id}/trust-center/draft`;
    return this.makeRequest('PUT', url, {
      ...options,
      body,
      
    });
  }

  // === SCORECARD METHODS ===

  /**
   * Get all scorecards filtered by portfolio/s and/or 
   * GET /v2/scorecards/search
   */
  async GetV2ScorecardsSearch(queryParams?: { page?: any; page_size?: any; sort?: any; portfolios?: any; portfolios_criteria?: any; watchlists?: any; watchlists_criteria?: any; search?: any; facet_search?: any; is_custom_vendor?: any; industry?: any; status?: any; score?: any; grade?: any; last_month_score_change?: any; tags?: any; tags_criteria?: any; public_tags?: any; public_tags_criteria?: any; include_tags?: any; show_products?: any; cves?: any; cves_criteria?: any; issue_types?: any; had_breach_within_last_days?: any; products?: any; business_impact?: any; new_added_only?: any; with_scoring_update?: any; critical_service_exposure_index?: any; malware_exposure_index?: any; social_engineering_susceptibility_index?: any; cumulative_vulnerability_exposure_index?: any }, options?: RequestOptions): Promise<any> {
    const url = `/v2/scorecards/search`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * Get portfolio facet
   * GET /v2/scorecards/search/facet/{facet}
   */
  async GetV2ScorecardsSearchFacetFacet(facet: string, queryParams?: { page?: any; page_size?: any; sort?: any; portfolios?: any; portfolios_criteria?: any; watchlists?: any; watchlists_criteria?: any; search?: any; facet_search?: any; is_custom_vendor?: any; industry?: any; status?: any; score?: any; grade?: any; last_month_score_change?: any; tags?: any; tags_criteria?: any; public_tags?: any; public_tags_criteria?: any; include_tags?: any; show_products?: any; cves?: any; cves_criteria?: any; issue_types?: any; had_breach_within_last_days?: any; products?: any; business_impact?: any; new_added_only?: any; with_scoring_update?: any; critical_service_exposure_index?: any; malware_exposure_index?: any; social_engineering_susceptibility_index?: any; cumulative_vulnerability_exposure_index?: any }, options?: RequestOptions): Promise<any> {
    const url = `/v2/scorecards/search/facet/${facet}`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  // === VENDORPORTFOLIOAUTOMATION METHODS ===

  /**
   * Ingest vendor data to be included in the domain's 
   * POST /vendor-portfolio-automation/ingest
   */
  async PostVendorPortfolioAutomationIngest(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/vendor-portfolio-automation/ingest`;
    return this.makeRequest('POST', url, {
      ...options,
      body,
      
    });
  }

  /**
   * bulk delete ingested vendors
   * DELETE /vendor-portfolio-automation/ingest
   */
  async DeleteVendorPortfolioAutomationIngest(body?: any, options?: RequestOptions): Promise<any> {
    const url = `/vendor-portfolio-automation/ingest`;
    return this.makeRequest('DELETE', url, {
      ...options,
      body,
      
    });
  }

  /**
   * retrieve all ingested vendors regardless of if the
   * GET /vendor-portfolio-automation/ingested-vendors
   */
  async GetVendorPortfolioAutomationIngestedVendors(queryParams?: { page?: any; page_size?: any; sort?: any; search?: any; sources?: any; source_ids?: any; vendor_name?: any; is_dismissed?: any; is_overridden?: any }, options?: RequestOptions): Promise<any> {
    const url = `/vendor-portfolio-automation/ingested-vendors`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

  /**
   * retrieve suggested vendors for the caller's domain
   * GET /vendor-portfolio-automation/suggested-vendors
   */
  async GetVendorPortfolioAutomationSuggestedVendors(queryParams?: { page?: any; page_size?: any; sort?: any; portfolios?: any; portfolios_criteria?: any; watchlists?: any; watchlists_criteria?: any; search?: any; facet_search?: any; is_custom_vendor?: any; industry?: any; status?: any; score?: any; grade?: any; last_month_score_change?: any; tags?: any; tags_criteria?: any; public_tags?: any; public_tags_criteria?: any; include_tags?: any; show_products?: any; cves?: any; cves_criteria?: any; issue_types?: any; had_breach_within_last_days?: any; products?: any; business_impact?: any; new_added_only?: any; with_scoring_update?: any; critical_service_exposure_index?: any; malware_exposure_index?: any; social_engineering_susceptibility_index?: any; cumulative_vulnerability_exposure_index?: any; sources?: any; source_ids?: any; monitored?: any; add_to_portfolio?: any; vsor_status?: any; vsor_data_types_shared?: any; vsor_risk?: any; vsor_business_unit?: any; vsor_internal_contact?: any; vsor_contract_end_date_from?: any; vsor_contract_end_date_to?: any; has_contacts?: any; uuids?: any }, options?: RequestOptions): Promise<any> {
    const url = `/vendor-portfolio-automation/suggested-vendors`;
    return this.makeRequest('GET', url, {
      ...options,
      
      queryParams,
    });
  }

}