Remove a tag from an ip
=======================

delete https://api.securityscorecard.io/ip-domain-tags/{tagId}/parent-domains/{parentDomain}/ip/{ip}

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

ip

string

required

ip

tagId

string

required

tag id

Response

200

ip association schema


==============================

Response body

object

ip

string

required

ip address

tags

array

required

array of tag ids

tags\*

organization\_id

string

required

orgarnization id

parent\_domain

string

required

ip parent domain

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

[Log in to use your API keys](/login?redirect_uri=/reference/deleteapibyparentdomainipbyipassociatetagsbytagid)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request DELETE \\

2

     \--url https://api.securityscorecard.io/ip-domain-tags/tagId/parent-domains/parentDomain/ip/ip \\

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