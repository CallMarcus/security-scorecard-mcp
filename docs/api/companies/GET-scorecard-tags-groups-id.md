# Get a scorecard tag group

- **Method:** `GET`
- **Path:** `/scorecard-tags/groups/{id}`
- **Category:** `companies`
- **Operation ID:** `get_scorecard-tags-groups-id`

## Description

Get a scorecard tag group

## Path Parameters

- `id` (**Required**) - scorecard tag group id

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
curl -X GET \
  'https://platform.securityscorecard.io/scorecard-tags/groups/<id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
