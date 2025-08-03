Get an ip domain tag group
==========================

get https://api.securityscorecard.io/ip-domain-tags/groups/{id}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

string

required

tag group id

Response

200

tag group schema


=========================

Response body

object

organization\_id

string

tag organization id

id

string

required

tag organization id

name

string

required

tag name

tags

array

required

array of tag ids

tags\*

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

[Log in to use your API keys](/login?redirect_uri=/reference/getapitaggroupsbyid)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/ip-domain-tags/groups/id \\

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