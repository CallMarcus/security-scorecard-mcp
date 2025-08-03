Get reports you have generated recently
=======================================

get https://api.securityscorecard.io/reports/recent

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

reports generated in the last 7 days


=============================================

Response body

object

entries

array of objects

entries

object

id

string

title

string

human-readable title for this report

format

string

file content format

report\_type

string

type of report requested

created\_at

date-time

time the report was requested

completed\_at

date-time

time report generation completed (only when completed)

download\_url

string

url that can be used to download the completed report (only when completed successfully). that url might respond with a redirect (302) that you'll have to follow to download the file, most http agents will do this automatically.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_reports-recent-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/reports/recent \\

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