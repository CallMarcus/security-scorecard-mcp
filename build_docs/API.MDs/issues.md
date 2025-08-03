Get a company's active issues
=============================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/active-issues

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

issue\_types

array of strings

List of issue types to filter by (e.g., tlscert\_weak\_signature, tlscert\_self\_signed)

issue\_types

ADD string

Responses

200

company's active issues


================================

Response body

object

issue\_types

array of objects

issue\_types

object

name

string

required

issue type (permanent key)

issues

array of objects

required

list of active issues of this type on this company

issues\*

object

issue\_id

string

required

issue id

issue\_count

number

required

total number of findings of this issue on this company

effective\_date

date-time

effective date of this issue

evidence

array of strings

evidence

first\_seen\_time

date-time

first seen time of this issue

last\_seen\_time

date-time

last seen time of this issue

group\_status

string

group status of this issue

issuer\_name

string

issuer name of this issue

observations

array of objects

observations

object

ip

string

ip address

port

integer

port

sni

string

sni

last\_seen\_time

date-time

last seen time

sha256\_fingerprint

string

sha256 fingerprint of this issue

target

string

target of this issue

port

integer

port of this issue

issues\_count

number

total active issues of this type on this company

total\_active\_issues

number

total number of active issues

400

Bad Request: The scorecard\_identifier or the authorization header is malformed.

401

Unauthorized

403

to access scorecard's active issues level data, company must be added to a portfolio first.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-active-issues)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/active-issues \\

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