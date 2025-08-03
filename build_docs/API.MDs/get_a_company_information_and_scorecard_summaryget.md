Get a company information and scorecard summary
===============================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}

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

primary identifier of a company or scorecard in SecurityScorecard. To determine this value, company must be added to a portfolio first.

Query Params

with\_provisional\_status

boolean

return if score is provisional

truefalse

Responses

200

company's summary


==========================

Response body

object

name

string

public company name

domain

string

primary domain of the company (used as unique identifier)

grade

string

a company security scorecard grade (A to F), or '?' if it's calculating.

`A` `B` `C` `D` `F` `?`

grade\_url

string

url to an image depicting the grade

score

integer

security score from 0 to 100. this property is undefined if score is still being calculated.

industry

string

industry (unique identifier). 'unknown' if this wasn't yet determined.

size

string

a company described based on number of employees

`unknown` `size_1_to_10` `size_11_to_50` `size_51_to_200` `size_201_to_500` `size_501_to_1000` `size_1001_to_5000` `size_5001_to_10000` `size_more_than_10000`

uuid

string

Identifier

last30day\_score\_change

integer

The delta score in 30 days

is\_custom

boolean

Is custom scorecard

is\_entity

boolean

Is an entity

is\_un\_published

boolean

Is unpublished

created\_at

date-time

created date

disputed

boolean

Is disputed

provisional

boolean

The score is provisional

400

Bad Request: The scorecard\_identifier or the authorization header is malformed.

401

Unauthorized

403

Company needs to be added to a portfolio first

404

company doesn't have a scorecard yet, you can add it to any portfolio to get it created.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier \\

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