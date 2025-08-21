# Add companies in bulk to a portfolios

- **Method:** `PUT`
- **Path:** `/portfolios/companies/bulk-upload`
- **Tag:** `Portfolio`
- **operationId:** `put_portfolios-companies-bulk-upload`

## Description
Add companies in bulk to a portfolios

## Query Parameters
- `auth_mechanism` (optional, string) — propaged auth mechanism to distinguish platform requests and API integrations

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

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//portfolios/companies/bulk-upload' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

