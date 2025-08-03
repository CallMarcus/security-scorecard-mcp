Get all the domains for the parent domain
=========================================

post https://api.securityscorecard.io/parent-domains/{parentDomain}/domains

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

parentDomain

string

required

parent domain

Body Params

filters, sorting and pagination

filters

array of objects

filters

ADD object

sort

string

field to sort by

status\-statusfindings\-findingsissues\-issuesscoreImpact\-scoreImpactdomain\-domainipsCount\-ipsCountcriticality\-criticalityassetCategories\-assetCategoriessources\-sources

page

number

required

Defaults to 0

required page number, first page is 0

page\_size

number

required

Defaults to 50

size of the pages in the paginated result

Response

200

domain schema


======================

Response body

object

entries

array of objects

required

entries\*

object

domain

string

required

domain asset

status

string

required

status of asset

`CLAIMED` `ATTRIBUTED` `REFUTED` `UNDER_REVIEW_ADD` `UNDER_REVIEW_REMOVE`

issues

number

number of issue types associated with the asset

findings

number

number of findings associated with the asset

score\_impact

number

sum impact of issue findings associated with the asset

age

number

how long the asset has been attributed

domain\_type

string

required

type of domain

`SUBDOMAIN` `PARENT DOMAIN`

ips\_count

number

required

count of associated ips

sources\_metadata

array

metadata for data sources

sources\_metadata

first\_observed\_at

string

required

date of the first attribution

criticality

string

required

criticality of the domain asset

tags

array of objects

associated tags

tags

object

id

string

tag id

tag

string

tag name

public\_tags

array of objects

associated tags

public\_tags

object

id

string

tag id

tag

string

tag name

evidence\_sources

array of strings

data sources evidence used to associate the asset to footprint

evidence\_sources

sources

array of strings

data sources used to associate the asset to footprint

sources

asset\_categories

array of strings

asset category list

asset\_categories

assignees

object

assignees object

size

number

required

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

[Log in to use your API keys](/login?redirect_uri=/reference/postbyparentdomainassetsdomains)

cURL Request

Examples

xxxxxxxxxx

10

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/parent-domains/parentDomain/domains \\

3

     \--header 'accept: application/json; charset=utf-8' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "page": 0,

8

  "page\_size": 50

9

}

10

'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

application/json; charset=utf-8

200

Updated 25 days ago

* * *

Did this page help you?

Yes

No