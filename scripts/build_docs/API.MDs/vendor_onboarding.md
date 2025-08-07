/max/partner/vendor-onboarding/add-vendor-domains/{domain\_or\_portfolio\_id}
=============================================================================

post https://api.securityscorecard.io/max/partner/vendor-onboarding/add-vendor-domains/{domain\_or\_portfolio\_id}

Add vendor domains via JSON

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

domain\_or\_portfolio\_id

string

required

Portfolio or domain identifier

Query Params

local\_portfolio\_id

string

Local portfolio identifier

Body Params

vendor\_list

array of objects

required

List of vendors risk profiles

vendor\_list\*

ADD object

Headers

version

string

API version header

Responses

200

Add vendor domains result


==================================

Response body

object

customer\_id

string

required

Identifier

managed\_portfolio\_id

string

required

Identifier

local\_portfolio\_ids

array of strings

local\_portfolio\_ids

added\_vendors

array of objects

required

added\_vendors\*

object

domain

string

required

company\_name

string

required

business\_impact

string

The effect a vendor breach would have on the organization.

tier

string

The level of service provided for the vendor.

custom\_tags

array of strings

Extra tags to label and organize the vendor.

custom\_tags

incident\_likelihood

string

The chance of the vendor having a breach.

engagement

string

The status of the latest score or factor changes of the vendor.

assessment\_scheduled\_at

date

The date of the next vendor assessment.

updated\_vendors

array of objects

required

updated\_vendors\*

object

domain

string

required

company\_name

string

required

business\_impact

string

The effect a vendor breach would have on the organization.

tier

string

The level of service provided for the vendor.

custom\_tags

array of strings

Extra tags to label and organize the vendor.

custom\_tags

incident\_likelihood

string

The chance of the vendor having a breach.

engagement

string

The status of the latest score or factor changes of the vendor.

assessment\_scheduled\_at

date

The date of the next vendor assessment.

ignored\_domains

array of objects

ignored\_domains

object

domain

string

index

number

required

errors

array of strings

required

errors\*

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_max-partner-vendor-onboarding-add-vendor-domains-domain-or-portfolio-id)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/max/partner/vendor-onboarding/add-vendor-domains/domain\_or\_portfolio\_id \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json'

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