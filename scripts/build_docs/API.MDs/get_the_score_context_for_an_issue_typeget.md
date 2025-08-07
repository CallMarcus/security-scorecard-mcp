Get the score context for an issue type
=======================================

get https://api.securityscorecard.io/companies/{domain}/issue-context/{issue\_type}

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

issue\_type

string

required

issue type to get context for

Responses

200

issue context in similar companies


===========================================

Response body

object

company\_incidence\_percentage

number

Percentage of similar companies that have this issue

findings\_count\_average

number

Average number of findings of this issue in similar companies

404

company not found, or user has no access to it.

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_companies-domain-issue-context-issue-type)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/companies/domain/issue-context/issue\_type \\

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