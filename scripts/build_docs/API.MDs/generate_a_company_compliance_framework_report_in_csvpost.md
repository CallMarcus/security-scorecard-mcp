Generate a Company Compliance Framework Report in CSV
=====================================================

post https://api.securityscorecard.io/reports/compliance/csv/export

This endpoint generates a compliance framework report for a company in CSV format.

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

report creation parameters

name

string

required

The name of the report (e.g., DORA).

domain

string

required

The domain of the company for which the report is being generated.

metricId

string

required

The metric ID representing the framework (e.g., DORA.framework).

Responses

200

CSV file containing the compliance framework report

403

The company must be added to a portfolio before generating a report.

404

The specified company does not have a scorecard. Add the company to a portfolio to initiate scoring.

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_reports-compliance-csv-export)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/reports/compliance/csv/export \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No