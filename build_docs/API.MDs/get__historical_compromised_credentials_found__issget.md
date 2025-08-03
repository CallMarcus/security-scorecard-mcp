Get "historical\_compromised\_credentials\_found" iss
=====================================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/issues/historical\_compromised\_credentials\_found

Get "historical\_compromised\_credentials\_found" issues in a scorecard

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

A page in a list of HistoricalCompromisedCredentialsFounds


===================================================================

Response body

object

entries

array of objects

required

entries\*

object

issue\_id

uuid

Unique UUID for this measurement.

parent\_domain

string

Parent domain aka vendor.

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

Epoch of observation in nanoseconds.

last\_seen\_time

date-time

Epoch of observation in nanoseconds.

password

string

infection\_date

string

domain

string

user\_name

string

reason

string

url

string

ip

string

stealer\_name

string

country

string

zip\_code

string

location

string

current\_language

string

os

string

filename

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-issues-historical-compromised-credentials-found)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/issues/historical\_compromised\_credentials\_found \\

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