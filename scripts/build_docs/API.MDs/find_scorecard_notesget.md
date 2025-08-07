Find scorecard notes


======================

get https://api.securityscorecard.io/scorecard-notes/{domain}

Searches scorecard notes by any of the allowed fields. Results are paginated.

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

Filter by followed company domain

Query Params

sort

string

Sort by any of the allowed fields. Use "-" for DESC order. Default sort by created\_at DESC.

created\_at\-created\_atupdated\_at\-updated\_atcreated\_by\-created\_byupdated\_by\-updated\_by

page

integer

Defaults to 0

Current page (zero-based)

page\_size

integer

10 to 100

Defaults to 20

Results per page

Responses

200

Successful operation


=============================

Response body

object

entries

array of objects

entries

object

id

uuid

note

string

created\_at

date-time

updated\_at

date-time

created\_by

object

created\_by object

updated\_by

object

updated\_by object

page

integer

Current page (zero-based)

size

integer

Total number of records

400

Bad request

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

[Log in to use your API keys](/login?redirect_uri=/reference/findscorecardnotes)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url 'https://api.securityscorecard.io/scorecard-notes/domain?page=0&page\_size=20' \\

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