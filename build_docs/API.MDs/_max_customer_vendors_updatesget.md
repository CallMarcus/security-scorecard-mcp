/max/customer/vendors/updates
=============================

get https://api.securityscorecard.io/max/customer/vendors/updates

Get vendor updates for the current customer

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

Sort vendor updates by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

filter

string

Used to filter vendor updates data by applying one or more conditions. Accepts a URL-encoded JSON array where each object defines a filter with keys: 'operator', 'id', 'value', and 'type'. For example, to filter vendor updates by a specific vendor name, use an object like {"operator": "eq", "id": "vendor\_name", "value": \["example.com"\], "type": "multiValue"}.

Headers

version

string

API version header

Responses

200

Successfull response with the list of vendor updates for the current customer


======================================================================================

Response body

object

entries

array of objects

required

A list of vendor updates for the current customer

entries\*

object

id

string

required

Identifier

summary

string

required

summary of the vendor update

escalated\_date

date-time

required

priority

string

required

priority of the vendor update

responsive

boolean

required

is responsive

action\_needed

boolean

required

is any action needed

date

date-time

required

updated\_at

date-time

vendor\_domain

string

required

domain of the vendor

vendor\_name

string

required

name of the vendor

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-customer-vendors-updates)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/customer/vendors/updates \\

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