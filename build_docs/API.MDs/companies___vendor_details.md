Find followed companies


=========================

get https://api.securityscorecard.io/all-companies

Searches followed companies by any of the allowed fields. Results are paginated.

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Query Params

domain

string

Filter by followed company domain

name

string

Filter by company name

tags

array of strings

Filter by custom tag name

tags

ADD string

tags\_criteria

string

Filter criteria when filtering by tags field

ANDOR

portfolios

array of uuids

Filter by portfolio id

portfolios

ADD uuid

portfolios\_criteria

string

Filter criteria when filtering by portfolios field

ANDOR

monitored

boolean

Filter by monitored/non-monitored only

truefalse

business\_impact

array of strings

Filter by business impact

business\_impact

ADD string

lifecycle\_status

array of strings

Filter by lifecycle status

lifecycle\_status

ADD string

data\_types\_shared

array of strings

Filter by data types shared

data\_types\_shared

ADD string

risk

array of strings

Filter by risk

risk

ADD string

business\_unit

array of strings

Filter by business unit

business\_unit

ADD string

contract\_end\_date\_from

date

Filter by contract end date from YYYY-MM-DD

contract\_end\_date\_to

date

Filter by contract end date to YYYY-MM-DD

internal\_contact

string

Filter by internal contact email

sort

string

Sort by any of the allowed fields. Use "-" for DESC order. Default sort by added\_date DESC.

domain\-domainname\-nameadded\_date\-added\_datemonitored\-monitoredbusiness\_impact\-business\_impactlifecycle\_status\-lifecycle\_statusrisk\-riskbusiness\_unit\-business\_unitcontract\_end\_date\-contract\_end\_date

page

integer

Current page (zero-based)

page\_size

integer

10 to 100

Defaults to 20

Results per page

Responses

200

Successful operation


=============================

Response body

object

entries

array of objects

entries

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

page

integer

Current page (zero-based)

size

integer

Total number of records

400

Bad request

Updated 11 days ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/findfollowedcompanies)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url 'https://api.securityscorecard.io/all-companies?page\_size=20' \\

3

     \--header 'accept: application/json; charset=utf-8'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

200

Updated 11 days ago

* * *

Did this page help you?

Yes

No