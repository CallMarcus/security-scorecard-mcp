Rate Limits
===========

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities;

Our API enforces rate limits to ensure system stability and prevent abuse. These limits control the number of requests that can be made within a given time frame.

General Limits

[](#general-limits)
-------------------------------------

Each client can make up to **5,000 requests per hour**. This limit is applied dynamically over a rolling 60-minute window.

If you exceed this limit, you will receive a `429 Too Many Requests` response and must wait before sending additional requests.

Handling Rate Limit Responses

[](#handling-rate-limit-responses)
-------------------------------------------------------------------

If your application surpasses the allowed request rate, the API will respond with:

*   **HTTP Status Code:** `429 Too Many Requests`
*   **[Retry-After Header:](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)** Specifies the number of seconds to wait before making another request.

It is essential to handle these responses properly to prevent disruptions in your integration.

Best Practices for Efficient API Usage

[](#best-practices-for-efficient-api-usage)
-------------------------------------------------------------------------------------

To ensure smooth operation within the rate limits, follow these recommendations:

*   **Optimize request frequency.** Avoid unnecessary API calls and batch operations when possible.
*   **Respect the`Retry-After` header.** If you receive a `429 Too Many Requests` response, wait for the specified time before retrying.
*   **Reduce excessive polling.** Check the endpoint documentation for recommended update intervals instead of making frequent requests.
*   **Implement exponential backoff.** If you hit the rate limit, increase the wait time progressively before attempting another request.

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