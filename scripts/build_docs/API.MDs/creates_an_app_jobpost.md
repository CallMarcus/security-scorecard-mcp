creates an app job
==================

post https://api.securityscorecard.io/apps/{appId}/jobs

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

appId

uuid

required

application id

Body Params

execution parameters

max\_concurrency

number

required

1 to 5

Defaults to 1

how many jobs can be running same time

hours\_since\_last\_completion

number

required

1 to 23

Defaults to 23

how many hours since last job completion must ocurr to get a new job

Response

201

job created


====================

Response body

object

id

uuid

required

unique identifier for the object

created\_by

string

required

user who create the job

started\_at

string

required

job start date

status

string

required

job status

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

[Log in to use your API keys](/login?redirect_uri=/reference/postappsbyappidjobs)

cURL Request

Examples

xxxxxxxxxx

10

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/apps/appId/jobs \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "max\_concurrency": 1,

8

  "hours\_since\_last\_completion": 23

9

}

10

'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

201

Updated about 2 months ago

* * *

Did this page help you?

Yes

No