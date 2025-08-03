Get an industry's historical scores
===================================

get https://api.securityscorecard.io/industries/{industry}/history/score

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

an industry key, this can be obtained from a [company basic user info](#tag/companies%2Fpaths%2F~1companies~1%7Bdomain%7D%2Fget)

Query Params

timing

string

Defaults to daily

timing granularity

dailyweeklymonthly

from

date

history start date

to

date

history end date

Response

200

industry historical scores


===================================

Response body

object

entries

array of objects

entries

object

industry

string

industry (permanent key)

date

date-time

effective date for these scores

minScore

integer

minimum score for companies on this industry

maxScore

integer

maximum score for companies on this industry

avgScore

number

average score for companies on this industry

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_industries-industry-history-score-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url 'https://api.securityscorecard.io/industries/industry/history/score?timing=daily' \\

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