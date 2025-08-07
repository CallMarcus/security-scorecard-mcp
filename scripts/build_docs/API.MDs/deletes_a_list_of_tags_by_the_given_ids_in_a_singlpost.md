Deletes a list of tags by the given ids in a singl
==================================================

post https://api.securityscorecard.io/scorecard-tags/bulk-delete

Deletes a list of tags by the given ids in a single request

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

list of tag ids

ids

array of strings

required

ids\*

ADD string

public\_tags

boolean

truefalse

Response

204

No response body

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_scorecard-tags-bulk-delete)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/bulk-delete \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No