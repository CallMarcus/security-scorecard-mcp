Get list of managed action plans for managed customers vendors
==============================================================

get https://api.securityscorecard.io/plans/{id}

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

Query Params

pageIndex

number

page number, 0 is the first page

pageSize

number

page size, the amount of items per page (max: 200)

sort

string

plas list sorted field

search

string

search text to look into plans fields

filter

string

url encoded json filter string

Response

200

a list of plans visible by the user


============================================

Response body

object

entries

array of objects

required

entries\*

object

id

uuid

required

unique plan id

remediation\_version

string

roles

array of strings

Role list

roles

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

editors

array of strings

Defaults to

list of editors (user emails) that can edit the plan

editors

share\_with\_domain

boolean

Whether the plan should be shared with the domain

created\_by

string

required

username of the creator

created\_at

date-time

required

creation timestamp

updated\_by

string

required

username who last updated

updated\_at

date-time

required

last update timestamp

type

string

required

`expression` `overall_score_improvement` `factor_score_improvement` `issue_resolution` `compliance_framework` `assessments` `evidence_locker` `remediation`

status

string

required

`active` `completed`

status\_v2

string

required

`draft` `not_started` `in_progress` `complete` `resolved`

organization\_domain

string

required

Domain of the organization the plan belong to

archived\_at

date-time

archived timestamp

synchronized\_at

date-time

synchronized timestamp

is\_custom\_scorecard

boolean

required

true if the scorecard is a custom one

company\_name

string

required

scorecard company name

company\_score

number

required

scorecard company score

factor\_scores

array of objects

scorecard factor scores

factor\_scores

object

factor

string

required

factor name

score

number

required

factor score

target

object

target object

criteria

object

criteria object

is\_managed

boolean

True if is a managed scorecard

is\_published

boolean

True if is published

managed\_scorecard

string

Score which manages the scorecard for which the action plan is created

total\_issues

number

closed\_issues

number

progress

number

page

integer

required

size

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

[Log in to use your API keys](/login?redirect_uri=/reference/getplansmanagedservices)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/plans/id \\

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