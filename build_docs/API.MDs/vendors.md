/max/partner/vendors
====================

get https://api.securityscorecard.io/max/partner/vendors

Get all customers' vendors for current partner

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

Search text to look for vendor name, vendor domain or customer name.

sort

string

Sort vendors by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

vendor\_name

string

Vendor name filter, accepts single value or comma separated list of vendor names.

customer\_name

string

Customer name filter, accepts single value or comma separated list of customer names.

tier

string

Tier filter, accepts single value or comma separated list of tiers.

lifecycle

string

Lifecycle filter, accepts single value or comma separated list of lifecycle values.

status

string

Status filter, accepts single value or comma separated list of status values.

incident\_likelihood

string

Incident likelihood filter, accepts single value or comma separated list of values.

business\_impact

string

Business impact filter, accepts single value or comma separated list of business impact values.

incident\_likelihood\_trend

string

Incident likelihood trend filter, accepts single value or comma separated list of values.

initial\_assessment

string

Initial assessment filter, accepts single value or comma separated list of values.

previous\_assessment

string

Previous assessment filter, accepts single value or comma separated list of values.

Headers

version

string

API version header

Responses

200

Successful response containing a list of vendors for current partner


=============================================================================

Response body

object

entries

array of objects

required

List of vendors

entries\*

object

vendor\_id

string

required

Unique identifier of vendor

vendor\_name

string

required

Vendor name

vendor\_domain

string

required

Vendor domain

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

business\_impact

string

required

incident\_likelihood

string

required

engagement

string

required

lifecycle

string

required

tier

string

required

custom\_tags

array of objects

required

custom\_tags\*

object

id

string

Identifier

name

string

required

incident\_likelihood\_report\_id

string

Identifier

deleted\_at

date-time

created\_at

date-time

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-vendors)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/vendors \\

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