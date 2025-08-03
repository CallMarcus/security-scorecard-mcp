Add companies in bulk to a portfolios
=====================================

put https://api.securityscorecard.io/portfolios/companies/bulk-upload

Add companies in bulk to a portfolios

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

auth\_mechanism

string

propaged auth mechanism to distinguish platform requests and API integrations

Body Params

portfolios

array of strings

required

list of portfolio IDs

portfolios\*

ADD string

companies

array of strings

required

company domains

companies\*

ADD string

bulkInvite

boolean

t/f if the upload was created via csv bulk upload

truefalse

tagType

string

Response

201

No response body

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_portfolios-companies-bulk-upload)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/portfolios/companies/bulk-upload \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No