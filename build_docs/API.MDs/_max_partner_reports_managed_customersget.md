/max/partner/reports/managed-customers
======================================

get https://api.securityscorecard.io/max/partner/reports/managed-customers

Get a list of customers from the generated reports

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

Search text to look into customer name or domain

Headers

version

string

API version header

Responses

200

Successful response containing a list of searched customers from the generated reports


===============================================================================================

Response body

object

entries

array of objects

required

Array of customer objects

entries\*

object

id

string

required

Unique identifier of the customer

name

string

required

Customer name

domain

string

required

Customer domain

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-reports-managed-customers)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/reports/managed-customers \\

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