# Upserts executive summary for the managed customer

- **Method:** `PUT`
- **Path:** `/max/v1/partner/customers/{customer_id}/executive-summary`
- **Tag:** `V1`
- **operationId:** `putV1PartnerCustomersByCustomeridExecutiveSummary`

## Path Parameters
- `customer_id` (**required**) — The id of the managed customer

## Request Body
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "body": {
      "type": "string"
    }
  },
  "required": [
    "title",
    "body"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Executive summary updated.

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/partner/customers/<customer_id>/executive-summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

