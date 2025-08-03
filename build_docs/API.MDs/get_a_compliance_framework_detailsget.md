get a compliance framework details
==================================

get https://api.securityscorecard.io/compliance-frameworks/{key}

get a compliance framework details

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

key

string

required

compliance framework key

Response

200

a compliance framework


===============================

Response body

object

standard

string

required

human-readable standard name

sections

array of objects

required

sections in this framework

sections\*

object

id

string

required

section unique identifier

title

string

required

human-readable title of this section

questions

array of objects

required

questions\*

object

id

string

required

question unique identifier

question

string

required

the human-readable question

issue\_types

array of strings

required

issue\_types\*

no\_match

string

required

a human-readable explanation that can be used when no issue types in a company match this question

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_compliance-frameworks-key-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/compliance-frameworks/key \\

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