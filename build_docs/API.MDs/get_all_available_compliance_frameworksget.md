get all available compliance frameworks
=======================================

get https://api.securityscorecard.io/compliance-frameworks

get all available compliance frameworks

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

List of ComplianceFrameworkSummaries


=============================================

Response body

object

entries

array of objects

required

entries\*

object

key

string

required

name

string

required

human-readable name

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_compliance-frameworks-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/compliance-frameworks \\

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