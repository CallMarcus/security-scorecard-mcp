# Unarchive list of plans by ID

- **Method:** `POST`
- **Path:** `/plans/unarchive`
- **Tag:** `action plans`
- **operationId:** `postPlansUnarchive`

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
  'https://api.securityscorecard.io//plans/unarchive' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

