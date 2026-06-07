# Gets whether customer is a managed questionnaire customer

- **Method:** `GET`
- **Path:** `/max/v1/customers/{customerId}/managed-questionnaire`
- **Tag:** `V1`
- **operationId:** `getV1CustomersByCustomeridManagedQuestionnaire`

## Path Parameters
- `customer_id` (**required**) — Customer organization ID

## Responses
### 200
Managed questionnaire customer status
```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "description": "Customer organization ID"
    },
    "is_managed_questionnaire_customer": {
      "type": "boolean",
      "description": "Whether this is a managed questionnaire customer"
    }
  },
  "required": [
    "customer_id",
    "is_managed_questionnaire_customer"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customers/{customerId}/managed-questionnaire' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

