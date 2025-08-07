Get all domain assets for a parent domain with filtering options
================================================================

get https://api.securityscorecard.io/footprint/{parentDomain}/assets/domains

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

page

number

Page number, starts at 0

size

number

≤ 100

Number of items per page (max 100)

sort

string

Sort field and direction (e.g., "domain:asc" or "last\_seen:desc")

filters

string

JSON-encoded filters for the assets

filter-operator

string

Filter operation, expected values: and | or

include-evidence

string

Whether to include evidence in the response (true/false)

Responses

200

Successfully retrieved domain assets


=============================================

Response body

getDomainAssetsByParentDomainResponseSchema

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_footprint-parentdomain-assets-domains)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/footprint/parentDomain/assets/domains \\

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