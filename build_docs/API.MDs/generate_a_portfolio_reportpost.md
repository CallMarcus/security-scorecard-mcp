Generate a Portfolio report
===========================

post https://api.securityscorecard.io/reports/portfolio

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

report creation parameters

format

string

output format

pdfcsv

portfolio\_id

string

required

the portfolio id

Responses

200

a reference to the created report


==========================================

Response body

object

id

string

View Additional Properties

404

portfolio not found, or user has no access to it.

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_reports-portfolio-1)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/reports/portfolio \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

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