Update a Job
============

put https://api.securityscorecard.io/apps/{appId}/jobs/{jobId}

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

jobId

uuid

required

job id

Body Params

update job status

status

string

required

job status

log

string

required

execution info

error

string

required

error info

Response

200

Update Job status


==========================

Response body

object

id

uuid

required

unique identifier for the object

created\_by

string

required

created by

started\_at

string

required

created date

completed\_at

string

required

completed job timestamp

status

string

required

job status

log

string

required

execution info

error

string

required

execution info

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

[Log in to use your API keys](/login?redirect_uri=/reference/putappsbyappidjobsbyjobid)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/apps/appId/jobs/jobId \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

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