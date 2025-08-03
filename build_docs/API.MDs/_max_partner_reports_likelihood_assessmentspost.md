/max/partner/reports/likelihood-assessments
===========================================

post https://api.securityscorecard.io/max/partner/reports/likelihood-assessments

Post a request for the creation of Likelihood Assessment Reports providing a list of scorecards

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

date\_from

string

required

Effective start date in the format YYYY-MM-DD

date\_to

string

required

Effective end date in the format YYYY-MM-DD

Body Params

is\_likelihood\_report

boolean

Defaults to false

If true, triggers generation of a likelihood assessment report

truefalse

is\_remediation\_plan\_report

boolean

Defaults to false

If true, a remediation plan report will be generated

truefalse

list

array of objects

required

List of scorecards and managed customers for which report needs to be generated

list\*

ADD object

Headers

version

string

API version header

Responses

201

Data was stored successfully


=====================================

Response body

object

managed\_customer\_scorecards

array of objects

required

managed\_customer\_scorecards\*

object

managed\_customer

string

required

scorecard

string

required

vendors\_not\_managed

array of strings

required

vendors\_not\_managed\*

customers\_not\_managed

array of strings

required

customers\_not\_managed\*

request\_id

string

required

Unique identifier for the created request

400

Bad Request


====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 400

401

Unauthorized


=====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 401

403

Forbidden


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 403

404

Not Found


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 404

429

Too Many Requests


==========================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 429

Updated 1 day ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/post_max-partner-reports-likelihood-assessments)

cURL Request

Examples

xxxxxxxxxx

10

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/max/partner/reports/likelihood-assessments \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "is\_likelihood\_report": false,

8

  "is\_remediation\_plan\_report": false

9

}

10

'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

201400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No