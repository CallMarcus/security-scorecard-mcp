# Update the breach status of a vendor of a customer

- **Method:** `PUT`
- **Path:** `/max/v1/partner/customer/{customer_id}/vendor/{vendor_domain}`
- **Tag:** `V1`
- **operationId:** `putV1PartnerCustomerByCustomeridVendorByVendordomain`

## Path Parameters
- `customer_id` (**required**) — Id of the customer whoes vendor details are requested
- `vendor_domain` (**required**) — domain of the vendor whoes details are requested

## Request Body
```json
{
  "type": "object",
  "properties": {
    "breach_id": {
      "type": "string",
      "description": "id of the breach that you want to update"
    },
    "dismiss": {
      "type": "boolean",
      "description": "true if the we need to dismiss the active breach"
    }
  },
  "required": [
    "breach_id",
    "dismiss"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Breach status updated successfully

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/partner/customer/<customer_id>/vendor/<vendor_domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

