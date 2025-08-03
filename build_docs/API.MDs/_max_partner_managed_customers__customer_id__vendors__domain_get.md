/max/partner/managed-customers/{customer\_id}/vendors/{domain}
==============================================================

get https://api.securityscorecard.io/max/partner/managed-customers/{customer\_id}/vendors/{domain}

Get vendor for customer by domain

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

domain

string

required

Headers

version

string

API version header

Responses

200

Successful response containing data of managed customer vendor


=======================================================================

Response body

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

assessment\_scheduled\_at

date-time

scoring\_started\_at

date-time

grade

string

a security scorecard grade (A to F), or '?' if it's calculating.

`A` `B` `C` `D` `F` `?`

score

integer

security score from 0 to 100

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-managed-customers-customer-id-vendors-domain)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers/customer\_id/vendors/domain \\

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