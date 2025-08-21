# Update a scorecard tag

- **Method:** `PUT`
- **Path:** `/scorecard-tags/{id}`
- **Tag:** `Tag`
- **operationId:** `put_scorecard-tags-id`

## Description
Update a scorecard tag

## Path Parameters
- `id` (**required**) — scorecard tag id

## Request Body
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
    },
    "privacy": {
      "type": "string",
      "default": "shared"
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "description": "the updated scorecard tag"
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
curl -X PUT \
  'https://api.securityscorecard.io//scorecard-tags/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

