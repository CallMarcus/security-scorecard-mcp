Get all expanded risk events in a portfolio
===========================================

get https://api.securityscorecard.io/portfolios/{portfolio\_id}/expanded-risk

Get all expanded risk events in a portfolio

**Note: Requires access to ESG**

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

Query Params

category

string

optionally filter events by category

watchlistadversecorruptionfinancial crimehigh risk industrypeprelative or associatesanctionsstate owned companyterrorismwatchlist

confidence

string

optionally filter events by confidence

highlowunlikelymediumhigh

page

integer

≥ 1

optionally specify which page of results to return

limit

integer

1 to 5000

optionally specify how many results to return

Responses

200

OK


===========

Response body

object

entries

array of objects

entries

object

confidence

string

category

string

comments

string

company\_name

string

created\_at

date-time

event

string

event\_urls

array of strings

event\_urls

primary\_source

string

scorecard\_domain

string

scorecard\_id

string

source\_url

string

sub\_category

string

updated\_date

date-time

size

integer

The number of records to be returned per page

total

integer

The total number of records matching the given query

Headers

object

Link

string

URL to be used to used to fetch additional pages of results

400

Bad Request

401

Unauthorized

403

Company must be added to a portfolio first

404

Company not found

default

Error Payload


==========================

Response body

object

error

object

required

data

object

The field that is causing the error

Has additional fields

key

string

Some string to be used for further lookup

message

string

required

Human readable message, suitable for showing in some UI

statusCode

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_portfolios-portfolio-id-expanded-risk)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/portfolios/portfolio\_id/expanded-risk \\

3

     \--header 'accept: application/json; charset=utf-8'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

200default

Updated about 2 months ago

* * *

Did this page help you?

Yes

No