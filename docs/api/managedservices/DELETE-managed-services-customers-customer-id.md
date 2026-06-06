# Remove a managed customer and delete its managed p

- **Method:** `DELETE`
- **Path:** `/managed-services/customers/{customer_id}`
- **Tag:** `ManagedServices`
- **operationId:** `delete_managed-services-customers-customer-id`

## Description
Remove a managed customer and delete its managed portfolio

## Path Parameters
- `customer_id` (**required**) — id of a managed customer

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//managed-services/customers/<customer_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

