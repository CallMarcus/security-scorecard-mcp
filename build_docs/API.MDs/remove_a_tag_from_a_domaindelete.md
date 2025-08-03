Remove a tag from a domain
==========================

delete https://api.securityscorecard.io/ip-domain-tags/{tagId}/parent-domains/{parentDomain}/domain/{domain}

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

domain

string

required

domain

tagId

string

required

tag id

Response

200

domain association schema


==================================

Response body

object

domain

string

required

domain

tags

array

required

array of tag ids

tags\*

organization\_id

string

required

orgarnization id

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

[Log in to use your API keys](/login?redirect_uri=/reference/deleteapibyparentdomaindomainbydomainassociatetagsbytagid)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request DELETE \\

2

     \--url https://api.securityscorecard.io/ip-domain-tags/tagId/parent-domains/parentDomain/domain/domain \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

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