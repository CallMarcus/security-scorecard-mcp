Delete followed company by domain


===================================

delete https://api.securityscorecard.io/all-companies/{domain}

Removes the followed company from portfolios and watchlists and deletes all its associated data.

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

Domain of the followed company

Responses

204

No content

400

Bad request

403

Not allowed to perform this operation

404

Followed company not found

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

[Log in to use your API keys](/login?redirect_uri=/reference/deletefollowedcompanybydomain)

cURL Request

xxxxxxxxxx

1

curl \--request DELETE \\

2

     \--url https://api.securityscorecard.io/all-companies/domain

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No