Create a custom scorecard
=========================

post https://api.securityscorecard.io/custom-scorecards

Create a custom scorecard

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

custom scorecard data

name

string

required

name of the custom scorecard

description

string

description of the custom scorecard

managed\_by

string

specify edit access levels of private (me only), team, or company

share\_with

string

specify who can access this scorecard, if company wide or public to anyone in the platform

visibility\_level

string

specify who can see this scorecard, if private, company or public in the platform

team\_id

string

unique identifier of the team that manages a custom scorecard

sources

array of strings

required

Source Scorecards list

sources\*

ADD string

filters

object

required

filters object

Response

200

response for creating a custom scorecard


=================================================

Response body

object

id

uuid

required

custom scorecard id

uuid

uuid

required

uuid to identify custom scorecard

name

string

required

name of the custom scorecard

description

string

description of the custom scorecard

managed\_by

string

specify edit access levels of private (me only), team, or company

share\_with

string

specify who can access this scorecard, if company wide or public to anyone in the platform

visibility\_level

string

specify who can see this scorecard, if private, company or public in the platform

team\_id

string

unique identifier of the team that manages a custom scorecard

owned\_by

string

specify who owns the custom scorecard, only when managedBy value is private

is\_entity

boolean

has\_write\_permissions

boolean

The user has permissions to modify the custom scorecard

customer\_id

string

required

the organization id of the user who created the custom scorecard

base

array of objects

required

collection of parent scorecards whose digital footprints were filtered in order to create a custom scorecard

base\*

object

domain

string

domain of the custom scorecard

name

string

name of the custom scorecard

grade

string

grade of the custom scorecard

score

integer

score of the custom scorecard

filter

object

required

base footprint filters that make up a custom scorecard

ips

array of strings

required

collection of footprint ip filters

ips\*

domains

array of strings

required

collection of footprint domain filters

domains\*

countries

array of strings

collection of footprint country filters

countries

filter\_toggle\_setting

string

filter toggle setting

bulk

array of objects

optional footprint filters loaded in bulk from a file (CSV)

bulk

object

filename

string

required

name of the file used to load this bulk

excludes

boolean

true to exclude assets matching bulk filters (defaults to false, meaning, to include)

ips

array of strings

collection of footprint ip filters

ips

domains

array of strings

collection of footprint domain filters

domains

created

date-time

required

created date

created\_by

string

required

user who created the custom scorecard

updated\_at

date-time

updated date

updated\_by

string

user who last updated the custom scorecard

grade

string

grade of the custom scorecard

score

number

score of the custom scorecard

provisional

boolean

true if a custom scorecard was scored by Fast Score

version

number

required

Version number of Recipe field

sources

array of strings

required

Source Scorecards list

sources\*

filters

object

required

includes

array of objects

list of include filters to include

includes

object

index

number

index of the filter

include

array of objects

list of footprint filters to include

include

object

index

number

index of the filter

condition

string

condition to apply to the filter

ip

array of strings

list of footprint ips filters to add

ip

domain

array of strings

list of footprint domains filters to add

domain

country

array of strings

list of footprint countries filters to add

country

footprint\_tags

array of strings

list of footprint tags filters to add

footprint\_tags

associated\_assets

array of strings

condition to apply to the filter

associated\_assets

excludes

array of objects

list of footprint filters to exclude

excludes

object

index

number

index of the filter

condition

string

condition to apply to the filter

ip

array of strings

list of footprint ips filters to add

ip

domain

array of strings

list of footprint domains filters to add

domain

country

array of strings

list of footprint countries filters to add

country

footprint\_tags

array of strings

list of footprint tags filters to add

footprint\_tags

associated\_assets

array of strings

condition to apply to the filter

associated\_assets

issues

object

list of issues to filter

issues object

Updated 25 days ago

* * *

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/post_custom-scorecards)

cURL Request

Examples

xxxxxxxxxx

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/custom-scorecards \\

3

     \--header 'accept: application/json' \\

4

     \--header 'content-type: application/json'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json

200

Updated 25 days ago

* * *

Did this page help you?

Yes

No