# Deletes a list of tags by the given ids in a singl

- **Method:** `POST`
- **Path:** `/scorecard-tags/bulk-delete`
- **Tag:** `Tag`
- **operationId:** `post_scorecard-tags-bulk-delete`

## Description
Deletes a list of tags by the given ids in a single request

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
    "public_tags": {
      "type": "boolean"
    }
  },
  "additionalProperties": false,
  "required": [
    "ids"
  ],
  "description": "ids of tags"
}
```

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//scorecard-tags/bulk-delete' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

