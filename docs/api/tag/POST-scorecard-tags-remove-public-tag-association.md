# Deletes a list of tags by the given ids in a singl

- **Method:** `POST`
- **Path:** `/scorecard-tags/remove-public-tag-association`
- **Tag:** `Tag`
- **operationId:** `post_scorecard-tags-remove-public-tag-association`

## Description
Deletes a list of tags by the given ids in a single request

## Request Body
```json
{
  "type": "object",
  "properties": {
    "tag_name": {
      "type": "string",
      "description": "the public tag name"
    },
    "domain": {
      "type": "string",
      "description": "the domain where the public tag is going to be removed"
    }
  },
  "additionalProperties": false,
  "required": [
    "tag_name",
    "domain"
  ],
  "description": "Removes a public tag associated to the given domain"
}
```

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//scorecard-tags/remove-public-tag-association' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

