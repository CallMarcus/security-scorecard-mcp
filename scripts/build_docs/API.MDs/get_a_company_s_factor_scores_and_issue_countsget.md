Get a company's factor scores and issue counts
==============================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/factors

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

severity

string

optionally filter issues by severity

highpositiveinfolowmediumhigh

severity\_in

string

optionally filter issues by comma separated severity list

Responses

200

company's factors


==========================

Response body

object

entries

array of objects

entries

object

name

string

factor name/id

score

integer

security score from 0 to 100

grade

string

a company security scorecard grade (A to F), or '?' if it's calculating.

`A` `B` `C` `D` `F` `?`

grade\_url

string

url to an image depicting the grade

issue\_summary

array of objects

issue\_summary

object

severity

string

severity of this type of issue

`positive` `info` `low` `medium` `high`

type

string

issue type (permanent key)

count

integer

total findings of this issue type on this company

detail\_url

string

api endpoint to get the issue findings detail of this issue type

total\_score\_impact

number

score impact of all issue findings of this type to the scorecard's overall score

total

integer

Total number of factors

400

Bad Request: The scorecard\_identifier or the authorization header is malformed.

401

Unauthorized

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-factors)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/factors \\

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