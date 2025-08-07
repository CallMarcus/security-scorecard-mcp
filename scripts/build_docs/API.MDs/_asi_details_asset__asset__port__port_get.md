/asi/details/asset/{asset}/port/{port}


========================================

get https://api.securityscorecard.io/asi/details/asset/{asset}/port/{port}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

asset

string

required

port

number

required

Response

200

Port Details


=====================

Response body

object

title

string

UI title

port

number

Port number

service

string

Service found on this port

product

string

Product detected on this port

version

string

Product version detected

scripts

string

Output of the scripts scanning this port

firstSeen

string

First time the port was detected

lastSeen

string

Last time the port was seen opened

device

string

Device type detected

os

string

Operating system detected

cpe

array of strings

CPE strings associated with this port

cpe

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_asi-details-asset-asset-port-port)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/asi/details/asset/asset/port/port \\

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