Update followed company by domain


===================================

patch https://api.securityscorecard.io/all-companies/{domain}

Updates any of the followed company allowed fields.

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

Body Params

The followed company allowed fields.

business\_impact

string

Business impact of the company. One of low, medium, high, critical, none

lowmediumhighcriticalnone

lifecycle\_status

string

Status of the company in the company lifecycle. One of new, assess, respond, monitor

newassessrespondmonitor

data\_types\_shared

array of strings

data\_types\_shared

ADD string

risk

string

Riskiness of the company. One of low, medium, high, critical, none

lowmediumhighcriticalnone

business\_unit

string

Business unit that manages the relationship with the company. One of product, engineering, HR, finance, legal, compliance, sales, marketing, IT, R&D, other

productengineeringHRfinancelegalcompliancesalesmarketingITR&Dother

contract\_end\_date

date-time

Date on which the company's contract ends

vendor\_id

string

Customer internal ID assigned to the company

internal\_contact

string

Customer internal user email who maintain the relationship with the company

Responses

200

Successful operation


=============================

Response body

object

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

Not Found

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

[Log in to use your API keys](/login?redirect_uri=/reference/updatefollowedcompanybydomain)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request PATCH \\

2

     \--url https://api.securityscorecard.io/all-companies/domain \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json'

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