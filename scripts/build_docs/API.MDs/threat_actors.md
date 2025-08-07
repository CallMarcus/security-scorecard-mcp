/asi/details/threat-actor/{threatActor}


=========================================

get https://api.securityscorecard.io/asi/details/threat-actor/{threatActor}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

threatActor

string

required

Response

200

Threat Actor Details


=============================

Response body

object

title

string

Threat Actor Name

origin

string

description

string

aka

array of strings

Also known as

aka

insights

array of strings

Insights

insights

industries

array of strings

Commonly targeted industries

industries

entities

array of strings

Commonly targeted entities

entities

iocs

array of objects

Indicators of Compromise

iocs

object

description

string

IoC Description

type

string

IoC Type

source

string

IoC source link

lastUpdate

string

Last update

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_asi-details-threat-actor-threatactor)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/asi/details/threat-actor/threatActor \\

3

     \--header 'accept: \*/\*'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

\*/\*

200

Updated about 2 months ago

* * *

Did this page help you?

Yes

No