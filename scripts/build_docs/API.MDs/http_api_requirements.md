HTTP API Requirements
=====================

This section outlines the minimum requirements for using our HTTP API.

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities;

HTTPS Requirements

[](#https-requirements)
---------------------------------------------

All API endpoints require HTTPS for secure communication. Supported TLS versions include TLS 1.3 and TLS 1.2. Requests over HTTP will be rejected.

  

**Example: Valid HTTPS request**

Bash

`   curl -X GET "https://api.securityscorecard.io/companies/google.com" -H "Authorization: Token YOUR_ACCESS_TOKEN"   `

  

**Invalid request (HTTP not allowed)**

Bash

`   curl -X GET "http://api.securityscorecard.io/companies/google.com" -H "Authorization: Token YOUR_ACCESS_TOKEN"   `

  

JSON Format

[](#json-format)
-------------------------------

Request and response bodies must use JSON (`Content-Type: application/json`), unless otherwise specified in the API reference. Some endpoints may return other formats, such as CSV or PDF, when explicitly stated.

  

**Example: Sending a JSON request**

Bash

`   curl -X POST "https://api.securityscorecard.io/portfolios" \   -H "Content-Type: application/json" \   -H "Authorization: Token YOUR_ACCESS_TOKEN" \   -d '{ "name": "test", "description": "test", "privacy": "private", "team_id": "test"}'   `

**Example: JSON response**

JSON

`   {   "id": 123,   "name": "example",   "description": "example",   "privacy": "private" }   `

  

Exceptions:

[](#exceptions)
------------------------------

Some endpoints may return other formats, such as CSV or PDF.

**Example: Retrieving a CSV file**

Bash

`   curl -X GET "https://api.securityscorecard.io/reports/files/{file_path}" -H "Authorization: Token YOUR_ACCESS_TOKEN"   `

_Response Headers:_

pgsql

`   Content-Type: text/csv Content-Disposition: attachment; filename="export.csv"   `

Updated about 2 months ago

* * *

Did this page help you?

Yes

No

Updated about 2 months ago

* * *

Did this page help you?

Yes

No