Get products by domain
======================

get https://api.securityscorecard.io/vendor-detection/{domain}/products

Returns a list of products used by the given domain

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

Domain to use

Responses

200

OK


===========

Response body

object

entries

array of objects

entries

object

domain

string

company

string

score

integer

thirty\_day\_change

integer

products\_used

integer

connections\_count

integer

connections\_percent

integer

1 to 100

page

integer

≥ 1

The current page of results

size

integer

The number of records to be returned per page

total

integer

The total number of records matching the given query

400

Bad Request

401

Unauthorized

403

Company must be added to a portfolio first

404

Company not found

default

Error Payload


==========================

Response body

object

error

object

required

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

data

object

The field that is causing the error

Has additional fields

key

string

Some string to be used for further lookup

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_vendor-detection-domain-products)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/vendor-detection/domain/products \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200default

text/html

200default

Updated about 2 months ago

* * *

Did this page help you?

Yes

No