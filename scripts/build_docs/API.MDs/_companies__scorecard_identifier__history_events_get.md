/companies/{scorecard\_identifier}/history/events/
==================================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/history/events/

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

find entries where 'scorecard\_identifier' equals a string

Query Params

date\_from

date-time

created at from

date\_to

date-time

created at to

Response

200

List of CompanyHistoricalEvents


========================================

Response body

object

entries

array of objects

required

entries\*

object

id

number

unique identifier

date

date-time

date the event occurred

event\_type

string

the type of event, at the moment one of these:

*   `issues`: indicates the arrival or departure of issues to this scorecard
*   `breach`: a breach was associated to this company
*   `recalibration`: indicates a recalibration event

Note: additional event types might be introduced in the future.

group\_status

string

when event type is "issues" indicates the status of the associated group of issues, at the moment one of:

*   `active`: new issues have been observed
*   `resolved`: issues were refuted and resolution confirmed by SecurityScorecard
*   `departed`: issues are not observed anymore

issue\_count

number

when event type is "issues" indicates the number of issue findings associated to this event

total\_score\_impact

number

total score impact of the findings detected in the event, to the company's overall score

issue\_type

string

when event type is "issues" indicates the type of the associated issues, one of the [existing issue types](#tag/metadata%2Fpaths%2F~1metadata~1issue-types%2Fget)

breach\_data

object

when event type is "breach" includes additional information about the breach.

Important Note: the fields available here might change in the future.

breach\_data object

severity

string

severity of associated issue type

factor

string

factor the associated issue type belongs to

detail\_url

string

api endpoint to get the issue findings detail of this event

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-history-events)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/history/events/ \\

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