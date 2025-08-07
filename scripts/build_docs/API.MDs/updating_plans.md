Update partially the factor score improvement plan by ID
========================================================

patch https://api.securityscorecard.io/plans/factor-score-improvement/{id}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

uuid

required

unique plan id

Body Params

name

string

plan name

description

string

plan description

due\_date

date-time

the plan due date

target

object

target object

criteria

object

criteria object

Response

204

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

[Log in to use your API keys](/login?redirect_uri=/reference/patchplansfactorscoreimprovementbyid)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PATCH \\

2

     \--url https://api.securityscorecard.io/plans/factor-score-improvement/id \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No