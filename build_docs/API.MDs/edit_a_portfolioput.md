Edit a portfolio
================

put https://api.securityscorecard.io/portfolios/{portfolio\_id}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

portfolio\_id

string

required

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

Response

200

the edited portfolio


=============================

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

[Log in to use your API keys](/login?redirect_uri=/reference/put_portfolios-portfolio-id)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PUT \\

2

     \--url https://api.securityscorecard.io/portfolios/portfolio\_id \\

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