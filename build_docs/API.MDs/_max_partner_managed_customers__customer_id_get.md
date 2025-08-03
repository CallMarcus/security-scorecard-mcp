/max/partner/managed-customers/{customer\_id}
=============================================

get https://api.securityscorecard.io/max/partner/managed-customers/{customer\_id}

Get managed customer detail by id

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

Headers

version

string

API version header

Responses

200

Successful response containing data of managed customer


================================================================

Response body

object

customer\_id

string

required

Identifier

domain

string

required

name

string

required

availableSlots

integer

Number of available slots for this managed customer

status

string

required

requestId

string

required

Identifier

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-managed-customers-customer-id)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers/customer\_id \\

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