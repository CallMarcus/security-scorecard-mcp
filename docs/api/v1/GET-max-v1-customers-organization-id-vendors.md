# Gets the list of vendors for a customer across all portfolios

- **Method:** `GET`
- **Path:** `/max/v1/customers/{organization_id}/vendors`
- **Tag:** `V1`
- **operationId:** `getV1CustomersByOrganizationidVendors`

## Path Parameters
- `organization_id` (**required**) — customer (organization) ID

## Responses
### 200
Gets the list of vendors
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "scorecard_id": {
            "type": "string",
            "description": "Vendor scorecard id"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          }
        },
        "required": [
          "scorecard_id",
          "domain"
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

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customers/<organization_id>/vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

