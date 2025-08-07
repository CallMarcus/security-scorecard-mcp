Pagination
==========

how to navigate large collections that expand multiple pages

/\*! tailwindcss v4.1.6 | MIT License | https://tailwindcss.com \*/ @layer theme, base, components, utilities; @layer utilities;

Introduction

[](#introduction)
=================================

Some API responses may contain a large number of items. To efficiently handle this, the API uses a pagination system based on the page and size parameters or cursors for more efficient pagination.

  

Link Response Structure

[](#link-response-structure)
=======================================================

Requests that this list entries in a collection can require pagination to navigate a large number of entries.  
When a request support pagination it will respond with a [Link](https://datatracker.ietf.org/doc/html/rfc5988) http header.

This header includes a link to "next" page of entries, unless on the last page (use this to determine the end of the collection).

`Link: <https://api.securityscorecard.io/companies/example.com/...>; rel="next"`

In some cases when a collection exceeds a certain size, we'll offer instead a report to asynchronously generate a dump of the entire collection.

An example of this is to [Generate a Full Scorecard report](/reference/post_reports-full-scorecard-json-1) to dump all issue findings on a scorecard.

* * *

  

Paginated Response Structure

[](#paginated-response-structure)
=================================================================

When a request returns a collection of paginated items, the response structure is as follows:

JSON

`   {   "entries": [     // List of items on the current page   ],   "total": 1000,  // Total number of items in the collection   "size": 50,     // Number of items per page (default: 50, maximum: 50)   "page": 1       // Current page number }   `

How to Navigate Pages

[](#how-to-navigate-pages)
===================================================

To iterate through the entire collection, make requests by incrementing the `page` number until all items have been retrieved.

### 

Requesting the First Page

[](#requesting-the-first-page)

`GET /resource?size=50&page=1`

**Example with cURL**

`curl -X GET "https://api.example.com/resource?size=50&page=1" -H "Authorization: Token YOUR_API_KEY"`

**API Response Example**

JSON

`   {   "entries": [     { "id": 1, "name": "Item 1" },     { "id": 2, "name": "Item 2" }   ],   "total": 1000,   "size": 50,   "page": 1 }   `

### 

Requesting the Next Page

[](#requesting-the-next-page)

To get the next page, increment the `page` value.

`GET /resource?size=50&page=2`

**Example with cURL**

`curl -X GET "https://api.securityscorecard.io/resource?size=50&page=2" -H "Authorization: Token YOUR_API_KEY"`

### 

Detecting the End of the Collection

[](#detecting-the-end-of-the-collection)

Keep paginating until `page * size` is greater than or equal to `total`. If `entries` is empty, it means you have reached the end of the collection.

* * *

  

Cursor-Based Pagination

[](#cursor-based-pagination)
=======================================================

For large collections, the API may use `cursors` instead of `page` and `size`, allowing for more efficient pagination and preventing skipped items.

### 

Cursor-Based Response Structure

[](#cursor-based-response-structure)

JSON

`   {   "entries": [     { "id": "abc123", "name": "Item 1" },     { "id": "def456", "name": "Item 2" }   ],   "next_cursor": "ghi789" }   `

### 

Requesting the First Page with Cursors

[](#requesting-the-first-page-with-cursors)

`GET /resource?limit=50`

**Example with cURL**

`curl -X GET "https://api.securityscorecard.io/resource?limit=50" -H "Authorization: Token YOUR_API_KEY"`

### 

Requesting the Next Page with Cursors

[](#requesting-the-next-page-with-cursors)

To get the next page, use the `next_cursor` returned in the previous response.

`GET /resource?limit=50&cursor=ghi789`

**Example with cURL**

`curl -X GET "https://api.securityscorecard.io/resource?limit=50&cursor=ghi789" -H "Authorization: Token YOUR_API_KEY"`

If `next_cursor` is not present in the response, it means you have reached the end of the collection.

* * *

  

Handling Large Data Volumes

[](#handling-large-data-volumes)
===============================================================

If the collection exceeds a certain size limit, the API may provide an alternative mechanism, such as generating a full report for asynchronous download.

### 

Generating a Full Report Example

[](#generating-a-full-report-example)

`POST /reports/full-dump`

**Example with cURL**

`curl -X POST "https://api.securityscorecard.io/reports/full-dump" -H "Authorization: Token YOUR_API_KEY"`

**Response Example**

JSON

`   {   "report_url": "https://api.securityscorecard.io/reports/12345/download",   "status": "processing" }   `

Once generated, you can download the report from `report_url`.

  

Best Practices

[](#best-practices)
=====================================

*   **Always use the values returned in the response** to determine if more pages are available.
*   **Avoid manually constructing pagination URLs.** Instead, always use the `next_cursor` provided in the response for cursor-based pagination or increment the `page` parameter for page-based pagination. This ensures compatibility with any future API changes and prevents data inconsistencies.
*   **Set an appropriate page size** (`size`, default is 50, maximum is 50) to balance performance and resource consumption.
*   **Prefer cursor-based pagination for large lists** to improve efficiency and prevent inconsistencies.

By following this guide, you can efficiently handle API pagination and optimize data loading in your application.

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