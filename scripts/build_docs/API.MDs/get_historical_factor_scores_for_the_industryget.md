get historical factor scores for the industry
=============================================

get https://api.securityscorecard.io/industries/{industry}/history/factors

get historical factor scores for the industry

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

industry

string

required

Query Params

from

date

to

date

Response

200

List of IndustryFactorsHistories


=========================================

Response body

object

entries

array of objects

required

entries\*

object

date

date-time

required

factors

array of objects

required

factors\*

object

name

string

required

score

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_industries-industry-history-factors)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/industries/industry/history/factors \\

3

     \--header 'accept: application/json; charset=utf-8'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

200

Updated about 2 months ago

* * *

Did this page help you?

Yes

No