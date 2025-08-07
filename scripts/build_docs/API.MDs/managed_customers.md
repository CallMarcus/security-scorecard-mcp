/max/partner/managed-customers
==============================

get https://api.securityscorecard.io/max/partner/managed-customers

Get a list of managed customers

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

search

string

Search managed customers by providing a JSON string that represents an array of objects; each object should include “id” for the field to search, “type” for the matching operator (e.g., “like” or “eq”), and “value” as an array of values to compare.

sort

string

Sort managed customers by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

filter

string

Filter managed customers by providing a JSON string that represents an array of objects; each object should include “id” for the field to filter, “type” for the operator (e.g., “like” or “eq”), and “value” as an array of values to compare.

Headers

version

string

API version header

Responses

200

Successful response containing a list of managed customers


===================================================================

Response body

object

entries

array of objects

required

A list of managed customers

entries\*

object

customer\_id

string

required

Identifier

customer\_name

string

required

customer\_domain

string

required

managed\_vendors

number

available\_slots

number

last\_update\_sent

string

engagement\_active\_breach

number

engagement\_risk\_escalating

number

engagement\_needs\_attention

number

engagement\_trending\_down

number

engagement\_ok

number

request\_status

string

required

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-managed-customers)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers \\

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