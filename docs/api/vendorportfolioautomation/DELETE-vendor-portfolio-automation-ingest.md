# bulk delete ingested vendors

- **Method:** `DELETE`
- **Path:** `/vendor-portfolio-automation/ingest`
- **Tag:** `VendorPortfolioAutomation`
- **operationId:** `delete_vendor-portfolio-automation-ingest`

## Description
bulk delete ingested vendors

## Request Body
```json
{
  "type": "object",
  "properties": {
    "source_ids": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "source_ids"
  ],
  "description": "delete vendors from an external source"
}
```

## Responses
### 204
No response body
### 403
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//vendor-portfolio-automation/ingest' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

