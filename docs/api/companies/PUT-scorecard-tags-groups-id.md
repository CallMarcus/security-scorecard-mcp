# Edit a scorecard tag group

- **Method:** `PUT`
- **Path:** `/scorecard-tags/groups/{id}`
- **Category:** `companies`
- **Operation ID:** `put_scorecard-tags-groups-id`

## Description

Edit a scorecard tag group

## Path Parameters

- `id` (**Required**) - tag group id

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
curl -X PUT \
  'https://platform.securityscorecard.io/scorecard-tags/groups/<id>' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
