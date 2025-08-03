/max/partner/vendor-onboarding/negotiate-vendor-list
====================================================

put https://api.securityscorecard.io/max/partner/vendor-onboarding/negotiate-vendor-list

Upload vendor list for negotiation

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

with\_hierarchy

boolean

Includes hierarchy data about found scorecards

truefalse

has\_header

boolean

Ignores the first row in case the file contains a header

truefalse

Body Params

vendorList

file

required

vendor list csv

Headers

version

string

API version header

Responses

200

Vendor negotiation result


==================================

Response body

object

scorecards

array of objects

required

scorecards\*

object

domain

string

required

id

string

Identifier

original\_query

string

required

hierarchy

array of objects

hierarchy

object

industry

string

domain

string

name

string

hierarchy

object

hierarchy object

reason

string

confidence

number

required

not\_found

array of objects

required

not\_found\*

object

order

number

attempts

array of objects

required

attempts\*

object

query

string

reason

string

attempt

number

category

string

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_max-partner-vendor-onboarding-negotiate-vendor-list)

cURL Request

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/max/partner/vendor-onboarding/negotiate-vendor-list \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: multipart/form-data'

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