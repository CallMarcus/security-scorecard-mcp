Create an ip domain tag
=======================

post https://api.securityscorecard.io/ip-domain-tags

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

ip domain tag payload

tag

string

required

tag name

description

string

tag description

Response

200

tag schema


===================

Response body

object

organization\_id

string

tag organization id

id

string

required

tag organization id

tag

string

required

tag name

description

string

required

tag description

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

[Log in to use your API keys](/login?redirect_uri=/reference/postapi)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/ip-domain-tags \\

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