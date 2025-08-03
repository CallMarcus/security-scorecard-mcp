Get "ssh\_weak\_cipher" historical issues in a score
====================================================

get https://api.securityscorecard.io/companies/{scorecard\_identifier}/history/events/{effective\_date}/issues/ssh\_weak\_cipher/

Get "ssh\_weak\_cipher" historical issues in a scorecard

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

effective\_date

date

required

find entries where "effective\_date" equals a date

Query Params

issue\_id

uuid

find entries where "issue\_id" equals a uuid

measurement\_id\_in

string

find entries where "measurement\_id" is in a set of uuids (comma-separated)

effective\_date\_from

date

find entries where "effective\_date" is greater or equal than a date

effective\_date\_to

date

find entries where "effective\_date" is lower or equal than a date

effective\_date\_in

string

find entries where "effective\_date" is in a set of dates (comma-separated)

group\_status

string

find entries where "group\_status" equals a string

Response

200

A page in a list of HistoricalSshWeakCiphers


=====================================================

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

banner

string

evidence

array of strings

evidence

connection\_attributes

object

connection\_attributes object

reason

string

effective\_date

date

group\_status

string

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-scorecard-identifier-history-events-effective-date-issues-ssh-weak-cipher-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/scorecard\_identifier/history/events/effective\_date/issues/ssh\_weak\_cipher/ \\

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