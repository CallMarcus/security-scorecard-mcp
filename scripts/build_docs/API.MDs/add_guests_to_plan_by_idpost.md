Add guests to plan by ID
========================

post https://api.securityscorecard.io/plans/{id}/guests

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

unique plan id

Body Params

guests

array of strings

required

list of guests (user emails) that can access to the plan

guests\*

ADD string

Response

201

guest was added successfully


=====================================

Response body

object

message

string

required

successful response

Updated about 2 months ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/postplansbyidguests)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/plans/id/guests \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

201

Updated about 2 months ago

* * *

Did this page help you?

Yes

No