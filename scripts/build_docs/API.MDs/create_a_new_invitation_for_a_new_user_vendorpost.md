create a new invitation for a new user/vendor
=============================================

post https://api.securityscorecard.io/invitations

create a new invitation for a new user/vendor

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

user/vendor invitation info

email

string

required

first\_name

string

required

last\_name

string

required

target\_url

string

optional url to take the invitee to when arriving to the platform. if specified, must be an internal route and only some routes are allowed for security reasons (please validate this in advance, or value could be ignored)

message

string

required

extra messaging for the invitee

branding\_url

string

branding logo url

domain

string

the invited company domain

grade\_to\_maintain

string

minimum grade that an inviter requests an organization to maintain

days\_to\_resolve\_issue

integer

minimum days to resolve a scorecard issue

sendme\_copy

boolean

whether we should send a copy to the requesting user

truefalse

notify\_inviter

boolean

Defaults to true

whether we should notify to invert user

truefalse

skip\_notifications

boolean

whether we should send skip the notification

truefalse

cc\_requester

boolean

CC the inviter on the email

truefalse

sender\_email

string

Email of the user requesting the invite

sender\_domain

string

Domain of the user requesting the invite

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

[Log in to use your API keys](/login?redirect_uri=/reference/post_invitations-1)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/invitations \\

3

     \--header 'content-type: application/json' \\

4

     \--data '

5

{

6

  "notify\_inviter": true

7

}

8

'

RESPONSE

Click `Try It!` to start a request and see the response here!

Updated about 2 months ago

* * *

Did this page help you?

Yes

No