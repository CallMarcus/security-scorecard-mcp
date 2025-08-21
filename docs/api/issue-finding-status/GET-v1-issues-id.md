# Obtain metadata for a given issue

- **Method:** `GET`
- **Path:** `/v1/issues/{id}`
- **Tag:** `issue finding status`
- **operationId:** `get_v1-issues-id`

## Description
Obtain metadata for a given issue

## Path Parameters
- `id` (**required**) — unique identifier of an issue

## Responses
### 200
List of IssueMetadata
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "company_id": {
            "type": "string"
          },
          "measurement_type": {
            "type": "string"
          },
          "measurement_id": {
            "type": "string"
          },
          "first_seen_time": {
            "type": "string"
          },
          "group_status": {
            "type": "string"
          },
          "last_seen_time": {
            "type": "string"
          },
          "parent_domain": {
            "type": "string"
          },
          "issue_type": {
            "type": "string"
          }
        },
        "additionalProperties": true
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of IssueMetadata"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/issues/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

