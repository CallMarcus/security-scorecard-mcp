/max/partner/vendors/statuses
=============================

put https://api.securityscorecard.io/max/partner/vendors/statuses

Set tags and statuses for customers vendors by domains

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

vendors

array of objects

required

vendors\*

ADD object

custom\_tags

array of objects

custom\_tags

ADD object

business\_impact

string

incident\_likelihood

string

engagement

string

lifecycle

string

tier

string

assessment\_scheduled\_at

date-time

Headers

version

string

API version header

Responses

200

No Content

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_max-partner-vendors-statuses)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/max/partner/vendors/statuses \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No