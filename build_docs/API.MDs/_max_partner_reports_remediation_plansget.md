/max/partner/reports/remediation-plans
======================================

get https://api.securityscorecard.io/max/partner/reports/remediation-plans

Get list of managed action plans for all vendors

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

filter

string

Filter action plans by specific criteria. The filter should be a JSON string that contains an array of objects, each representing a filter condition.

search

string

Search remediation plans by providing a JSON string that represents an array of objects; each object should include “id” for the field to search and “value” as the term to match. For example, to search plans by name, use { "id": "name", "value": "test" }.

sort

string

Sort remediation plans by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

Headers

version

string

API version header

Responses

200

A list of action plans visible by the user


===================================================

Response body

object

entries

array of objects

required

entries\*

object

id

string

action plan identifier

remediation\_version

string

roles

array of strings

roles

name

string

action plan name

description

string

description

due\_date

due date

string

string

scorecard

string

scorecard identifier

string

string

guests

array of strings

list of emails of guest users

guests

editors

array of strings

list of emails of editors

editors

created\_by

string

user who created the object

created\_at

date-time

created date

updated\_by

string

user who updated the object

updated\_at

date-time

created date

type

string

action plan type

`overall_score_improvement` `remediation` `issue_resolution` `factor_score_improvement`

status

string

action plan status

`active` `completed`

organization\_domain

string

primary domain of the company

archived\_at

archived date

string

string

synchronized\_at

synchronized date

string

string

is\_custom\_scorecard

boolean

true if this action plan is based on a custom scorecard, false otherwise

company\_name

string

company\_score

integer

security score from 0 to 100

factor\_scores

array of objects

factor\_scores

object

factor

string

factor name/id

score

integer

security score from 0 to 100

target

object

target object

criteria

object

criteria object

is\_managed

boolean

is\_published

boolean

managed\_scorecard

string

total\_issues

number

number of issues associated to the action plan

closed\_issues

number

number of closed issues associated to the action plan

progress

number

percentage of progress

size

integer

required

The number of records to be returned per page

page

integer

required

The page number to be returned

total

integer

required

The total number of records matching the given query

400

Bad Request


====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 400

401

Unauthorized


=====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 401

403

Forbidden


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 403

404

Not Found


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 404

429

Too Many Requests


==========================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 429

Updated 1 day ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-reports-remediation-plans)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/reports/remediation-plans \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No