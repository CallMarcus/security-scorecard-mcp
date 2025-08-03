/max/partner/management-requests
================================

post https://api.securityscorecard.io/max/partner/management-requests

Creates new management request for a customer

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

customer\_id

string

required

Identifier

email

string

required

first\_name

string

required

last\_name

string

required

Headers

version

string

API version header

Responses

201

id of the created request


==================================

Response body

object

id

string

required

Management request identifier

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_max-partner-management-requests)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/max/partner/management-requests \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

201400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No