Get all portfolios you have access to
=====================================

get https://api.securityscorecard.io/portfolios

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

the list of portfolios


===============================

Response body

object

entries

array of objects

entries

object

id

string

unique identifier

name

string

human-readable name

description

string

human-readable description

privacy

string

private: only visible to owner, shared: visible to the entire organization, team: group of users within an organization

`private` `shared` `team`

read\_only

boolean

indicates if the portfolio details (title, description, privacy) can be modified

count

integer

total number of portfolios in this list

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_portfolios)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/portfolios \\

3

     \--header 'accept: application/json; charset=utf-8'

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