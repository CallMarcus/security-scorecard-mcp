Get risk score by domain
========================

get https://api.securityscorecard.io/vendor-detection/{domain}/risk

Returns the supply chain risk score for a given domain

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

domain

string

required

Domain to use

Responses

200

OK


===========

Response body

object

risk\_score

number

The aggregate score of all 1st and 2nd connections detected for a company.

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

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

data

object

The field that is causing the error

Has additional fields

key

string

Some string to be used for further lookup

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_vendor-detection-domain-risk)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/vendor-detection/domain/risk \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200default

text/html

200default

Updated about 2 months ago

* * *

Did this page help you?

Yes

No