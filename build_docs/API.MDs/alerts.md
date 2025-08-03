get all notifications from latest 7 days
========================================

get https://api.securityscorecard.io/users/by-username/{username}/notifications/recent

get all notifications from latest 7 days

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

username

string

required

username the notifications' owner

Query Params

portfolio

string

filter notifications by portfolio id

sort

string

sort notifications by unread status or date

order

string

specify the order of sorting, asc or desc

unread

boolean

Wether to filter by read or unread notifications

truefalse

page\_size

number

page size

Response

200

A page in a list of Notifications


==========================================

Response body

object

entries

array of objects

required

entries\*

object

id

string

required

the notification id

username

string

required

owner of notification

priority

boolean

the notification priority

is\_alert\_for\_rule\_owner

boolean

flag that indicates if the notification was from a user workflow rule

change\_type

string

required

the notification change type

alert\_settings

array of strings

array of ids of the alert settings that caused the creation of this notification

alert\_settings

domain

string

required

the domain identifying the company associated to the change/event that happened.

last\_logged\_in

string

last time contact logged in

company\_name

string

required

portfolios

array of objects

portfolios

object

id

string

required

portfolio id

name

string

required

portfolio name

my\_scorecard

boolean

indicates user own scorecard should be monitored

platform\_score\_date

string

the date (YYYYMMDD) the event was detected

created\_at

date-time

required

creation datetime

read

date-time

notification read datetime

processed\_on

date-time

notification processed datetime

processed\_by

object

when a notification has an additional action, processedBy stores the data of the user who completed the notification action

processed\_by object

change\_data

array of objects

required

change\_data\*

object

direction

string

score

number

the company score

grade\_letter

string

the grade letter associated to the score

factor

string

score\_impact

number

View Additional Properties

category

string

notification category: standard, prioritized, queued, or customer\_contacts

page

integer

required

size

integer

required

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_users-by-username-username-notifications-recent-1)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/users/by-username/username/notifications/recent \\

3

     \--header 'accept: application/json; charset=utf-8'

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