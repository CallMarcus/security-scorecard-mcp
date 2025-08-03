Remove item from plan
=====================

delete https://api.securityscorecard.io/plans/{id}/items

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

id

uuid

required

unique plan id

Body Params

ids

array of strings

required

List of item ids

ids\*

ADD string

Response

204

the item was removed

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

[Log in to use your API keys](/login?redirect_uri=/reference/deleteplansbyiditems)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request DELETE \\

2

     \--url https://api.securityscorecard.io/plans/id/items \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No