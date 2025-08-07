Download a generated report
===========================

get https://api.securityscorecard.io/reports/files/{file\_path}

Note: this endpoint should not be used directly. The URL, to be used, is provided in the GET /reports/recent response.

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

file\_path

string

required

a path to the file

Query Params

lng

string

language in which you want to download the generated report (beware available languages might depend on the report type, this can be confirmed viewing an example generated report in our platform)

en-USes-ESpt-BRpt-PTde-DEfr-FRja-JPzh-CNzh-TW

Response

200

Return the generated report in the requested language

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_reports-files-file-path-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/reports/files/file\_path

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No