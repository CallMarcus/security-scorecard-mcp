# Updates whether customer is a managed questionnaire customer

- **Method:** `PUT`
- **Path:** `/max/v1/customers/{customerId}/managed-questionnaire`
- **Tag:** `V1`
- **operationId:** `putV1CustomersByCustomeridManagedQuestionnaire`

## Path Parameters
- `customer_id` (**required**) — Customer organization ID

## Request Body
```json
{
  "type": "object",
  "properties": {
    "is_managed_questionnaire_customer": {
      "type": "boolean",
      "description": "Whether to set this customer as a managed questionnaire customer"
    }
  },
  "required": [
    "is_managed_questionnaire_customer"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
Managed questionnaire customer status updated
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
### 404
Questionnaire bot mapping not found for customer

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//max/v1/customers/{customerId}/managed-questionnaire' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

