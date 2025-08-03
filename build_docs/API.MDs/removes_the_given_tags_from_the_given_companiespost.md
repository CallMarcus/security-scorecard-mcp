Removes the given tags from the given companies


=================================================

post https://api.securityscorecard.io/scorecard-tags/all-companies/bulk-delete

Removes the given tags from the given companies.

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

List of domains of followed companies and list of tag ids

domains

array of strings

domains

ADD string

tag\_ids

array of uuids

tag\_ids

ADD uuid

Responses

200

Successful operation


=============================

Response body

object

count

integer

Count of domains affected.

400

Bad request

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

[Log in to use your API keys](/login?redirect_uri=/reference/executecustomtagsfollowedcompaniesbulkdeleteoperation)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/scorecard-tags/all-companies/bulk-delete \\

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