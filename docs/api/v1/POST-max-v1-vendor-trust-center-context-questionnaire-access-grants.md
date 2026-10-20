# Auto-grant the caller's questionnaire evidence at publish

- **Method:** `POST`
- **Path:** `/max/v1/vendor/trust-center-context/questionnaire-access-grants`
- **Tag:** `V1`
- **operationId:** `postV1VendorTrustCenterContextQuestionnaireAccessGrants`

## Description
Creates a domain-wide custom access on each of the given evidence items for every customer that currently manages the caller's own domain (decision D18). The caller picks the items: max-api has no view of which documents the Trust Center draft marks visible. Runs under the caller's own JWT, forwarded to aegis, so the grant is the vendor granting on its own evidence — the managing customer domains never reach the browser. Each (item, domain) pair is independent, idempotent, and reported separately; a failed pair never rolls back the others.

## Request Body
```json
{
  "type": "object",
  "properties": {
    "domain": {
      "type": "string",
      "description": "Vendor's own domain. Must match the caller's JWT, like the context lane above."
    },
    "evidence_ids": {
      "type": "array",
      "description": "Aegis evidence-locker ids of the visible questionnaire-category items to grant access to",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "domain",
    "evidence_ids"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
One outcome per (evidence item, managing domain) pair
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "evidence_id": {
            "type": "string"
          },
          "domain": {
            "type": "string",
            "description": "Managing-customer domain the grant targeted"
          },
          "success": {
            "type": "boolean"
          }
        },
        "required": [
          "evidence_id",
          "domain",
          "success"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
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
curl -X POST \
  'https://api.securityscorecard.io//max/v1/vendor/trust-center-context/questionnaire-access-grants' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

