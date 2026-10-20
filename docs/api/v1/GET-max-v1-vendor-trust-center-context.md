# Trust Center context for the caller own domain

- **Method:** `GET`
- **Path:** `/max/v1/vendor/trust-center-context`
- **Tag:** `V1`
- **operationId:** `getV1VendorTrustCenterContext`

## Description
Answers whether MAX currently manages the caller's own domain as a vendor. Consumed by the Trust Center UI through the ssc-platform-api proxy. The caller is the vendor's own organization, which is neither a MAX partner nor a managed customer, so the endpoint answers only about the domain in the caller's JWT and rejects any other domain with 403. It reports the predicate and nothing more: naming the customers that monitor the vendor would disclose those customers' portfolios to a third party. Do not widen this lane.

## Query Parameters
- `domain` (**required**, string) — Vendor domain to describe, for example acme.com

## Responses
### 200
Whether MAX manages the caller own domain as a vendor
```json
{
  "type": "object",
  "properties": {
    "is_max_vendor": {
      "type": "boolean",
      "description": "True when some MAX partner currently manages this domain"
    }
  },
  "required": [
    "is_max_vendor"
  ],
  "additionalProperties": false
}
```
### 400
Bad request - the domain parameter is missing or empty
### 401
Unauthorized - the credentials presented are not valid
### 403
Forbidden - the domain is not the caller own
### 404
Not found - the Trust Center feature is off

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/vendor/trust-center-context' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

