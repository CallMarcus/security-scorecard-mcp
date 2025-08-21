# Deletes a list of indicator exclusions

- **Method:** `DELETE`
- **Path:** `/max/v1/indicators/exclusion/bulk/delete`
- **Tag:** `V1`
- **operationId:** `deleteV1IndicatorsExclusionBulkDelete`

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
    }
  },
  "required": [
    "ids"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Indicator Exclusions deleted correctly.

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/v1/indicators/exclusion/bulk/delete' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

