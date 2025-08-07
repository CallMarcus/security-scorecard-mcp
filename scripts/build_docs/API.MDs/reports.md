/max/partner/reports
====================

get https://api.securityscorecard.io/max/partner/reports

Get a list of generated reports

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

search

string

Word or phrase to search records for

sort

string

Sort reports by providing a JSON string representing an array of objects; each object should include "id" for the column to sort by and "desc" as a boolean indicating descending (true) or ascending (false) order.

page

integer

optionally specify which page of results to return

limit

integer

≤ 1500

optionally specify how many results to return, maximum is 1500

filter

string

Used to filter report data by applying one or more conditions. Accepts a URL-encoded JSON array where each object defines a filter with keys: 'operator', 'id', 'value', and 'type'. For example, to filterreports by a specific customer name, use an object like {"operator": "eq", "id": "customer\_name", "value": \["example.com"\], "type": "multiValue"}.

Headers

version

string

API version header

Responses

200

Successful response containing a list of generated reports for managed services


========================================================================================

Response body

object

entries

array of objects

required

Array of report objects

entries\*

object

id

string

required

Unique identifier for the report

name

string

Name of the report

description

string

Description of the report

created\_by

string

required

Identifier of the user who created the report

created\_at

date-time

required

Timestamp when the report was created

updated\_at

date-time

required

Timestamp when the report was last updated

updated\_by

string

required

Identifier of the user who last updated the report

vendor

string

required

Vendor associated with the report

customer

string

required

Customer associated with the report

vendor\_name

string

required

Name of the vendor

business\_impact

string

Business impact rating of the report

incident\_likelihood

string

Incident likelihood rating of the report

customer\_name

string

required

Name of the customer

is\_published

boolean

Indicates whether the report is published

published\_at

date-time

Timestamp when the report was published

published\_by

string

Identifier of the user who published the report

page

integer

required

The page number to be returned

size

integer

required

The number of all records

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-reports)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/reports \\

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