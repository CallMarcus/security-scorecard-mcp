Send new feedback on findings from a specific issu
==================================================

post https://api.securityscorecard.io/companies/{domain}/issues/{type}/feedback/

Send new feedback on findings from a specific issue type

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

company domain

type

string

required

issue type

Body Params

feedback info

issue\_ids

array of strings

required

issues ids to be refuted

issue\_ids\*

ADD string

feedback\_type

string

required

type of refutation, it could be one of the following:

*   'technical\_remediation': I have fixed this
*   'compensating\_control': I have a compensating control
*   'misattribution': This is not my IP or domain
*   'false\_positive': I cannot reproduce this issue and I think it's incorrect

Note: additional feedback types might be introduced in the future.

comment

string

an additional comment provided by the creator of this feedback

Response

201

No response body

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_companies-domain-issues-type-feedback-1)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/companies/domain/issues/type/feedback/ \\

3

     \--header 'content-type: application/json'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No