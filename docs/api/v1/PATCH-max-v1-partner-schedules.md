# Updates the custom due date for customer vendors pairs

- **Method:** `PATCH`
- **Path:** `/max/v1/partner/schedules`
- **Tag:** `V1`
- **operationId:** `patchV1PartnerSchedules`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "due_date": {
      "type": "string"
    },
    "customer_vendor_list": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "customer_domain": {
            "type": "string"
          },
          "vendor_domain": {
            "type": "string"
          }
        },
        "required": [
          "customer_domain",
          "vendor_domain"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "due_date",
    "customer_vendor_list"
  ],
  "additionalProperties": false
}
```

## Responses
### 204


## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//max/v1/partner/schedules' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

