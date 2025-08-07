get metadata for the factors used when scoring com
==================================================

get https://api.securityscorecard.io/metadata/factors

get metadata for the factors used when scoring companies

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Response

200

List of FactorMetadata


===============================

Response body

object

entries

array of objects

required

entries\*

object

key

string

required

name

string

required

human-readable name

description

string

required

human-readable name

long\_description

string

long explanation of the factor

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_metadata-factors-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/metadata/factors \\

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