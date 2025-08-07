# Security Scorecard API Reference for Coding Assistants

This document provides a comprehensive, machine-readable API reference for the Security Scorecard platform. It is designed to be consumed by coding assistants like ChatGPT Codex to facilitate the development of MCP servers and other integrations.

## 1. API Fundamentals

This section covers the basic principles and specifications required to interact with the Security Scorecard API.

### 1.1. Base URL

All API requests must be made to the following base URL:

```
https://api.securityscorecard.io
```

### 1.2. Authentication

Authentication is handled via token-based authentication. Each request must include an `Authorization` header with a valid API key.

**Header Format:**

```
Authorization: Token YOUR_API_KEY
```

**Key Management:**

*   API keys can be generated from the Security Scorecard platform under **My Settings > API**.
*   Generating a new API key will invalidate the previous one.
*   API keys do not have an automatic expiration date.
*   API access is not available for Free tier accounts.

### 1.3. Data Format

All request and response bodies are in JSON format (`application/json`), unless otherwise specified for a particular endpoint (e.g., CSV or PDF downloads).

### 1.4. HTTPS Requirement

All API communication must be over HTTPS. The supported TLS versions are 1.2 and 1.3. Requests made over HTTP will be rejected.

### 1.5. Rate Limiting

The API enforces a rate limit of **5,000 requests per hour** per client. This is managed using a rolling 60-minute window.

When the rate limit is exceeded, the API will return an HTTP `429 Too Many Requests` status code. The response will also include a `Retry-After` header indicating the number of seconds to wait before making another request.

### 1.6. Pagination

The API supports two methods for paginating through large sets of data:

1.  **Page-based Pagination:** This method uses the `page` and `size` query parameters. The default page size is 50, with a maximum of 50.
2.  **Cursor-based Pagination:** For larger collections, the API uses a more efficient cursor-based approach with `cursor` and `limit` parameters.

### 1.7. Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request. Errors are categorized as follows:

*   **4xx Client Errors:** These indicate an issue with the client's request (e.g., `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).
*   **5xx Server Errors:** These indicate a problem on the server-side (e.g., `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`).

Error responses include a JSON body with a detailed message explaining the cause of the error.

### 1.8. Backwards Compatibility

The API follows a versioning scheme to ensure stability for integrations:

*   **Major versions** are included in the URL path (e.g., `/v1`, `/v2`).
*   **Minor and patch versions** are handled via Semantic Versioning (SEMVER).
*   A **deprecation notice period** of at least 6 months is provided for breaking changes.
*   The `Accepts-Version` header can be used to specify a particular API version.




## 2. API Endpoints

This section details the various API endpoints available, categorized by their functionality. Each endpoint description includes its HTTP method, URL path, parameters, and a brief explanation of its purpose.

### 2.1. Portfolios API

The Portfolios API allows you to manage and retrieve information about your Security Scorecard portfolios.

| Method | Path | Description |
|---|---|---|
| `POST` | `/portfolios` | Create a new portfolio |
| `PUT` | `/portfolios/{portfolio_id}` | Edit a portfolio |
| `DELETE` | `/portfolios/{portfolio_id}` | Delete a portfolio |
| `GET` | `/portfolios/{portfolio_id}` | Get portfolio details |
| `POST` | `/portfolios/{portfolio_id}/companies` | Add a company to a portfolio |
| `DELETE` | `/portfolios/{portfolio_id}/companies/{scorecard_identifier}` | Remove a company from a portfolio |





### 2.2. All Companies [New] API

The All Companies [New] API provides access to information about all companies monitored by Security Scorecard.

| Method | Path | Description |
|---|---|---|
| `GET` | `/companies` | Get all companies |
| `GET` | `/companies/{scorecard_identifier}` | Get company details |





### 2.3. Scorecard Tags API

The Scorecard Tags API allows you to manage and retrieve tags associated with scorecards.

| Method | Path | Description |
|---|---|---|
| `GET` | `/scorecard-tags` | Get all scorecard tags |
| `POST` | `/scorecard-tags` | Create a scorecard tag |
| `PUT` | `/scorecard-tags/{tag_id}` | Update a scorecard tag |
| `DELETE` | `/scorecard-tags/{tag_id}` | Delete a scorecard tag |
| `POST` | `/scorecard-tags/{tag_id}/companies` | Add a company to a scorecard tag |
| `DELETE` | `/scorecard-tags/{tag_id}/companies/{scorecard_identifier}` | Remove a company from a scorecard tag |





### 2.4. Scores API

The Scores API provides access to company and industry scores.

| Method | Path | Description |
|---|---|---|
| `POST` | `/companies/bulk-searches` | Search companies in bulk |
| `GET` | `/companies/{scorecard_identifier}/summary` | Get a company information and scorecard summary |
| `GET` | `/companies/{scorecard_identifier}/summary-factors` | Get a company information, scorecard summary, factor scores and issue counts |
| `GET` | `/companies/{scorecard_identifier}/factors` | Get a company's factor scores and issue counts |
| `GET` | `/companies/{scorecard_identifier}/history` | Get a company's historical scores |
| `GET` | `/industries/{industry_id}/scores/history` | Get industry scores history |
| `GET` | `/industries/{industry_id}/factors/scores/history` | Get industry factor scores history |





### 2.5. Event Logs API

The Event Logs API provides access to historical events and breaches for companies.

| Method | Path | Description |
|---|---|---|
| `GET` | `/companies/{scorecard_identifier}/history/events` | Get a company's historical events |
| `GET` | `/companies/{scorecard_identifier}/history/breaches` | Get a company's historical breaches events |





### 2.6. Active Findings API

The Active Findings API provides access to active security issues in a scorecard.

| Method | Path | Description |
|---|---|---|
| `GET` | `/companies/{scorecard_identifier}/issues/active` | Get all active issues in a scorecard |
| `GET` | `/companies/{scorecard_identifier}/issues/active/{issue_type}` | Get active issues by type |





### 2.7. Historical Findings API

The Historical Findings API provides access to historical security issues in a scorecard.

| Method | Path | Description |
|---|---|---|
| `GET` | `/companies/{scorecard_identifier}/issues/historical` | Get all historical issues in a scorecard |
| `GET` | `/companies/{scorecard_identifier}/issues/historical/{issue_type}` | Get historical issues by type |





### 2.8. Custom Scorecards API

The Custom Scorecards API allows you to manage custom scorecards.

| Method | Path | Description |
|---|---|---|
| `GET` | `/custom-scorecards` | Get all custom scorecards |
| `POST` | `/custom-scorecards` | Create a custom scorecard |
| `PUT` | `/custom-scorecards/{custom_scorecard_id}` | Update a custom scorecard |
| `DELETE` | `/custom-scorecards/{custom_scorecard_id}` | Delete a custom scorecard |





### 2.9. Vendor Detection API

The Vendor Detection API allows you to manage vendor detection for companies.

| Method | Path | Description |
|---|---|---|
| `GET` | `/vendor-detection/companies` | Get all companies with vendor detection enabled |
| `POST` | `/vendor-detection/companies` | Enable vendor detection for a company |
| `DELETE` | `/vendor-detection/companies/{domain}` | Disable vendor detection for a company |





### 2.10. Reports API

The Reports API allows you to manage and download reports.

| Method | Path | Description |
|---|---|---|
| `GET` | `/reports` | Get all reports |
| `POST` | `/reports` | Create a report |
| `GET` | `/reports/{report_id}` | Get report details |
| `GET` | `/reports/{report_id}/download` | Download report file |





### 2.11. Security Management API

The Security Management API allows you to manage users.

| Method | Path | Description |
|---|---|---|
| `GET` | `/security-management/users` | Get all users |
| `GET` | `/security-management/users/{user_id}` | Get user details |
| `PUT` | `/security-management/users/{user_id}` | Update user details |
| `DELETE` | `/security-management/users/{user_id}` | Delete a user |





### 2.12. Data and Metadata API

The Data and Metadata API provides access to various data and metadata related to Security Scorecard.

| Method | Path | Description |
|---|---|---|
| `GET` | `/data-metadata/industries` | Get all industries |
| `GET` | `/data-metadata/issue-types` | Get all issue types |
| `GET` | `/data-metadata/factor-types` | Get all factor types |





### 2.13. Integrations and Automation API

The Integrations and Automation API allows you to manage integrations.

| Method | Path | Description |
|---|---|---|
| `GET` | `/integrations` | Get all integrations |
| `POST` | `/integrations` | Create an integration |
| `PUT` | `/integrations/{integration_id}` | Update an integration |
| `DELETE` | `/integrations/{integration_id}` | Delete an integration |





### 2.14. Action Plans API

The Action Plans API allows you to manage action plans.

| Method | Path | Description |
|---|---|---|
| `GET` | `/action-plans` | Get all action plans |
| `POST` | `/action-plans` | Create an action plan |
| `PUT` | `/action-plans/{action_plan_id}` | Update an action plan |
| `DELETE` | `/action-plans/{action_plan_id}` | Delete an action plan |





### 2.15. IP Domain Tags API

The IP Domain Tags API has moved to the External Attack Surface Management section. You can find more information about it there.

| Method | Path | Description |
|---|---|---|
| `GET` | `/external-attack-surface-management/ip-domain-tags` | Get all IP Domain Tags |
| `POST` | `/external-attack-surface-management/ip-domain-tags` | Create an IP Domain Tag |
| `PUT` | `/external-attack-surface-management/ip-domain-tags/{tag_id}` | Update an IP Domain Tag |
| `DELETE` | `/external-attack-surface-management/ip-domain-tags/{tag_id}` | Delete an IP Domain Tag |




## 3. Findings Filtering and Domain/IP Specific Endpoints

This section details the API capabilities for filtering and retrieving findings based on specific criteria such as domain, IP address, and finding type. These endpoints are essential for organizations that need to work with their own security findings in a granular manner.

### 3.1. Active Findings with Filtering

The Active Findings API supports various filtering parameters to retrieve specific types of findings:

| Method | Path | Description | Key Parameters |
|---|---|---|---|
| `GET` | `/companies/{scorecard_identifier}/issues/{issue_type}` | Get active issues by specific type | `issue_id`, `issue_id_in`, `first_seen_time_from`, `first_seen_time_to`, `last_seen_time_from`, `last_seen_time_to`, `ip_range` |

**Common Issue Types for Active Findings:**
- `active_cve_exploitation_attempted` - Active CVE exploitation attempts
- `adware_installation` - Adware installation findings
- `adware_installation_trail` - Adware installation trail findings
- `compromised_by_information_stealer` - Information stealer compromise findings
- `general_scan_detected` - General scan detection findings
- `malicious_scan_detected` - Malicious scan detection findings
- `uce` - Unsolicited commercial email findings

**Filtering Parameters:**
- `issue_id` (uuid) - Find entries where "issue_id" equals a specific UUID
- `issue_id_in` (string) - Find entries where "issue_id" is in a set of UUIDs (comma-separated)
- `first_seen_time_from` (date-time) - Find entries where "first_seen_time" is greater or equal than a date-time
- `first_seen_time_to` (date-time) - Find entries where "first_seen_time" is lower or equal than a date-time
- `last_seen_time_from` (date-time) - Find entries where "last_seen_time" is greater or equal than a date-time
- `last_seen_time_to` (date-time) - Find entries where "last_seen_time" is lower or equal than a date-time
- `ip_range` (string) - Filter findings by IP range

### 3.2. Historical Findings with Filtering

Historical findings can be filtered using similar parameters:

| Method | Path | Description | Key Parameters |
|---|---|---|---|
| `GET` | `/companies/{scorecard_identifier}/issues/historical/{issue_type}` | Get historical issues by specific type | Same filtering parameters as active findings |

### 3.3. Domain-Specific Endpoints

These endpoints allow you to retrieve information specific to domains:

| Method | Path | Description |
|---|---|---|
| `GET` | `/vendor-detection/{domain}/risk` | Get risk score by domain |
| `GET` | `/vendor-detection/{domain}/third-party` | Get third party vendors by domain |
| `GET` | `/vendor-detection/{domain}/fourth-party` | Get fourth party vendors by domain |
| `GET` | `/vendor-detection/{domain}/products` | Get products by domain |
| `GET` | `/companies/{domain}/issue-context/{issue_type}` | Get the score context for an issue type |

### 3.4. IP and Domain Asset Management

The External Attack Surface Management section provides endpoints for managing IP and domain assets:

| Method | Path | Description |
|---|---|---|
| `GET` | `/external-attack-surface-management/ip-domain-tags` | Get all IP Domain Tags |
| `POST` | `/external-attack-surface-management/ip-domain-tags` | Create an IP Domain Tag |
| `PUT` | `/external-attack-surface-management/ip-domain-tags/{tag_id}` | Update an IP Domain Tag |
| `DELETE` | `/external-attack-surface-management/ip-domain-tags/{tag_id}` | Delete an IP Domain Tag |

### 3.5. Finding Categories

The Security Scorecard API organizes findings into several categories, each with specific endpoints:

#### 3.5.1. General Findings
- Basic security findings and issues

#### 3.5.2. Vulnerability & Exploitation Findings
- `active_cve_exploitation_attempted`
- `cve_in_use_by_threat_actor`
- `exploit_attempt_detected`

#### 3.5.3. Malware & Botnets Findings
- `adware_installation`
- `adware_installation_trail`
- `compromised_by_information_stealer`

#### 3.5.4. Network Security & Infrastructure Findings
- Network-related security issues

#### 3.5.5. Network Service Findings
- Service-specific security findings

#### 3.5.6. Web Security Findings
- Web application security issues

#### 3.5.7. Data Security & Privacy Findings
- Data protection and privacy-related findings

#### 3.5.8. Email Security Findings
- Email-related security issues

#### 3.5.9. System Configuration & Patching Findings
- System configuration and patch management issues

### 3.6. Score Impact Filtering

To retrieve findings that specifically impact scores, you can use the severity filtering parameters:

**Severity Levels:**
- `high` - High severity findings that significantly impact scores
- `medium` - Medium severity findings with moderate score impact
- `low` - Low severity findings with minimal score impact
- `positive` - Positive findings that may improve scores
- `info` - Informational findings with no score impact

**Usage Example:**
```
GET /companies/{scorecard_identifier}/factors?severity=high
GET /companies/{scorecard_identifier}/factors?severity_in=high,medium
```

### 3.7. Bulk Operations

For organizations managing multiple domains or IPs, the bulk search endpoint allows efficient querying:

| Method | Path | Description |
|---|---|---|
| `POST` | `/companies/bulk-searches` | Search companies in bulk |

This endpoint accepts multiple company identifiers and returns comprehensive information for each, making it ideal for batch processing of findings across multiple assets.


## 4. Practical Implementation Examples

This section provides practical examples of how to use the Security Scorecard API for common use cases related to findings management, domain/IP filtering, and score impact analysis.

### 4.1. Retrieving All Domains with Score Impact Findings

To get all domains with findings that impact your security score, you would typically:

1. **Get Company Summary with Factor Scores:**
```bash
GET /companies/{scorecard_identifier}/summary-factors
```

2. **Filter for High and Medium Severity Findings:**
```bash
GET /companies/{scorecard_identifier}/factors?severity_in=high,medium
```

3. **Get Specific Issue Types by Domain:**
```bash
GET /companies/{domain}/issue-context/{issue_type}
```

### 4.2. Retrieving All IPs with Findings

To get all IP addresses associated with findings:

1. **Get Active Findings with IP Range Filter:**
```bash
GET /companies/{scorecard_identifier}/issues/{issue_type}?ip_range={ip_range}
```

2. **Use IP Domain Tags for Asset Management:**
```bash
GET /external-attack-surface-management/ip-domain-tags
```

### 4.3. Retrieving All Findings for a Particular Domain

To get comprehensive findings for a specific domain:

1. **Get Domain Risk Score:**
```bash
GET /vendor-detection/{domain}/risk
```

2. **Get Active Issues for Domain:**
```bash
GET /companies/{domain}/issues/active
```

3. **Get Historical Issues for Domain:**
```bash
GET /companies/{domain}/issues/historical
```

4. **Get Issue Context:**
```bash
GET /companies/{domain}/issue-context/{issue_type}
```

### 4.4. Retrieving All Findings for a Particular IP

To get findings specific to an IP address:

1. **Filter Active Findings by IP Range:**
```bash
GET /companies/{scorecard_identifier}/issues/{issue_type}?ip_range={specific_ip}
```

2. **Use Time-Based Filtering:**
```bash
GET /companies/{scorecard_identifier}/issues/{issue_type}?ip_range={ip}&first_seen_time_from={date}&last_seen_time_to={date}
```

### 4.5. Common Query Parameters

When working with findings endpoints, these parameters are commonly used:

**Time-Based Filtering:**
- `first_seen_time_from` - ISO 8601 date-time format (e.g., "2020-01-30T00:00:00.000Z")
- `first_seen_time_to` - ISO 8601 date-time format
- `last_seen_time_from` - ISO 8601 date-time format
- `last_seen_time_to` - ISO 8601 date-time format

**Issue Identification:**
- `issue_id` - Specific UUID for a single issue
- `issue_id_in` - Comma-separated list of UUIDs for multiple issues

**Network Filtering:**
- `ip_range` - IP address or CIDR notation for network filtering

**Severity Filtering:**
- `severity` - Single severity level (high, medium, low, positive, info)
- `severity_in` - Comma-separated list of severity levels

## 5. Response Formats and Data Structures

### 5.1. Standard Response Format

All API responses follow a consistent JSON structure:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "size": 50,
    "total": 150,
    "has_next": true
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 5.2. Finding Object Structure

Individual findings typically contain:

```json
{
  "issue_id": "uuid",
  "issue_type": "string",
  "severity": "high|medium|low|positive|info",
  "first_seen_time": "2024-01-01T00:00:00Z",
  "last_seen_time": "2024-01-01T00:00:00Z",
  "ip_address": "192.168.1.1",
  "domain": "example.com",
  "port": 443,
  "protocol": "https",
  "description": "string",
  "remediation": "string",
  "score_impact": -10
}
```

### 5.3. Company Summary Structure

Company summary responses include:

```json
{
  "domain": "example.com",
  "name": "Example Company",
  "industry": "Technology",
  "size": "Large",
  "score": 85,
  "grade": "B",
  "factors": {
    "network_security": 90,
    "dns_health": 85,
    "patching_cadence": 80,
    "endpoint_security": 75,
    "ip_reputation": 95,
    "web_application_security": 70,
    "cubit_score": 85,
    "hacker_chatter": 100,
    "leaked_information": 90,
    "social_engineering": 85
  },
  "issue_counts": {
    "high": 2,
    "medium": 5,
    "low": 10,
    "positive": 3,
    "info": 15
  }
}
```

## 6. Error Handling and Best Practices

### 6.1. Common Error Responses

**400 Bad Request:**
- Malformed scorecard_identifier or authorization header
- Invalid query parameters

**401 Unauthorized:**
- Invalid or missing API key
- Expired authentication token

**403 Forbidden:**
- Company must be added to a portfolio first to access scorecard data
- Insufficient permissions for the requested operation

**404 Not Found:**
- Company doesn't have a scorecard yet
- Requested resource does not exist

**429 Too Many Requests:**
- Rate limit exceeded (5,000 requests per hour)
- Includes `Retry-After` header with wait time in seconds

### 6.2. Best Practices for Implementation

**Authentication:**
- Store API keys securely and rotate them regularly
- Use environment variables for API key storage
- Implement proper error handling for authentication failures

**Rate Limiting:**
- Implement exponential backoff for rate limit errors
- Monitor your request rate to stay within limits
- Use bulk endpoints when available to reduce API calls

**Data Management:**
- Cache frequently accessed data to reduce API calls
- Implement proper pagination handling for large datasets
- Use appropriate filtering parameters to reduce response sizes

**Error Handling:**
- Implement comprehensive error handling for all HTTP status codes
- Log errors appropriately for debugging and monitoring
- Provide meaningful error messages to end users

**Performance:**
- Use appropriate timeout values for API requests
- Implement connection pooling for high-volume applications
- Consider using webhooks for real-time updates when available

## 7. Integration Patterns for MCP Servers

When developing MCP (Model Context Protocol) servers for Security Scorecard integration, consider these patterns:

### 7.1. Resource-Based Organization

Organize your MCP server resources around Security Scorecard entities:

- `scorecard://{domain}` - Company scorecard information
- `findings://{domain}/{type}` - Specific finding types for a domain
- `portfolio://{portfolio_id}` - Portfolio-level information
- `assets://{domain}/ips` - IP assets for a domain
- `assets://{domain}/domains` - Domain assets for a company

### 7.2. Tool Implementation Patterns

Implement MCP tools that correspond to common Security Scorecard operations:

- `get_company_score` - Retrieve overall company score and grade
- `list_findings_by_severity` - Get findings filtered by severity level
- `get_domain_risk` - Get risk assessment for a specific domain
- `search_findings_by_ip` - Find all findings associated with an IP
- `get_portfolio_summary` - Retrieve portfolio-level metrics

### 7.3. Prompt Templates

Provide prompt templates that help users interact with Security Scorecard data effectively:

- Risk assessment summaries
- Finding prioritization recommendations
- Compliance reporting templates
- Remediation guidance based on finding types

This comprehensive API reference provides all the necessary information for developing robust integrations with the Security Scorecard platform, with particular emphasis on the filtering and domain/IP-specific capabilities that organizations need for effective security management.

