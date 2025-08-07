/max/partner/indicators/exclusion
=================================

get https://api.securityscorecard.io/max/partner/indicators/exclusion

Gets list of indicator exclusion for the current partner

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

scope

string

Scope filter, it can be partner, vendor or customer, also accepts a comma separated list of the previous values

max\_severity

string

Max Severity filter, accepts single value or comma separated list of max severities

LowLowMediumHighCritical

issue\_category

string

Category filter, accepts single value or comma separated list of issue categories

issue\_type\_key

string

Issue type key filter, accepts single value or comma separated list of issue type keys

customer\_id

uuid

Customer ID filter, accepts single value or comma separated list of customer ids

vendor\_id

uuid

Vendor ID filter, accepts single value or comma separated list of vendor ids

search

string

Word or phrase to search records for

sort

string

Sort excluded indicators by providing a JSON string representing an array of objects; each object should include "id" for the field to sort by in camelCase and "desc" as a boolean indicating descending (true) or ascending (false) order.

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

A list of all indicator exclusions


===========================================

Response body

object

entries

array of objects

required

entries\*

object

id

uuid

required

issue\_type

string

required

ID of the indicator and Issue Type

scope

string

required

Scope of the exclusion, can be: partner (everybody), vendor or customer

`partner` `customer` `vendor`

customer\_id

string

ID of the customer if the scope is customer

customer\_name

string

Name of the customer if the scope is customer

vendor\_id

string

ID of the vendor if the scope is vendor

vendor\_name

string

Name of the vendor if the scope is vendor

vendor\_domain

string

Domain of the vendor if the scope is vendor

redundant

boolean

required

If the exclusion is redundant

edited\_at

string

required

Date of the last edition

edited\_by

string

required

User Email of the last editor

reason

string

Reason for the exclusion

issue\_type\_name

string

required

Name of the issue type

issue\_type\_severity

string

required

Severity of the issue type

issue\_type\_category

string

required

Category of the issue type

issue\_type\_breach\_risk

string

required

Breach risk

issue\_type\_threat\_level

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-indicators-exclusion)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/indicators/exclusion \\

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