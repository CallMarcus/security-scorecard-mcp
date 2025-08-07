Update a scorecard tag
======================

put https://api.securityscorecard.io/scorecard-tags/{id}

Update a scorecard tag

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

string

required

scorecard tag id

Body Params

scorecard tag payload

id

string

unique identifier of the scorecard tag

name

string

required

description

string

privacy

string

Defaults to shared

Response

200

a scorecard tag


========================

Response body

object

id

string

unique identifier of the scorecard tag

name

string

required

description

string

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_scorecard-tags-id)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/id \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '{"privacy":"shared"}'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200

Updated about 2 months ago

* * *

Did this page help you?

Yes

No