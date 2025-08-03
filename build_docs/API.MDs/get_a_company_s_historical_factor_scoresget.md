Get a company's historical factor scores
========================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/history/factors/score

Note: each entry in the response will have scores for each factor, you can obtain the factors currently available from [factor metadata](#tag/metadata%2Fpaths%2F~1metadata~1factors%2Fget)

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

scorecard\_identifier

string

required

primary identifier of a company or scorecard

Query Params

date\_from

date

history start date

date\_to

date

history end date

timing

string

date granularity, it could be "daily" (default), "weekly" or "monthly"

monthlydailyweeklymonthly

Responses

200

company historical scores


==================================

Response body

object

entries

array of objects

list of historical factor scores (this can be empty if the company hasn't been scored yet)

entries

object

date

date-time

effective date for this score

factors

array of objects

factors

object

name

string

factor key

score

integer

company factor security score from 0 to 100

View Additional Properties

403

to access scorecard's factor level data, company must be added to a portfolio first.

404

company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-history-factors-score)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/history/factors/score \\

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