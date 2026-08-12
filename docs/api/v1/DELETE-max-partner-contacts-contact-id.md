# Remove a contact from a customer (or delete if last customer)

- **Method:** `DELETE`
- **Path:** `/max/partner/contacts/{contact_id}`
- **Tag:** `V1`
- **operationId:** `deleteV1ContactsById`

## Description
Removes the specified customer from the contact. If this is the last customer associated with the contact, the contact is deleted entirely.

## Path Parameters
- `id` (**required**) — Contact unique identifier

## Query Parameters
- `customer_id` (**required**, string) — Customer ID to remove from the contact

## Responses
### 204
Contact removed from customer successfully (or deleted if last customer)
### 403
Access denied due to insufficient permissions
### 404
Contact not found or not associated with the specified customer

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/partner/contacts/{contact_id}' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

