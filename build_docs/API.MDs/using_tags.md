Get all companies associated with a scorecard tag
=================================================

get https://api.securityscorecard.io/scorecard-tags/{id}/companies

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

string

required

a scorecard tag unique id

Query Params

grade

string

company score grade filter

industry

string

industry filter

vulnerability

string

CVE vulnerability filter

issue\_type

string

issue type filter

status

string

company status

inactiveactiveinactive

had\_breach\_within\_last\_days

number

companies with breaches in last N days

Response

200

the list of companies


==============================

Response body

object

entries

array of objects

entries

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

security score from 0 to 100

industry

string

industry (unique identifier)

size

string

a company described based on number of employees

`unknown` `size_1_to_10` `size_11_to_50` `size_51_to_200` `size_201_to_500` `size_501_to_1000` `size_1001_to_5000` `size_5001_to_10000` `size_more_than_10000`

last30days\_score\_change

integer

last 30 days score change

total

integer

total number of companies in this portfolio

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_scorecard-tags-id-companies)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/id/companies \\

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