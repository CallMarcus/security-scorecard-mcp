# gets all contacts grouped by vendor domain

- **Method:** `GET`
- **Path:** `/v1/contacts/companies`
- **Tag:** `Contact`
- **operationId:** `get_v1-contacts-companies`

## Description
gets all contacts grouped by vendor domain

## Query Parameters
- `domains` (**required**, array) — company/vendor domains to retrieve contacts for
- `internal` (optional, boolean) — filter by internal contacts if true, external if false or undefined

## Responses
### 200
No response body

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/contacts/companies' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

