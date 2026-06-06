# Remove a managed customer and delete its managed p

- **Method:** `DELETE`
- **Path:** `/managed-services/customers/{customer_id}`
- **Category:** `managed-services`
- **Operation ID:** `delete_managed-services-customers-customer-id`

## Description

Remove a managed customer and delete its managed portfolio

## Path Parameters

- `customer_id` (**Required**) - id of a managed customer

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/managed-services/customers/<customer_id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
