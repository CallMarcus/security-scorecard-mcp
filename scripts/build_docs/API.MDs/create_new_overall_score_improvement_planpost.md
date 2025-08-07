Create new overall score improvement plan
=========================================

post https://api.securityscorecard.io/plans/overall-score-improvement

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

name

string

plan name

description

string

plan description

due\_date

date-time

required

the plan due date

scorecard

string

required

the scorecard which the plan is for

guests

array of strings

required

list of guests (user emails) that can access to the plan

guests\*

ADD string

editors

array of strings

Defaults to

list of editors (user emails) that can edit the plan

editors

ADD string

share\_with\_domain

boolean

Whether the plan should be shared with the domain

truefalse

target

object

required

target object

Response

201

new plan id


====================

Response body

object

id

uuid

required

unique plan id

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

[Log in to use your API keys](/login?redirect_uri=/reference/postplansoverallscoreimprovement)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/plans/overall-score-improvement \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

201

Updated about 2 months ago

* * *

Did this page help you?

Yes

No