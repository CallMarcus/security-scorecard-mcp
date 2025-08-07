Generate a Company Detailed report
==================================

post https://api.securityscorecard.io/reports/detailed

Note: requesting a report for a company where score is still calculating will be accepted, but might fail to generate if a score is not determined soon enough. It's recommended to check a score is available before requesting a report

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

report creation parameters

scorecard\_identifier

string

required

primary identifier of a company or scorecard

branding

string

note: white-labeling has to be enabled for your account

*   `securityscorecard` (default) = reports are only displaying SecurityScorecard's logo
*   `company_and_securityscorecard` = your company's logo will be used in conjunction with Security Scorecard's.
*   `company` = reports are only displaying your company's logo

securityscorecardcompany\_and\_securityscorecardcompany

Responses

200

a reference to the created report


==========================================

Response body

object

id

string

View Additional Properties

403

company must be added to a portfolio first.

404

company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_reports-detailed-1)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/reports/detailed \\

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