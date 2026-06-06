# Create a new scorecard tag group

- **Method:** `POST`
- **Path:** `/scorecard-tags/groups`
- **Category:** `companies`
- **Operation ID:** `post_scorecard-tags-groups`

## Description

Create a new scorecard tag group

## Request Body

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "scorecard tag group name"
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "description": "Scorecard Tag Group Payload"
}
```

## Responses

### 200
Scorecard Tag Group
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "the id of the scorecard tag group"
    },
    "name": {
      "type": "string",
      "description": "scorecard tag group name"
    }
  },
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "description": "Scorecard Tag Group"
}
```

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/scorecard-tags/groups' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
