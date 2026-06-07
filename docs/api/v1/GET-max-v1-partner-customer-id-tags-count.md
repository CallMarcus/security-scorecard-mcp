# Get customer tags count for the given customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/tags-count`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridTagsCount`

## Path Parameters
- `customer_id` (**required**) — Customer ID to get tags count for

## Query Parameters
- `tiers` (optional, string) — Tiers to get tags count for
- `business_impact` (optional, string) — Business impact to get tags count for
- `incident_likelihood` (optional, string) — Incident likelihood to get tags count for
- `tag_type` (optional, string) — Tag types to get tags count for
- `tag` (optional, string) — Comma-separated list of tag names to filter vendors by

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
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/tags-count' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

