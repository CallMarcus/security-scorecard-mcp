**SecurityScorecard REST API Reference (20250725)**

This reference summarises the major endpoints exposed by the **SecurityScorecard** REST API. It is based on the public documentation provided at securityscorecard.readme.io. The API uses JSON over **HTTPS**, is versioned using semantic versioning and requires an API token for authentication.

**1 Authentication & general requirements**

-   **Base URL:** https://api.securityscorecard.io (customerfacing REST API). Use **HTTPS** only – HTTP requests are rejected[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/http-api-requirements#:~:text=).
-   **API token:** Generate a token in the **My Settings → API** tab on the SecurityScorecard platform and include it in requests using the Authorization header. The quickstart guide explains that tokens are created by clicking *Generate New API Token* in the portal and then using the header Authorization: Token \<yourtoken\> in API requests[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/quickstart#:~:text=Quickstart%20)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/quickstart#:~:text=Step%202%3A%20Make%20your%20first,Request%20using%20our%20API%20Reference). Tokens don’t expire but can be regenerated.
-   **Content format:** Requests and responses use JSON (ContentType: application/json) unless a specific endpoint states otherwise[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/http-api-requirements#:~:text=).

**2 Pagination, rate limits and errors**

-   **Pagination:** Many list endpoints accept a page and size query parameter or cursorbased pagination. Paginated responses include entries (list of results), total, size and page fields[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=When%20a%20request%20returns%20a,response%20structure%20is%20as%20follows). Cursorbased pages return next_cursor; use this value as the cursor parameter in the next request[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=Detecting%20the%20End%20of%20the,Collection). Page size may be up to 50 and you should not alter query values returned in responses[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=Best%20Practices).
-   **Rate limits:** Clients are limited to **5 000 requests per hour**. If the limit is exceeded the API returns 429 Too Many Requests. Honour the RetryAfter header, reduce polling and implement exponential backoff[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/rate-limits#:~:text=Rate%20Limits).
-   **Error responses:** 4xx status codes indicate client errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 413 Payload Too Large, 422 Unprocessable Entity, 429 Too Many Requests). 5xx codes indicate server errors (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=Content%20Errors)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=Server%20errors%20occur%20when%20there,return%20a%205xx%20status%20code). Retry server errors or check the status page.
-   **Backwards compatibility:** The API follows semantic versioning (major.minor.patch). Adding new optional parameters or response fields is considered backward compatible, whereas removing fields or changing data types is a breaking change. Deprecated endpoints will be announced and given a sunset period[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/backwards-compatibility#:~:text=new%20major%20version%20indicates%20breaking,that%20are%20not%20backward%20compatible).

**3 Portfolio management**

Portfolios group companies for monitoring. Operations follow REST patterns:

-   **List portfolios:** GET /portfolios – returns portfolios the caller has access to[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_portfolios#:~:text=Get%20all%20portfolios%20you%20have,access%20to).
-   **Create portfolio:** POST /portfolios – create a new portfolio[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/post_portfolios#:~:text=Create%20a%20new%20portfolio).
-   **Edit portfolio:** PUT /portfolios/{portfolio_id} – update a portfolio’s name or description[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/put_portfolios-portfolio-id#:~:text=Edit%20a%20portfolio).
-   **Delete portfolio:** DELETE /portfolios/{portfolio_id} – remove a portfolio.
-   **List companies in portfolio:** GET /portfolios/{portfolio_id}/companies – returns company scorecards contained in the portfolio[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_portfolios-portfolio-id-companies#:~:text=Get%20all%20companies%20in%20a,portfolio).
-   **Add companies:** PUT /portfolios/{portfolio_id}/companies – add one or more domains to a portfolio. PUT /portfolios/{portfolio_id}/companies/bulk supports bulk additions. The domain or list of domains is provided in the request body.
-   **Remove companies:** DELETE /portfolios/{portfolio_id}/companies/{domain} – remove a company. To empty a portfolio use DELETE /portfolios/{portfolio_id}/companies.

Portfolios are also used in the **Bulk Data API** (Section 8) for specifying lists of domains.

**4 All Companies (New) – followed companies & vendor details**

These endpoints manage the list of companies your organisation follows and provide vendor details. They are sometimes labelled **All Companies [New]** in the docs.

-   **Find followed companies:** GET /companies/follow – returns the list of companies the user is following.
-   **Get followed company:** GET /companies/follow/{domain} – retrieve details for a specific followed company.
-   **Update followed company:** PATCH /companies/follow/{domain} – update metadata such as company display name.
-   **Bulk update companies:** POST /companies/follow/bulk – update multiple followed companies at once.
-   **Delete followed company:** DELETE /companies/follow/{domain} – unfollow a company; there is also a bulk delete variant.
-   **Notes:** GET /companies/{domain}/notes – list notes for a scorecard; POST /companies/{domain}/notes to create a note.

**5 Scorecard tags**

Tags allow you to group scorecards logically.

-   **List tags:** GET /scorecard-tags – return all tags.
-   **Create tag:** POST /scorecard-tags – create a new tag.
-   **Update tag:** PUT /scorecard-tags/{tag_id}.
-   **Delete tag:** DELETE /scorecard-tags/{tag_id}. A bulk delete endpoint accepts a list of IDs.
-   **Associate tag to a company:** POST /scorecards/{domain}/tags/{tag_id} – attach a tag to a company.
-   **Remove tag from company:** DELETE /scorecards/{domain}/tags/{tag_id}.
-   **Bulk tagging:** endpoints under POST /scorecards/tags/bulk assign or remove tags from lists of companies.
-   **Tag groups:** tags may be organised into groups via GET /scorecard-tag-groups, POST /scorecard-tag-groups, etc. Use POST /scorecard-tag-groups/{group_id}/tags/{tag_id} and DELETE for managing membership.

**6 IP & Domain tags**

SecurityScorecard offers tagging for IPs and domains to aid external attack surface management. The API exposes endpoints to list, create, update and delete tags and to assign tags to IPs/domains. Although not all pages are public, common patterns include:

-   GET /ip-domain-tags – list IP/domain tags.
-   POST /ip-domain-tags – create a tag.
-   PUT /ip-domain-tags/{tag_id} – update a tag.
-   DELETE /ip-domain-tags/{tag_id} – remove a tag.
-   POST /ip-domain-tags/{tag_id}/assets – assign the tag to a list of IPs/domains; the request body contains the list of assets.
-   DELETE /ip-domain-tags/{tag_id}/assets/{asset_id} – remove a tag from an asset.

These endpoints are used in the **External Attack Surface Management** section of the API.

**7 Scores and company information**

The **Scores** endpoints return overall scores, factor scores and history.

-   **Search companies in bulk:** POST /companies/search – submit an array of company identifiers and return score summaries.
-   **Get company summary:** GET /companies/{domain} – returns company information and scorecard summary (total score and grade)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-domain-products#:~:text=Get%20products%20by%20domain).
-   **Get detailed score info:** GET /companies/{domain}/summary – includes factor scores and issue counts.
-   **Get factor scores only:** GET /companies/{domain}/scores/factors – returns factors and issue counts.
-   **Get historical total scores:** GET /companies/{domain}/scores/history – returns the company’s score over time.
-   **Get historical factor scores:** GET /companies/{domain}/scores/history/factors – returns factor scores over time.
-   **Get expanded risk:** GET /companies/{domain}/risk – returns detailed risk metrics.
-   **Get score plan by target:** GET /scores/plan/{target} – returns recommended improvements to reach a target grade.
-   **Industry scores:** GET /industry/{industry_id}/scores – returns average score and grade for an industry. Historical and factorlevel endpoints exist.

**8 Event logs**

-   GET /companies/{scorecard_identifier}/history/events – return a company’s historical security events (e.g., breaches). Another endpoint returns only breach events.

**9 Active findings & historical findings**

The API exposes a large number of endpoints to retrieve security findings for a company. Each finding type corresponds to a specific issue (e.g., **general_scan_detected**, **microsoft_exchange_0_day_vulnerability**, **phishing_domain**, etc.). **Active Findings** return current issues, while **Historical Findings** return past issues. Rather than list each of the hundreds of issuespecific endpoints, note the pattern:

-   **Active findings:** GET /companies/{scorecard_identifier}/issues/{issue_type} – returns active issues of the specified type within the company. A score_context endpoint provides context for an issue type across companies. The introduction page lists every supported issue_type (grouped into General, Vulnerability & Exploitation, Malware & Botnets, Network Security & Infrastructure, Network Service, Web Security, Data Security & Privacy, Email Security, System Configuration & Patching, Threat Intelligence & Actors categories)【692982889926256†L321-L504】.
-   **Historical findings:** GET /companies/{scorecard_identifier}/history/issues/{issue_type} – returns the history of issues of the specified type. The same issue_type categories apply.

These endpoints accept pagination parameters and may support filters such as severity or timeframe.

**10 Custom scorecards**

Custom scorecards allow organisations to create their own rating models and share them with portfolios.

-   GET /custom-scorecards – list custom scorecards.
-   POST /custom-scorecards – create a custom scorecard.
-   PUT /custom-scorecards/{custom_scorecard_id} – update the scorecard (e.g., weight factors, thresholds).
-   PATCH /custom-scorecards/{custom_scorecard_id}/filters – modify filters used to include issues.
-   PATCH /custom-scorecards/{custom_scorecard_id}/sources – update sources (e.g., IPv4/IPv6 networks, domains).
-   PUT /custom-scorecards/{custom_scorecard_id}/portfolios/{portfolio_id} – assign a custom scorecard to a portfolio.
-   DELETE /custom-scorecards/{custom_scorecard_id} – delete a custom scorecard.

**11 Vendor detection (supply chain)\*\***

SecurityScorecard’s **Vendor Detection** API helps identify third and fourthparty vendors and products connected to a company’s domain and calculate supply chain risk.

| **Endpoint**                         | **Method & path**                              | **Purpose**                                                                                                                                                                                                                                                     |
|--------------------------------------|------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Thirdparty vendors by portfolio**  | GET /vendor-detection/portfolios/{portfolioId} | List thirdparty vendors used by all companies in the specified portfolio[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-portfolios-portfolioid#:~:text=get%20https%3A%2F%2Fapi.securityscorecard.io%2Fvendor). |
| **Thirdparty vendors by domain**     | GET /vendor-detection/{domain}/third-party     | Return thirdparty vendors connected to a domain[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-domain-third-party#:~:text=Get%20third%20party%20vendors%20by,domain).                                          |
| **Fourthparty vendors by domain**    | GET /vendor-detection/{domain}/fourth-party    | List fourthparty vendors connected to a domain[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-domain-fourth-party#:~:text=Get%20fourth%20party%20vendors%20by,domain).                                         |
| **Products by domain**               | GET /vendor-detection/{domain}/products        | List products used by a domain[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-domain-products#:~:text=Get%20products%20by%20domain).                                                                           |
| **Supplychain risk score by domain** | GET /vendor-detection/{domain}/risk            | Return the supply chain risk score for a domain[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_vendor-detection-domain-risk#:~:text=Get%20risk%20score%20by%20domain).                                                          |

These endpoints help map vendor relationships and risk for third and fourthparty suppliers.

**12 Reports**

The API can generate and download PDF or CSV reports. Key operations include:

-   **List generated reports:** GET /reports – returns previously generated reports with metadata.
-   **Download report:** GET /reports/{report_id}/download – returns the generated file (PDF or CSV). Some endpoints allow specifying file type.
-   **Generate portfolio report:** POST /reports/portfolio – generate a report for a portfolio. Provide portfolio_id and report type (e.g., security rating, vendor detection). Use PUT or PATCH for advanced options.
-   **Generate company events report:** POST /reports/company-events – generates a report summarising event logs for a company.
-   **Generate company detailed report:** POST /reports/company-detailed – produce a detailed PDF report for a company (scorecard, factors, issues).
-   **Generate factor analysis report:** POST /reports/factor – generate a report focusing on specific factors for a company or portfolio.

These operations return a report ID that can be polled or downloaded.

**13 Security management & alerts**

This section manages compliance frameworks, invites, feedback and alerts.

-   **Compliance frameworks:** GET /security-management/frameworks lists available compliance frameworks (e.g., ISO 27001). POST /security-management/frameworks/{framework_id}/evaluate triggers evaluation.
-   **Invitations:** GET /invitations – list invitations sent to third parties to join the platform. POST /invitations – send an invitation to a vendor. POST /invitations/{invitation_id}/resend – resend, and DELETE to revoke.
-   **Feedback:** POST /companies/{domain}/feedback/{issue_type} – allow vendors to provide evidence disputing an issue.
-   **Alerts:** GET /alerts – list alert rules; POST /alerts create a rule; PATCH /alerts/{alert_id} update; DELETE /alerts/{alert_id} delete. Alerts are triggered when factors or scores change.

**14 Data & metadata**

SecurityScorecard exposes metadata about factors and issue types:

-   GET /factors – list rating factors (e.g., Application Security, DNS Health) with descriptions and weights.
-   GET /factors/{factor_id}/issue-types – list issue types contained within a factor.
-   GET /issue-types – list all issue types across the platform.
-   GET /companies/{domain}/issues – returns all active issues for a company across issue types.
-   GET /companies/{domain}/issues/historical – returns historical issues.
-   GET /attribution-log – returns a log of ownership attribution events for assets.

**15 Integrations & automation**

Integration endpoints support single signon and marketplace applications:

-   **SAML/SSO metadata:** GET /saml/metadata returns the SAML metadata XML to configure your identity provider. A POST /saml/acs endpoint processes SAML assertions.
-   **Apps:** GET /apps lists marketplace apps. POST /apps registers a new app. GET /apps/{app_id}/events returns app events. Endpoints also exist for managing app installations, updating app details and retrieving app signals or actions.

**16 Action plans**

Action plans allow organisations to track remediation efforts for issues.

-   GET /action-plans – list improvement plans.
-   POST /action-plans – create a new action plan.
-   PATCH /action-plans/{plan_id} – update the plan (e.g., mark tasks complete).
-   POST /action-plans/{plan_id}/guests – add guests to view the plan; DELETE /action-plans/{plan_id}/guests/{guest_id} remove them.
-   POST /action-plans/{plan_id}/archive – archive a plan; POST /action-plans/{plan_id}/unarchive to restore.

**17 External Attack Surface Management**

This suite of endpoints exposes attack surface assets (IP addresses, domains, hostnames) discovered by SecurityScorecard. Common patterns include:

-   GET /esi/assets – list all assets associated with your organisation. Supports filters by asset type, severity, status, and tags.
-   GET /esi/assets/{asset_id} – retrieve details about a specific asset (open ports, services, vulnerabilities).
-   GET /esi/assets/{asset_id}/issues – list issues detected on the asset.
-   POST /esi/assets/{asset_id}/acknowledge – acknowledge an asset or issue.
-   POST /esi/tags and DELETE /esi/tags/{tag_id} – manage tags (similar to IP & Domain tags).

**18 Attack Surface Intelligence (ASI) API**

ASI provides searchable threatintelligence data sets.

-   **Search:** POST /asi/search – supply search criteria (e.g., domain, IP, organisation name) to find related assets and exposures.
-   **Facets:** POST /asi/facets – returns aggregated counts for categories such as asset types, vulnerabilities or technologies used.
-   **Details endpoints:**
    -   GET /asi/details/asset/{asset_id} – returns details of an asset (domain, IP or certificate).
    -   GET /asi/details/domain/{domain} – details for a domain.
    -   GET /asi/details/ip/{ip} – details for an IP address.
    -   GET /asi/details/network/{cidr} – details for a network block.
    -   GET /asi/details/org/{organisation_id} – details for an organisation.
-   **Dataset search:** POST /asi/dataset/search – search across available ASI datasets (e.g., vulnerabilities, certificates). Additional datasetspecific endpoints may exist.

**19 Bulk Data API**

For largescale exports (CSV or Parquet), SecurityScorecard offers a **Bulk Data API**, which is separate from the REST API. Data files are delivered via SFTP and require onboarding. Key points:

-   **Onboarding & projects:** Your organisation must be onboarded and given an SFTP account. Bulk data requests are associated with a **project name**, which SecurityScorecard sets up[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Accessing%20API%20Reference%20Documentation). Each request must include the project_name and a domain_source (either a portfolio ID or a previously uploaded CSV list of domains)[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Accessing%20API%20Reference%20Documentation)[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Portfolio%20as%20a%20source%3A).
-   **Endpoint types:** SecurityScorecard provides endpoints (OpenAPI spec available on request) to **request bulk data**, **get project configurations** (e.g., list available projects or domain lists) and **get run status**[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Accessing%20API%20Reference%20Documentation). The request includes your organisation’s domain in the URL path, an XOutputFormat header to choose CSV or Parquet, and an Authorization header with your API token[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Data%20output%20format).
-   **Response:** The bulk request does not immediately return the data. It returns a **run ID** and a pending_output_path. When processing is complete, the data file appears at that path on the SFTP server[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Because%20of%20the%20volume%20of,in%20Security%20Scorecard%27s%20SFTP%20server). Use the run ID with a status endpoint to monitor progress[securityscorecard.readme.io](https://securityscorecard.readme.io/docs/integrate-with-securityscorecard-bulk-api#:~:text=Because%20of%20the%20volume%20of,in%20Security%20Scorecard%27s%20SFTP%20server).

**20 MAX API (Beta)**

The **MAX** (Marketplace Administration Experience) API is in beta. It includes endpoints for SecurityScorecard customers and partners. Customers may list accounts, manage child accounts or view subscription usage. Partners may create, modify or terminate customer accounts. Because this API is subject to change, refer to the official documentation for details.

**21 Usage notes for LLMs**

When integrating this API into a MachineCurated Pipeline (MCP) using an LLM (e.g., ChatGPT Codex or Claude Code), consider the following:

1.  **Authentication:** Always include the Authorization header with a valid API token in requests. Avoid embedding tokens in code; use secure storage.
2.  **Rate limits & retry logic:** Implement logic to handle 429 responses and server errors by respecting RetryAfter and using exponential backoff[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/rate-limits#:~:text=Rate%20Limits).
3.  **Pagination:** Many endpoints return a limited number of items per call. LLMgenerated code should read the total or next_cursor fields and iterate until all pages are retrieved[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=When%20a%20request%20returns%20a,response%20structure%20is%20as%20follows)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/pagination#:~:text=Detecting%20the%20End%20of%20the,Collection).
4.  **Error handling:** Parse error responses and provide meaningful messages. For 4xx errors, verify request parameters; for 5xx errors, allow retries[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=Content%20Errors)[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/errors#:~:text=Server%20errors%20occur%20when%20there,return%20a%205xx%20status%20code).
5.  **Stability & versioning:** Because the API uses semantic versioning and can add new fields without breaking changes[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/backwards-compatibility#:~:text=new%20major%20version%20indicates%20breaking,that%20are%20not%20backward%20compatible), LLMgenerated code should ignore unknown fields and be resilient to additional JSON keys.

This reference provides a highlevel overview. The SecurityScorecard API exposes many additional endpoints (e.g., issuespecific findings, asset acknowledgement, partner management). Refer to the official documentation for uptodate details and parameters.

**22 Identifying related domains and missing SPF records**

When an organisation owns hundreds of attributed domains, you may need to identify which of those domains lack an SPF record (an **Email Security** issue). The API supports this workflow through a twostep process:

1.  **List all attributed domains.** Use the parentdomain asset endpoint to retrieve every domain linked to the organisation’s primary domain. Call:

bash

CopyEdit

POST /parent-domains/{parentDomain}/domains

For example, to list all domains attributed to contoso.com you would call POST …/parent-domains/contoso.com/domains[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/postbyparentdomainassetsdomains#:~:text=Get%20all%20the%20domains%20for,the%20parent%20domain). The response is a paginated list of domains associated with the parent domain.

2.  **Query the “SPF record missing” issue for each domain.** Iterate over the list returned in step 1 and call the issuespecific endpoint for each domain:

bash

CopyEdit

GET /companies/{domain}/issues/spf_record_missing

This endpoint returns the active **spf_record_missing** findings for the specified domain[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_companies-scorecard-identifier-issues-spf-record-missing-1#:~:text=Get%20,scorecard). A nonempty entries array means that the domain lacks an SPF record. To see how each finding affects the overall score, you can also call GET /companies/{domain}/issue-context/spf_record_missing[securityscorecard.readme.io](https://securityscorecard.readme.io/reference/get_companies-domain-issue-context-issue-type#:~:text=Get%20the%20score%20context%20for,an%20issue%20type).

3.  **Aggregate results and remediate.** Collect the domains where the SPFmissing endpoint returns findings to build a remediation list. Because SPF issues are part of the Email Security factor, addressing them will improve the company’s score and reduce the risk of email spoofing.

This approach scales to organisations with hundreds of domains by programmatically enumerating the assets and checking them for specific issues.
