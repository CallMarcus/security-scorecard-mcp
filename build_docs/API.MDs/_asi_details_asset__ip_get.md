/asi/details/asset/{ip}


=========================

get https://api.securityscorecard.io/asi/details/asset/{ip}

Log in to see full request history

time

status

user agent

Make a request to see history.

#### URL Expired

The URL for this request expired after 30 days.

Path Params

ip

string

required

Response

200

IP Full Details


========================

Response body

object

location

object

hostname

string

Hostname resolution

country\_name

string

Country

country\_code

string

Country Code

city\_name

string

City

cloud

string

Cloud provider

region

string

Cloud region

cidr

string

CIDR

attribution

object

companies

array of objects

List of companies attributed to this asset

companies

object

company

string

Company name

domain

string

domain

scorecard

string

Scorecard id

score

number

SSC score

industry

string

Industry

libraries

number

Libraries Count

malrep

object

maliciousReputation

array of objects

maliciousReputation

object

info

string

Name of the malicious reputation

last\_seen

string

Last time observed

ports

object

ports

array of objects

list of open ports in the asset

ports

object

last\_seen

string

scan time

port

string

port number

product

string

product running on the port

service

string

service detected on port

device\_type

string

Device type

os\_type

string

Os Type

cpe

array of strings

CPEs

cpe

ransomware

object

ransomwareList

array of objects

Ransomware list

ransomwareList

object

name

string

Ransomware name

victim\_name

string

Victim name

victim\_posted\_domain

string

Domain associated to victim

last\_seen

string

Time when ransomware was detected

threat\_actors

object

actors

array of objects

Threat actors associated to this asset

actors

object

actor

string

Threat Actor name

origin

string

Origin

link\_type

string

link type (cve, malware... etc)

link

string

Vulnerabilities associated to this threat actor

last\_seen

string

Last detection

certs

object

certificates

array of objects

certificates

object

hash

string

Certificate Hash

status

string

Certificate Status

domain

string

Domain associated

cves

object

cves

array of objects

list of CVEs

cves

object

cvss

number

CVSS score

cve

string

CVE Id

maturity

string

Exploit Maturity

actor

string

Threat actors using this CVE

port

number

Port associated with the CVE

last\_seen

string

Last detection time

infections

object

activeInfections

array of objects

activeInfections

object

family

string

Infection family

category

string

Infection category

last\_seen

string

Last time observed

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

[Log in to use your API keys](/login?redirect_uri=/reference/get_asi-details-asset-ip)

cURL Request

xxxxxxxxxx

1

curl \--request GET \\

2

     \--url https://api.securityscorecard.io/asi/details/asset/ip \\

3

     \--header 'accept: \*/\*'

RESPONSE

Examples

Click `Try It!` to start a request and see the response here! Or choose an example:

\*/\*

200

Updated about 2 months ago

* * *

Did this page help you?

Yes

No