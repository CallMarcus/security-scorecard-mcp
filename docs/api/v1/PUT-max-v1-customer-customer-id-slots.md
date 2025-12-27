# update the slots for a customer

- **Method:** `PUT`
- **Path:** `/max/v1/customer/{customer_id}/slots`
- **Tag:** `V1`
- **operationId:** `putV1CustomerByCustomeridSlots`

## Path Parameters
- `customer_id` (**required**) — Customer ID to get the slots count

## Request Body
```json
{
  "type": "object",
  "properties": {
    "total": {
      "type": "number",
      "description": "slots to update set from intranet"
    }
  },
  "required": [
    "total"
  ],
  "additionalProperties": false
}
```

## Responses
### 204
Slot updated successfully

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/customer/<customer_id>/slots' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

