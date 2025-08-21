# Deletes a list of tags by the given ids in a singl

- **Method:** `POST`
- **Path:** `/scorecard-tags/bulk-delete`
- **Category:** `companies`
- **Operation ID:** `post_scorecard-tags-bulk-delete`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/scorecard-tags/bulk-delete' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
