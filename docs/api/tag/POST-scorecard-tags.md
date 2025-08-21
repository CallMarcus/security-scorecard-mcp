# Create a scorecard tag

- **Method:** `POST`
- **Path:** `/scorecard-tags`
- **Tag:** `Tag`
- **operationId:** `post_scorecard-tags`

## Description
Create a scorecard tag

## Request Body
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "x-example": "Example Tag Name"
    },
    "description": {
      "type": "string",
      "x-example": "Example Description"
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "description": "the created scorecard tag"
}
```

## Responses
### 200
a scorecard tag
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "unique identifier of the scorecard tag"
    },
    "name": {
      "type": "string",
      "x-example": "Example Tag Name"
    },
    "description": {
      "type": "string",
      "x-example": "Example Description"
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "description": "a scorecard tag"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//scorecard-tags' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

