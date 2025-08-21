# Archive list of plans by ID

- **Method:** `POST`
- **Path:** `/plans/archive`
- **Tag:** `action plans`
- **operationId:** `postPlansArchive`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "ids": {
      "type": "array",
      "description": "List of plan ids",
      "items": {
        "type": "string",
        "format": "uuid",
        "description": "unique plan id"
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


## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//plans/archive' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

