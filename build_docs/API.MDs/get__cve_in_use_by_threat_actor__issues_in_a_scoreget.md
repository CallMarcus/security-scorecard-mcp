Get "cve\_in\_use\_by\_threat\_actor" issues in a score
=======================================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/issues/cve\_in\_use\_by\_threat\_actor

Get "cve\_in\_use\_by\_threat\_actor" issues in a scorecard

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

scorecard identifier

Query Params

issue\_id

uuid

find entries where "issue\_id" equals a uuid

issue\_id\_in

string

find entries where "issue\_id" is in a set of uuids (comma-separated)

first\_seen\_time\_from

date-time

find entries where "first\_seen\_time" is greater or equal than a date-time

first\_seen\_time\_to

date-time

find entries where "first\_seen\_time" is lower or equal than a date-time

last\_seen\_time\_from

date-time

find entries where "last\_seen\_time" is greater or equal than a date-time

last\_seen\_time\_to

date-time

find entries where "last\_seen\_time" is lower or equal than a date-time

Response

200

A page in a list of CveInUseByThreatActors


===================================================

Response body

object

entries

array of objects

required

entries\*

object

issue\_id

uuid

parent\_domain

string

feedback

array of objects

feedback

object

created\_at

date-time

classifier

string

claim

string

description

string

feedback\_type

string

feedback\_status

string

request\_id

string

user\_id

string

last\_update

number

classifier\_type

string

count

number

first\_seen\_time

date-time

last\_seen\_time

date-time

vulnerability\_id

string

vulnerability\_url

string

vulnerability\_description

string

vulnerability\_publish\_date

string

threat\_labels

string

threat\_actor\_name

string

threat\_actor\_description

string

target

string

connection\_attributes

object

connection\_attributes object

reason

string

View Additional Properties

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-issues-cve-in-use-by-threat-actor)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/issues/cve\_in\_use\_by\_threat\_actor \\

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