Search companies in bulk
========================

post https://api.securityscorecard.io/companies/bulk-searches

Search companies in bulk

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

searches

array of strings

required

search text array

searches\*

ADD string

maxSearches

integer

Defaults to 100000

number of searches to perform

Response

201

bulk searches results


==============================

Response body

object

scorecards

array of objects

required

list of domains found

scorecards\*

object

order

number

id

string

domain

string

required

name

string

follows

number

searches

object

list of scorecard original searches

searches object

contacts\_count

number

industry\_id

string

active

boolean

not\_found

array of objects

required

list of searches which has not found

not\_found\*

object

order

number

required

attempts

array of objects

required

attempts\*

object

query

string

reason

string

category

string

attempt

number

original\_query

string

match\_query

string

match\_domain

string

confidence

number

repeated\_domains

array of strings

required

list of domains found and repeated

repeated\_domains\*

scorecards\_repeated

array of objects

list of scorecards repeated

scorecards\_repeated

object

order

number

id

string

domain

string

required

name

string

follows

number

searches

object

list of scorecard original searches

searches object

contacts\_count

number

industry\_id

string

active

boolean

not\_found\_repeated

array of objects

list of searches which has not found and repeated

not\_found\_repeated

object

order

number

required

attempts

array of objects

required

attempts\*

object

query

string

reason

string

category

string

attempt

number

original\_query

string

match\_query

string

match\_domain

string

confidence

number

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_companies-bulk-searches)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/companies/bulk-searches \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "maxSearches": 100000

8

}

9

'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

201

Updated about 2 months ago

* * *

Did this page help you?

Yes

No