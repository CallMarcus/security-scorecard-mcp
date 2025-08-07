Get a company's historical scores
=================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/history/score

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

Responses

200

company historical scores


==================================

Response body

object

entries

array of objects

list of historical scores (this can be empty if the company hasn't been scored yet)

entries

object

domain

string

primary domain of the company

date

date-time

effective date for this score

score

integer

company security score from 0 to 100

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-history-score)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url 'https://api.securityscorecard.io/companies/scorecard\_identifier/history/score?timing=daily' \\

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