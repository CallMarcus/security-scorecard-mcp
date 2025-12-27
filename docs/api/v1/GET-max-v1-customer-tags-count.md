# Get customer tags count

- **Method:** `GET`
- **Path:** `/max/v1/customer/tags-count`
- **Tag:** `V1`
- **operationId:** `getV1CustomerTagsCount`

## Query Parameters
- `tiers` (optional, string) — Tiers to get tags count for
- `business_impact` (optional, string) — Business impact to get tags count for
- `incident_likelihood` (optional, string) — Incident likelihood to get tags count for
- `tag_type` (optional, string) — Tag types to get tags count for

## Responses
### 200
Count of tags for the customer
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "Tag name"
          },
          "value": {
            "type": "string",
            "description": "Tag value"
          },
          "count": {
            "type": "number",
            "description": "Count of the tag occurrences"
          }
        },
        "required": [
          "name",
          "value",
          "count"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```
### 403
Access denied due to insufficient permissions.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/tags-count' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

