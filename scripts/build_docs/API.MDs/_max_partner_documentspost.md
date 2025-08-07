/max/partner/documents
======================

post https://api.securityscorecard.io/max/partner/documents

Upload a document.

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

description

string

description of the document

associatedVendorIds

string

Array of associated vendor IDs (sent as a JSON-stringified array in form-data)

customerId

string

required

customer id

file

file

required

document file

Headers

version

string

API version header

Responses

201

A document id.


=======================

Response body

object

id

uuid

required

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_max-partner-documents)

cURL Request

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/max/partner/documents \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: multipart/form-data'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

201400401403404429

Updated 1 day ago

* * *

Did this page help you?

Yes

No