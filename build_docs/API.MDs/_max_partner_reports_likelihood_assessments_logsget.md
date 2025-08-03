/max/partner/reports/likelihood-assessments/logs
================================================

get https://api.securityscorecard.io/max/partner/reports/likelihood-assessments/logs

Retrieves bulk logs for likelihood assessment reports associated with the authenticated partner organization

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

managed\_customer

string

Customer scorecard domain

vendor

string

Vendor scorecard domain

Headers

version

string

API version header

Responses

200

Logs for the bulk generation for likelihood-assessment reports


=======================================================================

Response body

object

partner

string

The partner id

progress

object

required

Progress of the request

completed

integer

required

≥ 0

amount of completed tasks

failed

integer

required

≥ 0

amount of failed tasks

total

integer

required

≥ 0

total amount of tasks

percentage

number

0 to 100

percentage of completed tasks

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-reports-likelihood-assessments-logs)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/reports/likelihood-assessments/logs \\

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