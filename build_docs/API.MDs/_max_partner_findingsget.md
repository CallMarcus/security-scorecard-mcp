/max/partner/findings
=====================

get https://api.securityscorecard.io/max/partner/findings

Gets findings

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

with\_hostname

string

Set true for findings with hostname

truetruefalse

domain

string

Issue domain filter, accepts single value or comma separated list of domains

hostname\_matches

string

Set true for findings that have matching vendor domain and hostname

truetruefalse

max\_severity

string

Max Severity filter, accepts single value or comma separated list of max severities

LowLowMediumHighCritical

issue\_category

string

Category filter, accepts single value or comma separated list of issue categories

issue\_name

string

Issue type name filter, accepts single value or comma separated list of issue type names

issue\_type\_key

string

Issue type key filter, accepts single value or comma separated list of issue type keys

hostname

string

Hostname filter, accepts single value or comma separated list of hostnames

last\_seen

string

Last seen filter, accepts stringified object with date value and operator

first\_seen

string

First seen filter, accepts stringified object with date value and operator

cve\_severity

string

CVE severity filter, accepts single value or comma separated list of severities

lowlowmediumhighcritical

triaged

string

Filter findings that are set to be triaged

truetruefalse

report

string

Filter findings that are set to be reported

truetruefalse

customer\_id

uuid

Customer ID filter, accepts single value or comma separated list of customer ids

customer\_name

string

Customer name filter, accepts single value or comma separated list of customer names

customer\_domain

string

Customer domain filter, accepts single value or comma separated list of customer domains

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

Sort findings by providing a JSON string representing an array of objects; each object should include "id" for the field to sort by in camelCase and "desc" as a boolean indicating descending (true) or ascending (false) order.

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

Findings list for the given filters


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

description

string

required

description of the finding

finding\_id

string

required

an uuid of an existing finding

information

array of objects

required

Finding information of the finding

information\*

object

title

string

required

Title of the field

value

string

required

value of the field

extra\_information

array of objects

extra information fields with not empty value

extra\_information

object

title

string

required

Title of the field

value

string

required

value of the field

first\_observed\_at

date-time

required

first observed date time

last\_observed\_at

date-time

required

last observed date time

issue\_name

string

required

Issue Name

issue\_type

string

required

Issue Type

category

string

required

Max Finding category

max\_severity

string

required

Max severity

breach\_risk

string

Breach risk

threat\_level

string

Threat level

hostname

string

Asset hostname

ip\_address

string

the asset IP address

product\_name

string

Product Name

product\_version

string

Product Version

port

number

Port number

cve

object

CVE information

cve object

malware

object

Malware information

malware object

last\_breach

object

Last breach information

last\_breach object

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-findings)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/findings \\

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