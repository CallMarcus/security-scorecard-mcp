Get the score plan by score target
==================================

get https://api.securityscorecard.io/companies/{domain}/score-plans/by-target/{score}

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

primary domain identifying a company

score

integer

required

score target: the score you want to reach

Responses

200

issue context in similar companies


===========================================

Response body

object

entries

array of objects

a list of issues to remediate

entries

object

issue\_type

string

issue type key

title

string

issue type title

findings

integer

amount of findings of that issue type

remediations

integer

amount of findings of that issue type that plan suggests to remediate

factor

string

the factor this issue type belong to

severity

string

the issue type severity

size

integer

the ammount of issue types that require remediation

projected\_total\_score

number

the projected company score if all plan issues are resolved,

403

to access this scorecard, company must be added to a portfolio first.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-domain-score-plans-by-target-score)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/domain/score-plans/by-target/score \\

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