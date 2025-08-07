Get all scorecard tags
======================

get https://api.securityscorecard.io/scorecard-tags

Get all scorecard tags

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

a list of scorecard tags


=================================

Response body

object

entries

array of objects

required

entries\*

object

id

string

unique identifier of the scorecard tag

name

string

required

description

string

total

integer

required

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_scorecard-tags)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/scorecard-tags \\

3

     \--header 'accept: application/json'

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