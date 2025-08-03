/asi/search


=============

post https://api.securityscorecard.io/asi/search

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Body Params

query

string

search query

sort

string

values for ipv4 index are: \[scan\_date, max\_cvss\_score, min\_scorecard\_grade, \_score, avd\_grade, city, cloud\_provider, cloud\_region, country\_name, has\_cve, has\_cve\_been\_exploited, has\_infection, has\_malhash, has\_malrep, has\_ransomware, has\_scorecard, has\_screenshot, has\_ssl\_cert, has\_threatactor, hostname, max\_cvss\_score, min\_scorecard\_grade, postal, scan\_time (default), ssl\_is\_certificate\_chain\_valid, state\] for leaked Credentials are: \[\_score (default), has\_ransomware\]

sortDir

string

asc or desc

page

number

Defaults to 0

Search result page number

index

string

Defaults to ipv4

search index to query

parser

string

Defaults to structured

Search query parser. Options are: simple, structured, lucene, dismax

size

number

Defaults to 10

Size of the search resultset page

cursor

string

Cursor identifier (or 'initial' for first request) needed to paginate over more than 10k results

Response

200

Search results


=======================

Response body

object

facets

object

countries

array of objects

countries

object

name

string

value

number

threatActors

array of objects

threatActors

object

name

string

value

number

cves

array of objects

cves

object

name

string

value

number

ports

array of objects

ports

object

name

string

value

number

products

array of objects

products

object

name

string

value

number

orgs

array of objects

orgs

object

name

string

value

number

hits

array of objects

hits

object

detectedLibraries

array of strings

Crawling detected libraries Name

detectedLibraries

time

string

Scan time

cloud

string

Cloud service

cloudRegion

string

Cloud region

hasMalrep

boolean

has bad reputation

maliciousReputation

array of strings

Malicious reputation

maliciousReputation

hasCVE

boolean

has a CVE

cves

array of strings

List of CVEs associated

cves

maxCVSS

number

Max CVSS in the CVEs

cvss

array of strings

list of CVSS

cvss

deviceType

array of strings

Device Type

deviceType

hasRansomware

boolean

has ransomware

ransomwareVictims

array of strings

Ransomware

ransomwareVictims

ransomwareGroups

array of strings

Ransomware groups

ransomwareGroups

hasSSLCert

boolean

has an SSL certificate

ports

array of strings

Open ports

ports

services

array of strings

Services running

services

minGrade

string

Minimum Scorecard Grade

hostnames

array of strings

Hostnames associated to this IP

hostnames

hasScorecard

boolean

has a Scorecard associated

products

array of strings

Products running on this host

products

country

string

Country

organizations

array of strings

Organizations associated to this Ip

organizations

hasCVEExploited

boolean

has a CVE Exploited

ips

array of strings

IPs associated to this host

ips

sslValid

boolean

SSL Certificate Chain is Valid

hasThreatActor

boolean

has a Threat Actor Campaign associated

threatActors

array

List of threat actors

threatActors

hasInfection

boolean

has a infection

infections

array of strings

Active Infections

infections

countryCode

string

Country Code

industries

array of strings

Industries associated

industries

cpe

string

cpe

dnsRecords

array of strings

Crawling DNS Records Types

dnsRecords

grade

string

Current Scorecard Grade

mainAttribution

array

Primary attribution details

mainAttribution

detectedLibraryVersion

string

Crawling detected library version

domains

array of strings

Attributed domains

domains

osTypes

array of strings

Types of Operative Systems

osTypes

id

string

IP

found

number

Amounts of documents found

isError

boolean

True if error, false otherwise

errorType

string

Type of error

errorMessage

string

Error message

errorCode

number

HTTP status code of error if error is True

cursor

string

Cursor identifier to paginate over more than 10k results

Updated about 2 months ago

* * *

What’s Next

*   [/asi/facets](/reference/post_asi-facets)

Did this page help you?

Yes

No

Language

ShellNodeRubyPHPPython

Credentials

Header

Header

[Log in to use your API keys](/login?redirect_uri=/reference/post_asi-search)

cURL Request

Examples

xxxxxxxxxx

12

1

curl \--request POST \\

2

     \--url https://api.securityscorecard.io/asi/search \\

3

     \--header 'accept: \*/\*' \\

4

     \--header 'content-type: application/json' \\

5

     \--data '

6

{

7

  "page": 0,

8

  "index": "ipv4",

9

  "parser": "structured",

10

  "size": 10

11

}

12

'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

\*/\*

200

Updated about 2 months ago

* * *

What’s Next

*   [/asi/facets](/reference/post_asi-facets)

Did this page help you?

Yes

No