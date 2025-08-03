/max/partner/indicators
=======================

get https://api.securityscorecard.io/max/partner/indicators

Get list of all issue types

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

Word or phrase to search records for

sort

string

Sort indicators by providing a JSON string representing an array of objects; each object should include "id" for the field to sort by in camelCase and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

Headers

version

string

API version header

Responses

200

A list of all issue types


==================================

Response body

object

entries

array of objects

required

entries\*

object

issue\_type

string

required

ID of the indicator and Issue Type

name

string

required

severity

string

required

category

string

required

breach\_risk

string

required

Breach risk

threat\_level

string

required

Threat level

size

integer

required

The number of records to be returned per page

page

integer

required

The page number to be returned

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-indicators)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/indicators \\

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