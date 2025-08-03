/max/partner/vendors/updates/{id}
=================================

put https://api.securityscorecard.io/max/partner/vendors/updates/{id}

Update a communication for a managed customers vendor

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

summary

string

required

A brief summary of the vendor update

escalated\_date

date-time

required

The date and time when this update was escalated

priority

string

required

Priority level of the vendor update

responsive

boolean

required

Indicates whether the vendor has responded to this update

truefalse

action\_needed

boolean

required

Indicates if any further action is required

truefalse

vendor\_domain

string

required

Domain of the vendor associated with this update

Headers

version

string

API version header

Responses

201

ID of the updated managed customer vendor update


=========================================================

Response body

object

id

string

required

Vendor update identifier

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_max-partner-vendors-updates-id)

cURL Request

Examples

xxxxxxxxxx

10

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/max/partner/vendors/updates/id \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "responsive": true,

8

  "action\_needed": true

9

}

10

'

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