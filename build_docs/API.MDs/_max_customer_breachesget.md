/max/customer/breaches
======================

get https://api.securityscorecard.io/max/customer/breaches

Gets breaches for the current customer

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

triaged

string

Filter findings that are set to be triaged

truetruefalse

report

string

Filter findings that are set to be reported

truetruefalse

vendor\_id

uuid

Vendor ID filter, accepts single value or comma separated list of vendor ids

vendor\_domain

string

Vendor domain filter, accepts single value or comma separated list of vendor domains

vendor\_name

string

Vendor name filter, accepts single value or comma separated list of vendor names

published\_at

string

Published date filter, accept stringified object with date value and operator

recent\_only

string

Set true to get just recently triaged breaches along with the not triaged ones

truetruefalse

search

string

Word or phrase to search records for

sort

string

Stringified object with value for column to order by and operator

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

Headers

version

string

API version header

Responses

200

Breaches list for the given filters


============================================

Response body

object

entries

array of objects

required

entries\*

object

vendor\_id

string

required

vendor identifier

vendor\_domain

string

required

domain of the vendor

vendor\_name

string

required

name of the vendor

customers

array of objects

required

customers\*

object

id

string

required

id of the customer

domain

string

required

domain of the customer

name

string

required

name of the customer

report

boolean

required

is reported

triaged

boolean

required

is triaged

is\_active\_breach

boolean

required

vendor has breach

edited\_at

string

required

last edition of report or trigger fields

breach\_id

string

required

breach identifier

description

string

required

description of the breach

link

string

required

source URL of the breach

published\_date

date

required

published date of the breach

size

integer

required

The number of records to be returned per page

page

integer

required

The page number to be returned

total

integer

required

The total number of records matching the given query

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-customer-breaches)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/customer/breaches \\

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