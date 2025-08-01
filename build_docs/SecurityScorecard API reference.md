**SecurityScorecard API reference**

This document summarises the publicly documented **SecurityScorecard API** at <https://api.securityscorecard.io>. It is intended for programmatic use (for example by a ChatGPT-based coding assistant) and flattens the multilayered ReadMe documentation into a concise reference. It is not officially affiliated with SecurityScorecard. The API allows customers to manage portfolios, tag scorecards and assets, view scores, and retrieve risk findings.

**Base URL and versioning**

-   **Base URL** – all endpoints are under https://api.securityscorecard.io. Different services are divided into major versions (e.g., /v1, /v2) and the service tries to remain backwards compatible; nonbreaking changes (new endpoints or response fields) do not increment the major version[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/backwards-compatibility#:~:text=How%20We%20Version%20Our%20API). A header AcceptsVersion can be used to request a specific minor version when the endpoint supports it[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/backwards-compatibility#:~:text=How%20We%20Version%20Our%20API).
-   **HTTPS only** – requests must use TLS 1.2 or higher; the platform rejects plain HTTP[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/http-api-requirements#:~:text=HTTP%20API%20Requirements).
-   **Content type** – request and response bodies are JSON encoded. Some endpoints can return CSV or PDF if the Accept header is changed[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/http-api-requirements#:~:text=HTTP%20API%20Requirements). Provide ContentType: application/json on requests with a body.

**Authentication**

1.  Obtain an API token – log into SecurityScorecard, go to **My Settings** → **API Tokens** and generate a token. API access is not available for free accounts[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/quickstart#:~:text=Step%201%3A%20Generate%20your%20API,Key).
2.  **Authenticate each call** by including the header Authorization: Token \<YOUR_API_TOKEN\>[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/quickstart#:~:text=Step%201%3A%20Generate%20your%20API,Key).

**Rate limits & pagination**

-   **Rate limit** – clients can make up to **5 000 requests per hour**, measured with a rolling 60minute window. If exceeded, the API returns HTTP 429 with a RetryAfter header telling when to retry[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/rate-limits#:~:text=Rate%20Limits). Use caching and exponential backoff to avoid hitting the limit.
-   **Pagination** – list endpoints either use pagebased or cursorbased pagination. A Link header containing rel="next" gives the URL for the next page. Pagebased responses include fields entries, total, size and page. Cursorbased responses include entries and next_cursor[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=Pagination). Clients must **not** construct nextpage URLs manually but use the provided link or cursor.

**Error handling**

The API follows conventional HTTP status codes. Common codes include:

| **Code** | **Meaning & notes**                                                                     | **Citation**                                                                                       |
|----------|-----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **200**  | Request succeeded. For create/update endpoints it returns the created/updated resource. |                                                                                                    |
| **204**  | No content – request processed successfully but no body is returned (e.g., deletion).   | securityscorecard.readme.io                                                                        |
| **400**  | Bad request – parameters invalid or missing.                                            | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **401**  | Unauthorized – API key missing or invalid.                                              | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **403**  | Forbidden – user lacks permission, e.g., the company is not in your portfolio.          | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **404**  | Resource not found (wrong ID or domain).                                                | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **409**  | Conflict – resource already exists.                                                     | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **413**  | Payload too large.                                                                      | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **422**  | Unprocessable entity (semantic errors).                                                 | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **429**  | Too many requests – wait and retry as indicated by the RetryAfter header.               | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |
| **5xx**  | Server errors. Retry or contact support.                                                | [securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=400%20) |

**Portfolio management**

Portfolios let customers organise vendors or subsidiaries. All endpoints require the portfolio ID and assume the caller has write access.

**List portfolios**

| **Method** | **Endpoint** | **Description**                              | **Response**                                           |
|------------|--------------|----------------------------------------------|--------------------------------------------------------|
| GET        | /portfolios  | Lists all portfolios accessible to the user. | Array of portfolio objectssecurityscorecard.readme.io. |

**Create/edit/delete portfolio**

| **Method** | **Endpoint**               | **Key parameters**                                                                                                                                                      | **Notes**                                                                     | **Citation** |
|------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|--------------|
| POST       | /portfolios                | Body: name *(string, required)* – portfolio name; description *(string)*; privacy *(string)* – privacy setting (private, shared or team); team_id *(string, optional)*. | Creates a new portfoliosecurityscorecard.readme.io.                           |              |
| PUT        | /portfolios/{portfolio_id} | Path: portfolio_id *(string)*; body: name (required), description, privacy.                                                                                             | Updates portfolio metadatasecurityscorecard.readme.io.                        |              |
| DELETE     | /portfolios/{portfolio_id} | Path: portfolio_id.                                                                                                                                                     | Deletes the portfolio, returning 204 (No Content)securityscorecard.readme.io. |              |

**Manage portfolio companies**

| **Action**                    | **Method & endpoint**                                | **Parameters & description**                                                                                                                                                                                                                       | **Citation**                |
|-------------------------------|------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| **List companies**            | GET /portfolios/{portfolio_id}/companies             | Path portfolio_id. Query parameters can filter by grade, industry, vulnerability (CVE), issue_type, status and had_breach_within_last_dayssecurityscorecard.readme.io.                                                                             | securityscorecard.readme.io |
| **List expanded risk events** | GET /portfolios/{portfolio_id}/expanded-risk         | Path portfolio_id. Optional query: category, confidence, page, limit. Requires ESG subscriptionsecurityscorecard.readme.io.                                                                                                                        | securityscorecard.readme.io |
| **Add company**               | PUT /portfolios/{portfolio_id}/companies/{domain}    | Adds a company to a portfolio. Path parameters: portfolio_id, domain (company’s primary domain)securityscorecard.readme.io.                                                                                                                        | securityscorecard.readme.io |
| **Bulk add companies**        | PUT /portfolios/companies/bulkupload                 | Query param auth_mechanism (string). Body: portfolios (array of portfolio IDs, required), companies (array of domains, required), bulkInvite (bool, optional) invites vendors, tagType (string, optional)securityscorecard.readme.io. Returns 201. | securityscorecard.readme.io |
| **Remove all companies**      | DELETE /portfolios/{portfolio_id}/companies/all      | Removes every company from the portfolio (204 response)securityscorecard.readme.io.                                                                                                                                                                | securityscorecard.readme.io |
| **Remove a company**          | DELETE /portfolios/{portfolio_id}/companies/{domain} | Removes a single domain from the portfolio (204 response)securityscorecard.readme.io.                                                                                                                                                              | securityscorecard.readme.io |

**All Companies (new) – Companies & vendor details**

This group provides search and CRUD operations on “followed” companies (vendors). Responses are paginated (page size 10–100, default 20).

**Search or list followed companies**

| **Method** | **Endpoint**   | **Important query parameters**                                                                                                                                                                                                                                                                                                                                                                                                                                                           | **Notes**                                       |
|------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| GET        | /all-companies | The endpoint is labelled “Find followed companies”. Query parameters include: domain, name, tags (array of tag IDs), tags_criteria (any / all), portfolios (array of portfolio IDs) with portfolios_criteria, monitored (boolean), business_impact, lifecycle_status, data_types_shared, risk, business_unit, date filters (contract_end_date_from, contract_end_date_to), internal_contact, sort, page (zerobased) and page_sizesecurityscorecard.readme.iosecurityscorecard.readme.io. | Returns a paginated list of followed companies. |

**Get a followed company by domain**

| **Method** | **Endpoint**           | **Parameters**                            | **Response**                                                                      |
|------------|------------------------|-------------------------------------------|-----------------------------------------------------------------------------------|
| GET        | /allcompanies/{domain} | Path parameter domain (company’s domain). | Returns a single followed company or 404 if not foundsecurityscorecard.readme.io. |

(Additional actions like updating or deleting a followed company exist but are not detailed here.)

**Scorecard tags**

Scorecard tags allow grouping vendors. Users can create tags, assign them to companies, and organise tags into tag groups. Tags have a privacy setting (public or shared) and can be managed individually or in bulk.

**Manage scorecard tags**

| **Action**           | **Method & path**                | **Parameters**                                                                                                                                      | **Notes**                                                                             | **Citation** |
|----------------------|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|--------------|
| **List tags**        | GET /scorecard-tags              | —                                                                                                                                                   | Returns all scorecard tagssecurityscorecard.readme.io.                                |              |
| **Create tag**       | POST /scorecard-tags             | Body: name (string, required), description (string).                                                                                                | Creates a tag and returns the tag objectsecurityscorecard.readme.io.                  |              |
| **Update tag**       | PUT /scorecard-tags/{id}         | Path param id. Body: id (string, unique identifier), name (required), description, privacy (string; defaults to shared)securityscorecard.readme.io. | Updates a tag.                                                                        |              |
| **Delete tag**       | DELETE /scorecard-tags/{id}      | Path id.                                                                                                                                            | Permanently removes a tag; response is 204securityscorecard.readme.io.                |              |
| **Bulk delete tags** | POST /scorecard-tags/bulk-delete | Body: ids (array of tag IDs, required), public_tags (boolean).                                                                                      | Deletes multiple tags in a single request and returns 204securityscorecard.readme.io. |              |

**Use tags on companies**

| **Action**                    | **Method & path**                              | **Parameters**                                                                                                                                           | **Notes**                                                                                  | **Citation** |
|-------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|--------------|
| **Get companies for a tag**   | GET /scorecard-tags/{id}/companies             | Path id (tag ID). Optional query parameters: grade, industry, vulnerability, issue_type, status, had_breach_within_last_dayssecurityscorecard.readme.io. | Returns companies associated with the tag.                                                 |              |
| **Add tag to a company**      | POST /scorecard-tags/{id}/companies/{domain}   | Path id (tag ID), domain (company domain).                                                                                                               | Adds a tag to a single company and returns the company summarysecurityscorecard.readme.io. |              |
| **Remove tag from a company** | DELETE /scorecard-tags/{id}/companies/{domain} | Path id, domain.                                                                                                                                         | Removes the tag; 204 response with no bodysecurityscorecard.readme.io.                     |              |

**Bulk tag operations**

| **Method & endpoint**                          | **Purpose & body**                                                                                                                                                        | **Citation** |
|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| POST /scorecard-tags/all-companies/bulk-create | Associates multiple tags with multiple followed companies. Body parameters: domains (array of company domains) and tag_ids (array of tag IDs)securityscorecard.readme.io. |              |
| POST /scorecard-tags/all-companies/bulk-delete | Removes multiple tags from multiple companies. Body: domains (array of domains) and tag_ids (array of tag IDs)securityscorecard.readme.io.                                |              |

**Scorecard tag groups**

Tag groups organise tags hierarchically. Endpoints allow listing, creating, updating and deleting tag groups. (Details follow a similar pattern as tag management and IP domain tag group management.)

**IP domain tags (External Attack Surface)**

IP domain tags categorise IP addresses or domains discovered through externalattacksurface scanning. Many endpoints mirror the scorecardtag model.

**Parentdomain asset listing**

| **Method** | **Endpoint**                           | **Parameters**                                                                                                     | **Description**                                                              | **Citation** |
|------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|--------------|
| POST       | /parent-domains/{parentDomain}/domains | Path parentDomain. Body: filters (array), sort (string), page (number, default 0), page_size (number, default 50). | Returns domains discovered for the parent domainsecurityscorecard.readme.io. |              |
| POST       | /parent-domains/{parentDomain}/ips     | Same body as above.                                                                                                | Returns IP addresses for the parent domainsecurityscorecard.readme.io.       |              |

**Manage IP domain tags**

| **Action**     | **Method & path**              | **Parameters**                                      | **Notes**                                                | **Citation** |
|----------------|--------------------------------|-----------------------------------------------------|----------------------------------------------------------|--------------|
| **List tags**  | GET /ip-domain-tags            | —                                                   | Returns all IP domain tagssecurityscorecard.readme.io.   |              |
| **Create tag** | POST /ip-domain-tags           | Body: tag (string, required), description (string). | Creates a tagsecurityscorecard.readme.io.                |              |
| **Update tag** | PUT /ip-domain-tags/{tagId}    | Path tagId. Body: tag and description.              | Updates tag name/descriptionsecurityscorecard.readme.io. |              |
| **Delete tag** | DELETE /ip-domain-tags/{tagId} | Path tagId.                                         | Removes the tag (204).                                   |              |

**IP domain tag groups**

These endpoints mirror scorecard tag groups. For example, GET /ip-domain-tag-groups returns all tag groupssecurityscorecard.readme.io. There are additional endpoints to create, update or delete a group.

**Scores**

The Scores API provides current and historical cybersecurity ratings for companies. Only major endpoints are covered here.

**Company score information**

| **Endpoint**                                                 | **Method** | **Parameters**                                                                                                             | **Description**                                                                                                                   | **Citation** |
|--------------------------------------------------------------|------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|--------------|
| /companies/{scorecard_identifier}                            | GET        | Path scorecard_identifier (UUID or domain). Query with_provisional_status (boolean) optionally returns provisional status. | Returns company information and the scorecard summary (overall grade, industry, plan expiration etc.)securityscorecard.readme.io. |              |
| /companies/{scorecard_identifier}/summary-factors            | GET        | Path scorecard_identifier; optional severity or severity_in to filter factor scores.                                       | Returns company summary, factor scores and issue countssecurityscorecard.readme.io.                                               |              |
| /companies/{scorecard_identifier}/factors                    | GET        | Path scorecard_identifier.                                                                                                 | Returns just factor scores and issue counts (not captured).                                                                       |              |
| /companies/{scorecard_identifier}/history/scores             | GET        | Path scorecard_identifier.                                                                                                 | Returns historical overall scores.                                                                                                |              |
| /companies/{scorecard_identifier}/history/factors            | GET        | —                                                                                                                          | Returns historical factor scores.                                                                                                 |              |
| /companies/{scorecard_identifier}/risk                       | GET        | —                                                                                                                          | Returns expanded risk details (requires subscription).                                                                            |              |
| /companies/{scorecard_identifier}/score-plans/{score_target} | GET        | Path score_target (desired letter grade).                                                                                  | Provides a plan to reach the target score.                                                                                        |              |

**Bulk search**

| **Endpoint**             | **Method** | **Body**                                                                        | **Purpose**                                                                         | **Citation** |
|--------------------------|------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------|
| /companies/bulk-searches | POST       | Body: searches (array of strings, required), maxSearches (int, default 100 000) | Searches multiple companies at once and returns resultssecurityscorecard.readme.io. |              |

**Industry scores**

Endpoints under Get Industry Scores provide aggregated scores by industry; they include get score for the industry, Get an industry’s historical scores, get factor scores for the industry and get historical factor scores for the industry. Each takes an industry slug and returns average scores over time.

**Event logs**

The **Event Logs** section exposes company breach histories.

| **Method** | **Endpoint**                                       | **Description**                                            |
|------------|----------------------------------------------------|------------------------------------------------------------|
| GET        | /companies/{scorecard_identifier}/history/events   | Returns all events (breaches) associated with the company. |
| GET        | /companies/{scorecard_identifier}/history/breaches | Returns only breachrelated events.                         |

**Active findings (Issuebased endpoints)**

The Active Findings API exposes security issues grouped by category and severity. There are dozens of endpoints that return issues of a specific type (e.g., general_scan_detected, malicious_scan_detected, typosquat, payment_provider, etc.). These endpoints accept a path parameter scorecard_identifier and often support query parameters for filtering by severity or date. Each returns a list of issues for that category. For brevity they are not enumerated here but follow the pattern:

http

GET /companies/{scorecard_identifier}/issues/{issue_type}

**Notes**

-   Many endpoints have additional optional fields or filtering criteria not exhaustively documented here. Refer to the official documentation for advanced use cases.
-   Some features (e.g., expanded risk, ESG risk events) require specific subscriptions and may return 403 if not enabled.
-   Always handle pagination, ratelimit backoff and error codes gracefully.
