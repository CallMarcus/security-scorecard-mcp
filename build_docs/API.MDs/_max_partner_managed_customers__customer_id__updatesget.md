/max/partner/managed-customers/{customer\_id}/updates
=====================================================

get https://api.securityscorecard.io/max/partner/managed-customers/{customer\_id}/updates

Get updates for a managed customer

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

customer\_id

uuid

required

Customer identifier

Query Params

search

string

Search updates by providing a JSON string that represents an array of objects; each object should include “id” for the field to search, “type” for the matching operator (e.g., “like” or “eq”), and “value” as an array of values to compare.

sort

string

Sort updates by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

filter

string

Filter updates by providing a JSON string that represents an array of objects; each object should include “id” for the field to filter, “type” for the operator (e.g., “like” or “eq”), and “value” as an array of values to compare.

Headers

version

string

API version header

Responses

200

Successfull response with list of customers updates with their associated shared documents


===================================================================================================

Response body

object

entries

array of objects

required

A list of customer updates with their associated shared documents for the current customer

entries\*

object

id

string

required

Identifier

date

date-time

required

summary

string

required

summary of the customer update

featured

boolean

required

is it featured update

link

string

required

source URL

created\_by

string

required

user who created the update

total

integer

required

The total number of records matching the given query

400

Bad Request


====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 400

401

Unauthorized


=====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 401

403

Forbidden


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 403

404

Not Found


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 404

429

Too Many Requests


==========================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 429

Updated 1 day ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-managed-customers-customer-id-updates)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers/customer\_id/updates \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No