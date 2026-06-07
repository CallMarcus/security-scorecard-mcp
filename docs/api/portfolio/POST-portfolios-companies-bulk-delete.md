# Remove selected companies from selected portfolios

- **Method:** `POST`
- **Path:** `/portfolios/companies/bulk-delete`
- **Tag:** `Portfolio`
- **operationId:** `post_portfolios-companies-bulk-delete`

## Description
Remove selected companies from selected portfolios

## Request Body
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "companies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "tagType": {
      "type": "string"
    },
    "isForClearValues": {
      "type": "boolean"
    }
  },
  "additionalProperties": false,
  "required": [
    "ids",
    "companies"
  ]
}
```

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//portfolios/companies/bulk-delete' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

