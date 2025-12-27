# Gets the status of a domain migration

- **Method:** `GET`
- **Path:** `/domain-migration-statuses/id/{id}`
- **Tag:** `DomainMigrationStatus`
- **operationId:** `get_domain-migration-statuses-id-id`

## Description
Gets the status of a domain migration

## Path Parameters
- `id` (**required**) — the migration ID

## Responses
### 200
migration response
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "source": {
      "type": "string"
    },
    "target": {
      "type": "string"
    },
    "status": {
      "type": "string"
    },
    "log": {
      "type": "object",
      "properties": {},
      "additionalProperties": true
    },
    "created_by": {
      "type": "string"
    },
    "created_at": {
      "type": "string"
    },
    "updated_at": {
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "source",
    "target",
    "status",
    "log",
    "created_by",
    "created_at",
    "updated_at"
  ]
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//domain-migration-statuses/id/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

