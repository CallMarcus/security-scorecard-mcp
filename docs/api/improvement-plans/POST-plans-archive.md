# Archive list of plans by ID

- **Method:** `POST`
- **Path:** `/plans/archive`
- **Category:** `improvement-plans`
- **Operation ID:** `postPlansArchive`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/plans/archive' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
