# Gets the list of vendors for reports filtering

- **Method:** `GET`
- **Path:** `/max/v1/partner/reports/vendors`
- **Tag:** `V1`
- **operationId:** `getV1PartnerReportsVendors`

## Query Parameters
- `search` (optional, string) — word or phrase to search for
- `type` (**required**, string) — Report type (likelihood or remediation)
- `customer_domain` (optional, string) — Customer domain
- `is_published` (optional, string) — Is report published

## Responses
### 200
A list of vendors for reports filtering
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
            "description": "Vendor name"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          }
        },
        "required": [
          "name",
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
  'https://api.securityscorecard.io//max/v1/partner/reports/vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

