Get followed company by domain


================================

get https://api.securityscorecard.io/all-companies/{domain}

Returns a single followed company.

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

Domain of the followed company

Responses

200

Successful operation


=============================

Response body

object

id

uuid

ID of the company

domain

string

Domain of the company

name

string

Name of the company

added\_date

date-time

Date on which the company started to be followed

tags

array of objects

Tags visible to the current user that are linked to the company

tags

object

id

uuid

name

string

portfolios

array of objects

Portfolios visible to the current user where the company belongs to

portfolios

object

id

uuid

name

string

monitored

boolean

Flag that determines if the company is monitored (belongs to at least one portfolio) or non-monitored

business\_impact

string

Business impact of the company. One of low, medium, high, critical, none

`low` `medium` `high` `critical` `none`

lifecycle\_status

string

Status of the company in the company lifecycle. One of new, assess, respond, monitor

`new` `assess` `respond` `monitor`

data\_types\_shared

array of strings

data\_types\_shared

risk

string

Riskiness of the company. One of low, medium, high, critical, none

`low` `medium` `high` `critical` `none`

business\_unit

string

Business unit that manages the relationship with the company. One of product, engineering, HR, finance, legal, compliance, sales, marketing, IT, R&D, other

`product` `engineering` `HR` `finance` `legal` `compliance` `sales` `marketing` `IT` `R&D` `other`

contract\_end\_date

date-time

Date on which the company's contract ends

vendor\_id

string

Customer internal ID assigned to the company

internal\_contact

string

Customer internal user email who maintain the relationship with the company

400

Bad request

404

Followed company not found

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

[Log in to use your API keys](/login?redirect_uri=/reference/getfollowedcompanybydomain)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/all-companies/domain \\

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