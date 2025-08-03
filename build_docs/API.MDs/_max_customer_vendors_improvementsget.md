/max/customer/vendors-improvements
==================================

get https://api.securityscorecard.io/max/customer/vendors-improvements

Returns the customer vendors grouped by their status on vendor improvement

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Headers

version

string

API version header

Responses

200

Customer vendors grouped by their status on vendor improvement


=======================================================================

Response body

object

vendors\_doing\_well

object

required

Vendors trend metadata

count

number

required

Total number of vendors in the trend

percentage

number

required

Percentage of vendors in the trend

vendors\_improved

object

required

Vendors trend metadata

count

number

required

Total number of vendors in the trend

percentage

number

required

Percentage of vendors in the trend

vendors\_didnt\_improve

object

required

Vendors trend metadata

count

number

required

Total number of vendors in the trend

percentage

number

required

Percentage of vendors in the trend

vendors\_worsened

object

required

Vendors trend metadata

count

number

required

Total number of vendors in the trend

percentage

number

required

Percentage of vendors in the trend

vendors\_first\_assessment

object

required

Vendors trend metadata

count

number

required

Total number of vendors in the trend

percentage

number

required

Percentage of vendors in the trend

400

Bad Request


====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 400

401

Unauthorized


=====================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 401

403

Forbidden


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 403

404

Not Found


==================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 404

429

Too Many Requests


==========================

Response body

object

error

object

message

string

required

Human readable message, suitable for showing in some UI

statusCode

integer

required

Defaults to 429

Updated 1 day ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-customer-vendors-improvements)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/customer/vendors-improvements \\

3

     \--header 'accept: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No