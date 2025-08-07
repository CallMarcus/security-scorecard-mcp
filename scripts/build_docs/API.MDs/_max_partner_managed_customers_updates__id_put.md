/max/partner/managed-customers/updates/{id}
===========================================

put https://api.securityscorecard.io/max/partner/managed-customers/updates/{id}

Updates a customer communication

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

uuid

required

Unique identifier for the resource

Body Params

is\_featured

boolean

required

is this update featured

truefalse

summary

string

required

summary of the update

attachment\_url

string

url of the attachment

documents

array of strings

required

IDs of documents to include in the update

documents\*

ADD string

Headers

version

string

API version header

Responses

201

ID of the updated managed customer update


==================================================

Response body

object

id

string

required

Customer update identifier

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_max-partner-managed-customers-updates-id)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers/updates/id \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '{"is\_featured":true}'

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