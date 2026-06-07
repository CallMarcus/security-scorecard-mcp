# Remove a CC extra from a (customer, vendor)

- **Method:** `DELETE`
- **Path:** `/max/v1/partner/customers/{customerId}/vendors/{vendorId}/cc-extras/{ccEmail}`
- **Tag:** `V1`
- **operationId:** `deleteV1PartnerCustomersByCustomeridVendorsByVendoridCcExtrasByCcemail`

## Description
Removes the given email from the (customer, vendor) overlay. Idempotent — returns 204 whether or not the email was present.

## Path Parameters
- `customer_id` (**required**) — Customer ID
- `vendor_id` (**required**) — Vendor ID
- `cc_email` (**required**) — Email address to remove (URL-encoded)

## Responses
### 204
Removed (or did not exist)
### 400
Invalid email address
### 401
Unauthorized
### 403
Forbidden - insufficient permissions

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/v1/partner/customers/{customerId}/vendors/{vendorId}/cc-extras/{ccEmail}' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

