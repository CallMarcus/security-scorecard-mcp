Get the attribution log for the parent domain
=============================================

get https://api.securityscorecard.io/footprint/{parentDomain}/attribution-log

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

parentDomain

string

required

parent domain

Query Params

date-from

string

start date time range

date-to

string

end date time range

sort-field

string

sort field

filters

string

filters field

filter-operator

string

filter operation, expected values: and | or

page

number

required page number, first page is 0

page-size

number

size of the pages in the paginated result

Responses

200

Get attribution logs of the parent domain


==================================================

Response body

getAttributionLogByParentDomainResponseSchema

EmptyEntriesSizeSchema

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

Updated about 1 month ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/get_footprint-parentdomain-attribution-log)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/footprint/parentDomain/attribution-log \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200400401403404

Updated about 1 month ago

* * *

Did this page help you?

Yes

No