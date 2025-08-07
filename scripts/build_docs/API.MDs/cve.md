/asi/details/cve/{cve}


========================

get https://api.securityscorecard.io/asi/details/cve/{cve}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

cve

string

required

Response

200

CVE Details


====================

Response body

object

title

string

CVE name

threatActors

array of strings

Threat Actors using this CVE

threatActors

weaponized

string

Weaponization maturity

description

string

Vulnerability description

cvss3

number

CVSS v3 Score

cwe

string

Associated CWE

published

string

Date Published

modified

string

Date Last Modified

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_asi-details-cve-cve)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/asi/details/cve/cve \\

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