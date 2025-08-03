/asi/facets


=============

post https://api.securityscorecard.io/asi/facets

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

names

array of strings

name of the facets to get values

names

ADD string

index

string

Defaults to ipv4

search index to query

size

number

number of elements per facet to return

Response

200

Facet elements


=======================

Response body

object

facets

object

Has additional fields

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_asi-facets)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/asi/facets \\

3

     \--header 'accept: \*/\*' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '{"index":"ipv4"}'

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