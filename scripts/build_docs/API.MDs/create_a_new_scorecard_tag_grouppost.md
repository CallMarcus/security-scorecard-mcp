Create a new scorecard tag group
================================

post https://api.securityscorecard.io/scorecard-tags/groups

Create a new scorecard tag group

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

tag group payload

name

string

required

scorecard tag group name

Response

200

Scorecard Tag Group


============================

Response body

object

id

uuid

the id of the scorecard tag group

name

string

required

scorecard tag group name

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_scorecard-tags-groups)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/groups \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json'

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