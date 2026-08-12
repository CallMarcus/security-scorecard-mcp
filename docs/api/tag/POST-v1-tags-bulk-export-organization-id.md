# One-time per-org bulk export of all tags and tag g

- **Method:** `POST`
- **Path:** `/v1/tags/bulk-export/{organization_id}`
- **Tag:** `Tag`
- **operationId:** `post_v1-tags-bulk-export-organization-id`

## Description
One-time per-org bulk export of all tags and tag groups

## Path Parameters
- `organization_id` (**required**) — UUID of the organization to export

## Responses
### 200
Bulk export of all tags and tag groups for an organization
```json
{
  "type": "object",
  "properties": {
    "organization_id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$"
    },
    "exported_at": {
      "type": "string"
    },
    "tag_groups": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$"
          },
          "name": {
            "type": "string"
          },
          "created_at": {
            "type": "string"
          },
          "created_by": {
            "type": "string"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "created_at",
          "created_by"
        ]
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$"
          },
          "name": {
            "type": "string"
          },
          "group_ids": {
            "type": "array",
            "items": {
              "type": "string",
              "format": "uuid",
              "pattern": "^[\\da-z-]{16,}$"
            },
            "description": "UUIDs of every tag group this tag belongs to (empty array when none)"
          },
          "created_at": {
            "type": "string"
          },
          "created_by": {
            "type": "string"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "group_ids",
          "created_at",
          "created_by"
        ]
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "organization_id",
    "exported_at",
    "tag_groups",
    "tags"
  ],
  "description": "Bulk export of all tags and tag groups for an organization"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//v1/tags/bulk-export/<organization_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

