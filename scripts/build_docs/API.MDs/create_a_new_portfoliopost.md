Create a new portfolio
======================

post https://api.securityscorecard.io/portfolios

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

name

string

required

human-readable name

description

string

human-readable description

privacy

string

private: only visible to owner, shared: visible to the entire organization, team: group of users within an organization

privatesharedteam

team\_id

string

the team id

Response

200

the created portfolio


==============================

Response body

object

id

string

unique identifier

name

string

required

human-readable name

description

string

human-readable description

privacy

string

private: only visible to owner, shared: visible to the entire organization, team: group of users within an organization

`private` `shared` `team`

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_portfolios)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/portfolios \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

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