# Add companies in bulk to a portfolios

- **Method:** `PUT`
- **Path:** `/portfolios/companies/bulk-upload`
- **Category:** `companies`
- **Operation ID:** `put_portfolios-companies-bulk-upload`

## Description

Add companies in bulk to a portfolios

## Query Parameters

- `auth_mechanism` (string, Optional) - propaged auth mechanism to distinguish platform requests and API integrations

## Request Body

```json
{
  "type": "object",
  "properties": {
    "portfolios": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "list of portfolio IDs"
    },
    "companies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "company domains"
    },
    "bulkInvite": {
      "type": "boolean",
      "description": "t/f if the upload was created via csv bulk upload"
    },
    "tagType": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "portfolios",
    "companies"
  ]
}
```

## Responses

### 201
No response body

## Example Request

```bash
curl -X PUT \
  'https://platform.securityscorecard.io/portfolios/companies/bulk-upload' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
