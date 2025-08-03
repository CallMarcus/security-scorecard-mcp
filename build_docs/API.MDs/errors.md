Errors
======

Errors you can expect and how to perform error handling.

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities;

HTTP Errors

[](#http-errors)
===============================

Even when an API call fails, error details are available in the HTTP response.

From an HTTP perspective, errors fall into three main categories:

*   [Content errors](#content-errors): Issues with the request sent by the client.
*   [Network errors](#network-errors): Communication problems between the client and the server.
*   [Server errors](#server-errors): Internal issues on the API server.

Each type of error requires a different handling approach.

  

Content Errors

[](#content-errors)
-------------------------------------

Content errors occur when the request contains invalid data. They return a 4xx status code.

Examples of content errors include:

HTTP Status

Cause

Solution(s)

400 - Bad Request

the request you sent is invalid or has a format error.

check error message to get more details on where is the problem, review the documentation for the endpoint you're trying to use to check you're sending the right values.

401 - Unauthorized

Authentication is required but API key is missing, was revoked, or the associated user or organization were disabled.

Ensure you're sending an http header "Authorization" with an API key as "Token ". API keys never expire but it could be revoked by an administrator or by generating a new one.  
Verify the error message to find more details.

403 - Forbidden

The authenticated user (associated to the API key) doesn't have enough permissions to perform the requested operation.  
This could also indicate API access is not enabled for your account.

Verify the error message to find more details. Verify the user associated to the API has access to the resource, has an access level that allows the requested operation, the resource belongs to your Organization, or that the feature you're trying to access is enabled for your account.

404 - Not Found

The resource you're trying to access was not found.

Verify the url you're using is matching the endpoint documentation.  
Verify the resource id is valid and the resource wasn't deleted by you or other user in your Organization.  
Note: sometimes a 404 is used when a resource exists but belongs to another Organization for security reasons.

405 - Method Not Allowed

Error occurs when the HTTP method used in the request (such as GET, POST, PUT, DELETE) is not supported by the resource or endpoint. This could happen if the wrong method is used for a particular action or if the server doesn't support that method for the requested URL.

Check the API documentation to confirm which methods are allowed for the specific resource, and use the appropriate HTTP method.

409 - Conflict

Error occurs when a request cannot be completed due to a conflict with the current state of the resource. This often happens in scenarios like version control issues, duplicate entries, or concurrent updates.

Review the request data and ensure it aligns with the server's expected state. If applicable, refresh the resource, resolve any conflicting changes, and try again.

413 - Payload Too Large

Error occurs when the request payload (body of the request) exceeds the server's size limit. This often happens when uploading large files or sending a large amount of data in the request.

Reduce the size of the data you're sending or split it into smaller parts. If you're uploading a file, consider compressing it or checking if there are any size limitations set by the server.

422 - Unprocessable Entity

The server understands your request but cannot process it because the data is invalid. This usually happens when required fields are missing, the format is incorrect, or the data does not meet the server’s validation rules.

Ensure all necessary fields are included, verify that the data follows the expected format, and check the server's response for details on what needs to be corrected.

429 - Too Many Requests

You (or your Organization's users) have performed too many requests in recent period of time.

Reduce the rate of requests made by your application,  
use the "Retry-After" to automatically retry when appropriate, see [Rate Limits](/reference/rate-limits) for more details.

  

Network Errors

[](#network-errors)
-------------------------------------

Network errors occur due to connectivity issues between the client and the server.

Examples include:

*   Timeout while connecting to the server.
*   Connection interrupted before receiving a response.
*   Temporary issues in the network infrastructure.

**How to Handle Network Errors**

*   Ensure your network is functioning properly before retrying.
*   Check if the API is experiencing temporary issues.
*   Refer to the documentation for best practices on handling network failures.

  

Server Errors

[](#server-errors)
-----------------------------------

Server errors occur when there is an internal issue with the API. They return a 5xx status code.

Examples of server errors include:

HTTP Status

Cause

Solution(s)

500 - Internal Server Error

The server encounters an unexpected issue that prevents it from fulfilling the request. This can be caused by a bug in the server's code, a database failure, or a misconfiguration.

These are rare, but integration builders can perform retries with exponential backoff.  
Check our [status page](https://status.securityscorecard.com/) for incident reports.  
Contact [support@securityscorecard.io](mailto:support@securityscorecard.io) for more help.

502 - Bad Gateway

Error occurs when a server acting as a gateway or proxy receives an invalid response from an upstream server. This can happen due to server overload, network issues, or misconfigured backend services.

These are rare, but integration builders can perform retries with exponential backoff.  
Check our [status page](https://status.securityscorecard.com/) for incident reports.  
Contact [support@securityscorecard.io](mailto:support@securityscorecard.io) for more help.

503 - Service Temporarily Unavailable

Error occurs when the server is unable to handle the request, usually due to maintenance or temporary overload. This means the service is down but expected to be available again soon.

These are rare, but integration builders can perform retries with exponential backoff.  
Check our [status page](https://status.securityscorecard.com/) for incident reports.  
Contact [support@securityscorecard.io](mailto:support@securityscorecard.io) for more help.

504 - Gateway Time-out

Error occurs when a server, acting as a gateway or proxy, doesn't receive a timely response from an upstream server. This can happen due to network issues, server overload, or long processing times.

These are rare, but integration builders can perform retries with exponential backoff.  
Check our [status page](https://status.securityscorecard.com/) for incident reports.  
Contact [support@securityscorecard.io](mailto:support@securityscorecard.io) for more help.

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