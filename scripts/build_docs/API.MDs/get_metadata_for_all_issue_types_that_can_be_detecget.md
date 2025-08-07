get metadata for all issue types that can be detec
==================================================

get https://api.securityscorecard.io/metadata/issue-types

get metadata for all issue types that can be detected in a company

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

List of IssueTypeMetadata


==================================

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

severity

string

required

level of severity according to security risk

factor

string

required

the factor this belongs to (see company score factors)

title

string

required

human-readable description

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_metadata-issue-types-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/metadata/issue-types \\

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