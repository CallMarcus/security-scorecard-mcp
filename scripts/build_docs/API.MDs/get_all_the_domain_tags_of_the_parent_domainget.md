Get all the domain tags of the parent domain
============================================

get https://api.securityscorecard.io/ip-domain-tags/parent-domains/{parentDomain}/domains

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

parentDomain

string

required

parent domain

Response

200

tag schema


===================

Response body

object

entries

array of objects

required

entries\*

object

id

string

required

tag organization id

name

string

required

tag name

Updated 25 days ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/getapibyparentdomaindomainrelatedtags)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/ip-domain-tags/parent-domains/parentDomain/domains \\

3

     \--header 'accept: application/json; charset=utf-8'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

200

Updated 25 days ago

* * *

Did this page help you?

Yes

No