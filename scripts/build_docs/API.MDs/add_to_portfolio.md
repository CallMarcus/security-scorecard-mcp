Add company to portfolio
========================

put https://api.securityscorecard.io/portfolios/{portfolio\_id}/companies/{domain}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

portfolio\_id

string

required

a portfolio unique id

domain

string

required

a company's internet domain. this parameter accepts any valid internet domain.

Response

200

added company's summary


================================

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_portfolios-portfolio-id-companies-domain)

cURL Request

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/portfolios/portfolio\_id/companies/domain \\

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