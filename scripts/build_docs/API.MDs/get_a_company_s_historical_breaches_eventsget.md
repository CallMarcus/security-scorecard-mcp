Get a company's historical breaches events
==========================================

get https://api.securityscorecard.io/companies/{domain}/history/events/breaches

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

Query Params

date\_from

date-time

find entries where 'date' is greater or equal than a date

date\_to

date-time

find entries where 'date' is lower or equal than a date

Responses

200

company's breach events


================================

Response body

object

entries

array of objects

entries

object

date

date-time

event's date

event\_type

string

type of event

breach\_data

object

breach\_data object

403

to access scorecard's events level data, company must be added to a portfolio first.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-domain-history-events-breaches)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/domain/history/events/breaches \\

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