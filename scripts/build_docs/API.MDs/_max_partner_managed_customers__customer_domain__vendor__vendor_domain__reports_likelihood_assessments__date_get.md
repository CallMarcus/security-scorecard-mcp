/max/partner/managed-customers/{customer\_domain}/vendor/{vendor\_domain}/reports/likelihood-assessments/{date}
===============================================================================================================

get https://api.securityscorecard.io/max/partner/managed-customers/{customer\_domain}/vendor/{vendor\_domain}/reports/likelihood-assessments/{date}

V2 API to get last Likelihood Assessment Report by scorecard and effective date

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

customer\_domain

string

required

Scorecard

vendor\_domain

string

required

Scorecard

date

string

required

The effective date in the format YYYY-MM-DD

Headers

version

string

API version header

Responses

200

Likelihood Assessment Summary Report


=============================================

Response body

object

request\_id

string

Unique identifier for the request

score

object

required

start

number

required

Initial score

end

number

required

End score

rating

string

required

Rating type

rating\_breakdown

array of objects

required

rating\_breakdown\*

object

info\_security\_objective

string

required

Information Security Objective

score

number

required

Score

rating

string

required

Rating

rating\_breakdown\_info

array of objects

required

rating\_breakdown\_info\*

object

info\_security\_objective

string

required

Information Security Objective

info\_security\_activity

string

required

Information Security Activity

score

number

required

Score

rating

string

required

Rating

enhance\_information\_security\_activity

array of objects

required

enhance\_information\_security\_activity\*

object

info\_security\_activity

string

required

Information security activity

info\_security\_objective

string

required

Information security objective

recommendation

string

required

Recommendation

criticality

string

required

Criticality

current\_information

array of objects

required

current\_information\*

object

title

string

required

title of the issue type

key

string

required

key of the issue type

findings\_count

number

Finding count

ransomware\_and\_data\_breach\_incidents

array of objects

required

ransomware\_and\_data\_breach\_incidents\*

object

severity

string

required

Current information

no\_of\_issues

number

required

Current information

indicator\_key

string

required

indicator key

information\_security\_indicator

string

required

Information security indicator

suspicious\_activity

array of objects

required

suspicious\_activity\*

object

severity

string

required

Severity

no\_of\_issues

number

required

No of issues

indicator\_key

string

required

indicator key

information\_security\_indicator

string

required

Information security indicator

exposed\_services\_to\_investigate

array of objects

required

exposed\_services\_to\_investigate\*

object

severity

string

required

Severity

no\_of\_issues

number

required

No of issues

indicator\_key

string

required

indicator key

information\_security\_indicator

string

required

Information security indicator

vulnerabilities\_to\_address

array of objects

vulnerabilities\_to\_address

object

cve\_nvd\_severity

string

required

Current information

no\_of\_vulnerabilities

number

required

Current information

no\_of\_cisa\_known\_vulnerabilities

number

required

Information security indicator

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_max-partner-managed-customers-customer-domain-vendor-vendor-domain-reports-likelihood-assessments-date)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/max/partner/managed-customers/customer\_domain/vendor/vendor\_domain/reports/likelihood-assessments/date \\

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