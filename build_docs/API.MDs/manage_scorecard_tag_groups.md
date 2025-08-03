Get all scorecard tag groups
============================

get https://api.securityscorecard.io/scorecard-tags/groups

Get all scorecard tag groups

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

a list of Scorecard Tag Groups


=======================================

Response body

object

entries

array of objects

required

entries\*

object

id

uuid

the id of the scorecard tag group

name

string

required

scorecard tag group name

tag\_ids

array of strings

tag\_ids

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_scorecard-tags-groups)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/groups \\

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